import { getDb, toObjectId } from '~/server/utils/db'
import type { Connection } from '~/types'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { systemId, fromComponentId, toComponentId, type, notes } = body

  if (!systemId || !fromComponentId || !toComponentId || !type) {
    throw createError({
      statusCode: 400,
      message: 'systemId, fromComponentId, toComponentId, and type are required'
    })
  }

  const db = await getDb()
  const connection: any = {
    systemId: toObjectId(systemId),
    fromComponentId: toObjectId(fromComponentId),
    toComponentId: toObjectId(toComponentId),
    type,
    notes: notes || '',
    createdAt: new Date()
  }

  const result = await db.collection('connections').insertOne(connection)
  return { 
    ...connection, 
    _id: result.insertedId.toString(),
    systemId,
    fromComponentId,
    toComponentId
  }
})
