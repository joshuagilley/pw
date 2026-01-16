import { getDb, toObjectId } from '~/server/utils/db'
import type { Component } from '~/types'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const systemId = query.systemId as string

  const db = await getDb()
  const filter: any = { status: 'active' }
  if (systemId) {
    filter.systemId = toObjectId(systemId)
  }

  const components = await db.collection<Component>('components')
    .find(filter)
    .sort({ createdAt: -1 })
    .toArray()
  
  return components
})
