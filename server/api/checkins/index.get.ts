import { getDb } from '~/server/utils/db'
import type { CheckIn } from '~/types'

export default defineEventHandler(async (event) => {
  const db = await getDb()
  const checkins = await db.collection<CheckIn>('checkins')
    .find({})
    .sort({ weekStart: -1 })
    .toArray()
  
  return checkins
})
