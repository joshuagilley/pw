import { getDb, toObjectId } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'ID is required'
    })
  }
  
  const db = await getDb()
  
  const result = await db.collection('connections').deleteOne({ _id: toObjectId(id) })
  
  if (result.deletedCount === 0) {
    throw createError({
      statusCode: 404,
      message: 'Connection not found'
    })
  }

  return { success: true }
})
