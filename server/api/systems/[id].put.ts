import { getDb, toObjectId } from '~/server/utils/db'
import type { System } from '~/types'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'ID is required'
    })
  }
  
  const body = await readBody(event)
  const { name, description, status } = body

  const db = await getDb()
  const update: Partial<System> = {
    updatedAt: new Date()
  }

  if (name !== undefined) update.name = name
  if (description !== undefined) update.description = description
  if (status !== undefined) update.status = status

  const result = await db.collection('systems').findOneAndUpdate(
    { _id: toObjectId(id) },
    { $set: update },
    { returnDocument: 'after' }
  )

  if (!result) {
    throw createError({
      statusCode: 404,
      message: 'System not found'
    })
  }

  return result
})
