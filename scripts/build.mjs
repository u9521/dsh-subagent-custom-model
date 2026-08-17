#!/usr/bin/env node
/**
 * Build script — DSH official tsdown pipeline, vendored into this repository.
 *
 * The official client-bundle preset lives at
 * external/deepseek-harness/packages/client/tsdown.client.ts (a copy of
 * deepseek-ai/deepseek-harness packages/client/tsdown.client.ts), so no
 * external DSH source checkout or soft-linking is needed — every build
 * dependency (tsdown, lightningcss, @deepseek-ai/cordis, typescript) comes
 * from local devDependencies:
 *   1. `tsc -p tsconfig.json` (type check + emit lib/types)
 *   2. `tsdown -c tsdown.config.mjs` (lib/index.js + lib/client.js)
 *
 * `--check` runs tsc --noEmit instead of emitting and bundling.
 */
import { spawnSync } from 'node:child_process'
import { mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const CHECK_ONLY = process.argv.includes('--check')

/** Run a binary with cwd=root, inheriting stdio; exit the process on failure. */
function run(command, args) {
  const result = spawnSync(command, args, { cwd: root, stdio: 'inherit' })
  if (result.status !== 0) process.exit(result.status ?? 1)
}

mkdirSync(join(root, 'lib'), { recursive: true })
const args = ['-p', 'tsconfig.json']
if (CHECK_ONLY) args.push('--noEmit', '--pretty', 'false')
run(process.execPath, [
  join(root, 'node_modules', 'typescript', 'bin', 'tsc'),
  ...args,
])
if (!CHECK_ONLY) {
  // Default log level on purpose: the vendored preset still emits deprecation
  // warnings (external/noExternal) worth keeping visible — they disappear
  // once upstream modernizes and `pnpm run sync` pulls the new preset.
  run(join(root, 'node_modules', '.bin', 'tsdown'), ['-c', 'tsdown.config.mjs'])
}
