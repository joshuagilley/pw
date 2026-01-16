import { getDb, toObjectId } from '~/server/utils/db'
import type { Component } from '~/types'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { systemId, type, name, notes } = body

  if (!systemId || !type || !name) {
    throw createError({
      statusCode: 400,
      message: 'systemId, type, and name are required'
    })
  }

  const db = await getDb()
  const component: any = {
    systemId: toObjectId(systemId),
    type,
    name,
    notes: notes || '',
    status: 'active',
    createdAt: new Date(),
    updatedAt: new Date()
  }

  const result = await db.collection('components').insertOne(component)
  return { 
    ...component, 
    _id: result.insertedId.toString(),
    systemId: systemId // Keep as string for response
  }
})
