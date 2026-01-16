import { getDb } from '~/server/utils/db'
import type { System } from '~/types'

export default defineEventHandler(async (event) => {
  const db = await getDb()
  const systems = await db.collection<System>('systems')
    .find({ status: 'active' })
    .sort({ createdAt: -1 })
    .toArray()
  
  return systems.map(s => ({
    _id: s._id?.toString() || s._id,
    name: s.name,
    description: s.description,
    status: s.status,
    createdAt: s.createdAt,
    updatedAt: s.updatedAt
  }))
})
