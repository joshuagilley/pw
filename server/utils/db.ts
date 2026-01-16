import { MongoClient, Db, ObjectId } from 'mongodb'

let client: MongoClient | null = null
let db: Db | null = null

export async function getDb(): Promise<Db> {
  const config = useRuntimeConfig()
  // Fallback to process.env for Fly.io secrets
  const mongodbUri = config.mongodbUri || process.env.MONGODB_URI
  const mongodbDb = config.mongodbDb || process.env.MONGODB_DB || 'prestige-worldwide'
  
  if (!mongodbUri) {
    throw new Error('MONGODB_URI is not configured. Please set it as a Fly.io secret using: fly secrets set MONGODB_URI=your-connection-string')
  }

  // If we have a client, check if it's connected - reconnect if not
  if (client) {
    // Check if topology exists and is not closed
    const topology = (client as any).topology
    if (topology && topology.s && topology.s.state === 'connected' && db) {
      return db
    }
    // Topology is closed or invalid, reset
    try {
      await client.close()
    } catch (closeError) {
      // Ignore close errors
    }
    client = null
    db = null
  }

  // Create new client if needed
  if (!client) {
    client = new MongoClient(mongodbUri, {
      serverSelectionTimeoutMS: 10000, // 10 second timeout
      socketTimeoutMS: 45000, // 45 second socket timeout
      connectTimeoutMS: 10000, // 10 second connection timeout
      maxPoolSize: 10,
      minPoolSize: 1,
    })
    
    try {
      await client.connect()
    } catch (error: any) {
      client = null
      throw new Error(`Failed to connect to MongoDB: ${error.message}. Please check your MONGODB_URI and ensure MongoDB is accessible from Fly.io.`)
    }
  }

  // Get database instance
  db = client.db(mongodbDb)
  return db
}

export async function closeDb() {
  if (client) {
    await client.close()
    client = null
    db = null
  }
}

// Helper to convert string ID to ObjectId if valid, otherwise return as string
export function toObjectId(id: string | undefined | null): ObjectId | string {
  if (!id) {
    throw new Error('ID is required')
  }
  if (ObjectId.isValid(id)) {
    return new ObjectId(id)
  }
  return id
}

// Helper to serialize MongoDB document for JSON response (converts ObjectIds to strings)
export function serializeDoc(doc: any): any {
  if (!doc) return doc
  
  if (Array.isArray(doc)) {
    return doc.map(serializeDoc)
  }
  
  if (doc._id && typeof doc._id.toString === 'function') {
    doc = { ...doc, _id: doc._id.toString() }
  }
  
  // Convert nested ObjectIds in the document
  const result: any = {}
  for (const [key, value] of Object.entries(doc)) {
    if (value && typeof value === 'object' && value.constructor === ObjectId) {
      result[key] = value.toString()
    } else if (Array.isArray(value)) {
      result[key] = value.map((item: any) => 
        item && typeof item === 'object' && item.constructor === ObjectId ? item.toString() : item
      )
    } else {
      result[key] = value
    }
  }
  
  return result
}
