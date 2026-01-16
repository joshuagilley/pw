import { getDb, toObjectId } from '~/server/utils/db'
import type { Task } from '~/types'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { systemId, checkInId, title, description, dueDate } = body

  if (!title) {
    throw createError({
      statusCode: 400,
      message: 'Title is required'
    })
  }

  const db = await getDb()
  const task: any = {
    systemId: systemId ? toObjectId(systemId) : undefined,
    checkInId: checkInId ? toObjectId(checkInId) : undefined,
    title,
    description: description || '',
    status: 'open',
    dueDate: dueDate ? new Date(dueDate) : undefined,
    createdAt: new Date(),
    updatedAt: new Date()
  }

  const result = await db.collection('tasks').insertOne(task)
  return { 
    ...task, 
    _id: result.insertedId.toString(),
    systemId: systemId || undefined,
    checkInId: checkInId || undefined
  }
})
