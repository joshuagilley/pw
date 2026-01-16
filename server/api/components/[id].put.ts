import { getDb, toObjectId } from '~/server/utils/db'
import type { Component } from '~/types'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'ID is required'
    })
  }
  
  const body = await readBody(event)
  const { name, notes, status, type, completed, completedAt } = body

  const db = await getDb()
  const update: Partial<Component> = {
    updatedAt: new Date()
  }

  if (name !== undefined) update.name = name
  if (notes !== undefined) update.notes = notes
  if (status !== undefined) update.status = status
  if (type !== undefined) update.type = type
  if (completed !== undefined) update.completed = completed
  if (completedAt !== undefined) {
    update.completedAt = completedAt ? new Date(completedAt) : undefined
  }

  const result = await db.collection('components').findOneAndUpdate(
    { _id: toObjectId(id) },
    { $set: update },
    { returnDocument: 'after' }
  )

  if (!result) {
    throw createError({
      statusCode: 404,
      message: 'Component not found'
    })
  }

  return result
})
