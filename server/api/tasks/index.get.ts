import { getDb, toObjectId } from '~/server/utils/db'
import type { Task } from '~/types'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const status = query.status as string
  const systemId = query.systemId as string
  const checkInId = query.checkInId as string

  const db = await getDb()
  const filter: any = {}
  if (status) {
    filter.status = status
  }
  if (systemId) {
    filter.systemId = toObjectId(systemId)
  }
  if (checkInId) {
    filter.checkInId = toObjectId(checkInId)
  }

  const tasks = await db.collection<Task>('tasks')
    .find(filter)
    .sort({ createdAt: -1 })
    .toArray()
  
  return tasks
})
