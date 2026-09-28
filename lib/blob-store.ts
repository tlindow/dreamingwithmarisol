import { get, put } from '@vercel/blob'
import type { DeliveryRecord, DeliveryStore } from './fulfillment'

function pathname(sessionId: string) {
  return `orders/${sessionId}.json`
}

async function readRecord(sessionId: string): Promise<DeliveryRecord | null> {
  const result = await get(pathname(sessionId), { access: 'private', useCache: false })
  if (!result?.stream) return null
  const text = await new Response(result.stream).text()
  return JSON.parse(text) as DeliveryRecord
}

async function writeRecord(record: DeliveryRecord) {
  await put(pathname(record.sessionId), JSON.stringify(record), {
    access: 'private',
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: 'application/json',
  })
}

export function createBlobStore(): DeliveryStore {
  return {
    get: readRecord,
    async createIfAbsent(record) {
      const existing = await readRecord(record.sessionId)
      if (existing) return { created: false, record: existing }
      await writeRecord(record)
      return { created: true, record }
    },
    async addEvent(sessionId, eventId) {
      const found = await readRecord(sessionId)
      if (!found || found.eventIds.includes(eventId)) return
      found.eventIds.push(eventId)
      await writeRecord(found)
    },
    async markEmailed(sessionId) {
      const found = await readRecord(sessionId)
      if (!found) return
      found.emailed = true
      await writeRecord(found)
    },
    async consume(sessionId) {
      const found = await readRecord(sessionId)
      if (!found || found.remaining <= 0) return null
      found.remaining -= 1
      await writeRecord(found)
      return found
    },
  }
}

export function hasBlobToken() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN)
}
