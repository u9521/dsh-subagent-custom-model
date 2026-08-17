#!/usr/bin/env node
/**
 * Sync the vendored DSH client-bundle preset with upstream
 * deepseek-ai/deepseek-harness.
 *
 * Downloads the files mirrored under external/deepseek-harness/packages/client/
 * and stamps each with a provenance header (date = today). The header is
 * ignored when comparing, so an unchanged upstream reports "unchanged" even
 * after the date rolls over.
 *
 * Requires `curl` on PATH (it honors http_proxy/https_proxy).
 *
 * Optional GitHub PAT for the commit-resolution API call (raises the API
 * rate limit from 60 to 5,000 requests/hour): set GITHUB_TOKEN or GH_TOKEN.
 *
 * Usage:
 *   node scripts/sync-tsdown.mjs             # interactive confirm per change
 *   node scripts/sync-tsdown.mjs --yes       # apply without asking
 *   node scripts/sync-tsdown.mjs --check     # report only; exit 1 when stale
 *   node scripts/sync-tsdown.mjs --branch <branch>
 */
import { spawnSync } from 'node:child_process'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import readline from 'node:readline'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const argv = process.argv.slice(2)
const YES = argv.includes('--yes') || argv.includes('-y')
const CHECK = argv.includes('--check')
const branchIndex = argv.indexOf('--branch')
const BRANCH =
  branchIndex >= 0 && argv[branchIndex + 1] ? argv[branchIndex + 1] : 'master'

// Optional GitHub PAT: GITHUB_TOKEN (GitHub Actions convention) or GH_TOKEN
// (gh CLI convention). Used only for the commit-resolution API request.
const TOKEN = process.env.GITHUB_TOKEN || process.env.GH_TOKEN || ''

const REPO = 'deepseek-ai/deepseek-harness'
const BASE = `https://raw.githubusercontent.com/${REPO}/${BRANCH}`
const FILES = [
  [
    'packages/client/tsdown.client.ts',
    'external/deepseek-harness/packages/client/tsdown.client.ts',
  ],
  [
    'packages/client/web/src/platform.ts',
    'external/deepseek-harness/packages/client/web/src/platform.ts',
  ],
]

const STAMP_RE = new RegExp(
  '^/\\*\\*\n \\* VENDORED COPY from deepseek-ai/deepseek-harness@[^\\n]*\n' +
    ' \\* [^\\n]*\n \\* Keep in sync with `pnpm run sync`:[^\\n]*\n \\*/\\n?',
)

function stamp(remote, commit) {
  return [
    '/**',
    ` * VENDORED COPY from ${REPO}@${BRANCH}`,
    ` * ${remote} (synced ${new Date().toISOString().slice(0, 10)}, upstream commit ${commit}).`,
    ' * Keep in sync with `pnpm run sync`:',
    ' */',
    '',
  ].join('\n')
}

function stripStamp(content) {
  return content.replace(STAMP_RE, '')
}

function curl(url) {
  const result = spawnSync('curl', ['-fsSL', '--max-time', '30', url], {
    encoding: 'utf8',
    maxBuffer: 4 * 1024 * 1024,
  })
  if (result.status !== 0) {
    throw new Error(
      `curl ${url} failed (${result.status ?? result.error?.message ?? 'unknown error'})`,
    )
  }
  return result.stdout
}

/**
 * Resolve the upstream commit whose tree the branch head serves for this
 * path (12-char short hash), or undefined when the GitHub API is unreachable.
 * Authenticates with the PAT from GITHUB_TOKEN/GH_TOKEN when present.
 */
function upstreamCommit(remote) {
  const url =
    `https://api.github.com/repos/${REPO}/commits` +
    `?path=${encodeURIComponent(remote)}&sha=${encodeURIComponent(BRANCH)}&per_page=1`
  const args = [
    '-fsSL',
    '--max-time',
    '30',
    '-H',
    'Accept: application/vnd.github+json',
  ]
  if (TOKEN !== '') args.push('-H', `Authorization: Bearer ${TOKEN}`)
  args.push(url)
  const result = spawnSync('curl', args, {
    encoding: 'utf8',
    maxBuffer: 4 * 1024 * 1024,
  })
  if (result.status !== 0) return undefined
  try {
    const sha = JSON.parse(result.stdout)?.[0]?.sha
    return typeof sha === 'string' ? sha.slice(0, 12) : undefined
  } catch {
    return undefined
  }
}

function ask(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close()
      resolve(/^y/i.test(answer.trim()))
    })
  })
}

let stale = false
for (const [remote, local] of FILES) {
  const url = `${BASE}/${remote}`
  const upstreamBody = stripStamp(curl(url))
  const commit = upstreamCommit(remote)
  if (commit === undefined) {
    console.warn(
      `sync-tsdown: could not resolve upstream commit for ${remote}; stamping 'unknown'`,
    )
  }
  const upstream = stamp(remote, commit ?? 'unknown') + upstreamBody
  const localPath = join(root, local)
  const current = existsSync(localPath) ? readFileSync(localPath, 'utf8') : null

  if (current !== null && stripStamp(current) === stripStamp(upstream)) {
    // Content is current; only rewrite when the provenance header predates
    // the upstream-commit record.
    const stampText = STAMP_RE.exec(current)?.[0] ?? ''
    if (STAMP_RE.test(current) && stampText.includes('upstream commit')) {
      console.log(`✓ unchanged  ${local}`)
      continue
    }
    // Content matches upstream but the file predates provenance headers.
    console.log(`~ needs stamp  ${local}`)
    stale = true
    if (CHECK) continue
    if (!YES && !(await ask(`    add provenance header to ${local}? [y/N] `))) {
      console.log('    skipped')
      continue
    }
    mkdirSync(dirname(localPath), { recursive: true })
    writeFileSync(localPath, upstream)
    console.log('    written')
    continue
  }

  stale = true
  if (current === null) {
    console.log(`+ new        ${local}`)
  } else {
    console.log(`~ differs    ${local}`)
    const diff = spawnSync('diff', ['-u', localPath, '-'], {
      input: upstream,
      encoding: 'utf8',
    })
    if (diff.status === 1 && diff.stdout) {
      const lines = diff.stdout.split('\n')
      console.log(lines.slice(0, 40).join('\n'))
      if (lines.length > 41) console.log('  … (truncated)')
    }
  }

  if (CHECK) continue
  if (
    !YES &&
    current !== null &&
    !(await ask(`    overwrite ${local}? [y/N] `))
  ) {
    console.log('    skipped')
    continue
  }
  mkdirSync(dirname(localPath), { recursive: true })
  writeFileSync(localPath, upstream)
  console.log('    written')
}

if (CHECK && stale) {
  console.error('sync-tsdown: vendored preset is stale (upstream differs)')
  process.exit(1)
}
if (!stale) console.log('sync-tsdown: already up to date')
