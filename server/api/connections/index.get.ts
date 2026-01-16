import { getDb, toObjectId } from '~/server/utils/db'
import type { Connection } from '~/types'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const systemId = query.systemId as string

  const db = await getDb()
  const filter: any = {}
  if (systemId) {
    filter.systemId = toObjectId(systemId)
  }

  const connections = await db.collection<Connection>('connections')
    .find(filter)
    .sort({ createdAt: -1 })
    .toArray()
  
  return connections
})
