/**
 * DSH official client-bundle preset, vendored into external/ — no external
 * DSH source checkout required. See external/deepseek-harness/packages/client/
 * tsdown.client.ts. The path mirrors the upstream repository layout, so the
 * directory can later be swapped for a git submodule or sparse checkout of
 * deepseek-ai/deepseek-harness without touching this file.
 */
const { clientBundle } =
  await import('./external/deepseek-harness/packages/client/tsdown.client.ts')

export default clientBundle('@local/dsh-subagent-custom-model', [
  'lib/types/index.js',
])
