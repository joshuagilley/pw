import { getDb } from './db'
import type { User } from '~/types'

export async function hashPassword(password: string): Promise<string> {
  // Simple hash for MVP - in production use bcrypt or similar
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const passwordHash = await hashPassword(password)
  return passwordHash === hash
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const db = await getDb()
  return await db.collection<User>('users').findOne({ email })
}

export async function createUser(email: string, password: string, name: string, role: 'admin' | 'member' = 'member'): Promise<User> {
  const db = await getDb()
  const hashedPassword = await hashPassword(password)
  
  const user: Omit<User, '_id'> = {
    email,
    password: hashedPassword,
    name,
    role,
    createdAt: new Date(),
    updatedAt: new Date()
  }
  
  const result = await db.collection('users').insertOne(user)
  return { ...user, _id: result.insertedId.toString() } as User
}

export function getSessionUser(event: any): User | null {
  return event.context.user || null
}
