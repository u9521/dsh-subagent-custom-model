import type { Context } from '@deepseek-ai/cordis'
import { getSkillDetail } from './discovery.ts'

export function registerSkillsRoutes(ctx: Context, webServer: any): () => void {
  const unregisterSkillContentRoute = webServer.register({
    kind: 'exact',
    path: '/api/session-settings/skills/content',
    handler: async (req: any, res: any) => {
      res.setHeader('Content-Type', 'application/json; charset=utf-8')
      const url = new URL(req.url ?? '/', 'http://localhost')
      const skillName = (url.searchParams.get('name') || '').trim()
      const reqSessionId =
        (url.searchParams.get('sessionId') || '').trim() || undefined

      if (!skillName) {
        res.writeHead(400)
        res.end(JSON.stringify({ ok: false, error: 'Skill name is required' }))
        return
      }

      const skill = await getSkillDetail(ctx, skillName, reqSessionId)
      if (!skill) {
        res.writeHead(404)
        res.end(
          JSON.stringify({
            ok: false,
            error: `Skill "${skillName}" not found`,
          }),
        )
        return
      }

      res.writeHead(200)
      res.end(JSON.stringify({ ok: true, skill }))
    },
  })

  return unregisterSkillContentRoute
}
