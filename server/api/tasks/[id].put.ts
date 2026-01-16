import { getDb, toObjectId } from '~/server/utils/db'
import type { Task } from '~/types'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'ID is required'
    })
  }
  
  const body = await readBody(event)
  const { title, description, status, dueDate } = body

  const db = await getDb()
  const update: Partial<Task> = {
    updatedAt: new Date()
  }

  if (title !== undefined) update.title = title
  if (description !== undefined) update.description = description
  if (status !== undefined) update.status = status
  if (dueDate !== undefined) update.dueDate = dueDate ? new Date(dueDate) : undefined

  const result = await db.collection('tasks').findOneAndUpdate(
    { _id: toObjectId(id) },
    { $set: update },
    { returnDocument: 'after' }
  )

  if (!result) {
    throw createError({
      statusCode: 404,
      message: 'Task not found'
    })
  }

  return result
})
