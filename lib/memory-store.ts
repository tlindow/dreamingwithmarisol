import type { DeliveryRecord, DeliveryStore } from './fulfillment'

export function createMemoryStore(): DeliveryStore {
  const records = new Map<string, DeliveryRecord>()
  return {
    async get(sessionId) {
      const found = records.get(sessionId)
      return found ? { ...found, eventIds: [...found.eventIds] } : null
    },
    async createIfAbsent(record) {
      const existing = records.get(record.sessionId)
      if (existing) return { created: false, record: { ...existing, eventIds: [...existing.eventIds] } }
      records.set(record.sessionId, { ...record, eventIds: [...record.eventIds] })
      return { created: true, record: { ...record, eventIds: [...record.eventIds] } }
    },
    async addEvent(sessionId, eventId) {
      const found = records.get(sessionId)
      if (!found || found.eventIds.includes(eventId)) return
      found.eventIds.push(eventId)
    },
    async markEmailed(sessionId) {
      const found = records.get(sessionId)
      if (found) found.emailed = true
    },
    async consume(sessionId) {
      const found = records.get(sessionId)
      if (!found || found.remaining <= 0) return null
      found.remaining -= 1
      return { ...found, eventIds: [...found.eventIds] }
    },
  }
}
