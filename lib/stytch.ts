import { Client, envs } from 'stytch'

let client: Client | null = null

export function getStytch() {
  const projectId = process.env.STYTCH_PROJECT_ID
  const secret = process.env.STYTCH_SECRET
  if (!projectId || !secret) throw new Error('Stytch is not configured')
  if (!client) {
    client = new Client({
      project_id: projectId,
      secret,
      env: process.env.STYTCH_PROJECT_ENV === 'live' ? envs.live : envs.test,
    })
  }
  return client
}
