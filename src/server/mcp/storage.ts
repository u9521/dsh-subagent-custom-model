import fs from 'node:fs'
import type { McpServerStore } from '../../types.ts'
import { getMcpStoragePath } from '../common/paths.ts'

export function loadMcpStore(): McpServerStore {
  try {
    const file = getMcpStoragePath()
    if (fs.existsSync(file)) {
      const data = JSON.parse(fs.readFileSync(file, 'utf8'))
      if (data && typeof data === 'object' && data.servers) {
        return { servers: data.servers }
      }
    }
  } catch {}
  return { servers: {} }
}

export function saveMcpStore(store: McpServerStore): void {
  try {
    const file = getMcpStoragePath()
    const tmp = `${file}.tmp`
    fs.writeFileSync(tmp, JSON.stringify(store, null, 2), 'utf8')
    fs.renameSync(tmp, file)
  } catch {}
}
