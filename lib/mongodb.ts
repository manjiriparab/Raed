import { MongoClient, Db } from 'mongodb'

// Reuse the connection across requests (important for serverless)
let cachedClient: MongoClient | null = null
let cachedDb: Db | null = null

export async function getDb(): Promise<Db> {
  const uri = process.env.MONGODB_URI
  const dbName = process.env.MONGODB_DB || 'layla'

  if (!uri) {
    throw new Error('Missing MONGODB_URI environment variable')
  }

  if (cachedDb) return cachedDb

  if (!cachedClient) {
    cachedClient = new MongoClient(uri as string)
    await cachedClient.connect()
  }

  cachedDb = cachedClient.db(dbName)
  return cachedDb
}
