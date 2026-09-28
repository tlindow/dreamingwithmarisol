import { createClient, type SanityClient } from '@sanity/client'

export const projectId = 't8kqnnav'
export const dataset = 'production'
const apiVersion = '2025-02-24'

export function getSanityReader(): SanityClient {
  return createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: true,
    token: process.env.SANITY_API_READ_TOKEN,
  })
}

export function getSanityWriter(): SanityClient | null {
  const token = process.env.SANITY_API_TOKEN
  if (!token) return null
  return createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: false,
    token,
  })
}
