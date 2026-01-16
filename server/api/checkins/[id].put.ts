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
  
  const body = await readBody(event)
  const { wins, misses, notes, scorecard } = body

  const db = await getDb()
  const update: Partial<CheckIn> = {
    updatedAt: new Date()
  }

  if (wins !== undefined) update.wins = wins
  if (misses !== undefined) update.misses = misses
  if (notes !== undefined) update.notes = notes
  if (scorecard !== undefined) update.scorecard = scorecard

  const result = await db.collection('checkins').findOneAndUpdate(
    { _id: toObjectId(id) },
    { $set: update },
    { returnDocument: 'after' }
  )

  if (!result) {
    throw createError({
      statusCode: 404,
      message: 'Check-in not found'
    })
  }

  return result
})
