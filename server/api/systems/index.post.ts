import { getDb } from '~/server/utils/db'
import type { System } from '~/types'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { name, description } = body

  if (!name) {
    throw createError({
      statusCode: 400,
      message: 'Name is required'
    })
  }

  const db = await getDb()
  const system: Omit<System, '_id'> = {
    name,
    description: description || '',
    status: 'active',
    createdAt: new Date(),
    updatedAt: new Date()
  }

  const result = await db.collection('systems').insertOne(system)
  return { ...system, _id: result.insertedId.toString() }
})
