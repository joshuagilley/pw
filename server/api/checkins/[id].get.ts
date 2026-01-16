import { getDb, toObjectId } from '~/server/utils/db'
import type { CheckIn } from '~/types'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'ID is required'
    })
  }
  
  const db = await getDb()
  const checkin = await db.collection<CheckIn>('checkins').findOne({ _id: toObjectId(id) })
  
  if (!checkin) {
    throw createError({
      statusCode: 404,
      message: 'Check-in not found'
    })
  }

  return checkin
})
