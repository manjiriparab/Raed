import { getDb } from './mongodb'

const DAILY_LIMIT = 2

interface UsageDoc {
  ip: string
  date: string // YYYY-MM-DD
  count: number
}

function todayString(): string {
  return new Date().toISOString().slice(0, 10) // e.g. "2026-06-12"
}

/**
 * Checks the IP's usage for today. If under the limit, increments the count.
 * Returns whether the request is allowed and how many messages remain.
 */
export async function checkAndIncrementUsage(ip: string): Promise<{
  allowed: boolean
  remaining: number
  limit: number
}> {
  const db = await getDb()
  const collection = db.collection<UsageDoc>('usage')
  const date = todayString()

  const existing = await collection.findOne({ ip, date })

  if (existing && existing.count >= DAILY_LIMIT) {
    return { allowed: false, remaining: 0, limit: DAILY_LIMIT }
  }

  // Increment (or create) the counter for today
  const result = await collection.findOneAndUpdate(
    { ip, date },
    { $inc: { count: 1 } },
    { upsert: true, returnDocument: 'after' }
  )

  const count = result?.count ?? 1
  return {
    allowed: true,
    remaining: Math.max(0, DAILY_LIMIT - count),
    limit: DAILY_LIMIT,
  }
}

/**
 * Returns remaining messages for an IP without incrementing.
 */
export async function getRemainingUsage(ip: string): Promise<{
  remaining: number
  limit: number
}> {
  const db = await getDb()
  const collection = db.collection<UsageDoc>('usage')
  const date = todayString()

  const existing = await collection.findOne({ ip, date })
  const count = existing?.count ?? 0

  return { remaining: Math.max(0, DAILY_LIMIT - count), limit: DAILY_LIMIT }
}

/**
 * Extracts the client IP from a Next.js request.
 */
export function getClientIp(headers: Headers): string {
  const forwarded = headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0].trim()
  return headers.get('x-real-ip') || 'unknown'
}
