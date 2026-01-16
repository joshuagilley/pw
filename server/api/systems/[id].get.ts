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
  
  const db = await getDb()
  const system = await db.collection<System>('systems').findOne({ _id: toObjectId(id) })
  
  if (!system) {
    throw createError({
      statusCode: 404,
      message: 'System not found'
    })
  }

  return system
})
