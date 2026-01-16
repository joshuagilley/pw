import { getDb } from '~/server/utils/db'
import type { CheckIn } from '~/types'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { weekStart, weekEnd, wins, misses, notes, scorecard } = body

  if (!weekStart || !weekEnd) {
    throw createError({
      statusCode: 400,
      message: 'weekStart and weekEnd are required'
    })
  }

  const db = await getDb()
  const checkin: Omit<CheckIn, '_id'> = {
    weekStart: new Date(weekStart),
    weekEnd: new Date(weekEnd),
    wins: wins || '',
    misses: misses || '',
    notes: notes || '',
    scorecard: scorecard || {},
    createdAt: new Date(),
    updatedAt: new Date()
  }

  const result = await db.collection('checkins').insertOne(checkin)
  return { ...checkin, _id: result.insertedId.toString() }
})
