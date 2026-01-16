export type ComponentType = 'Account' | 'Bill' | 'Goal' | 'Routine' | 'Checklist' | 'Metric'
export type ConnectionType = 'FUNDS' | 'PAYS' | 'AFFECTS' | 'TRACKS'
export type TaskStatus = 'open' | 'done'
export type EntityStatus = 'active' | 'archived'

export interface User {
  _id?: string
  email: string
  password: string // hashed
  name: string
  role: 'admin' | 'member'
  createdAt: Date
  updatedAt: Date
}

export interface System {
  _id?: string
  name: string
  description?: string
  status: EntityStatus
  createdAt: Date
  updatedAt: Date
}

export interface Component {
  _id?: string
  systemId: string
  type: ComponentType
  name: string
  notes?: string
  status: EntityStatus
  completed?: boolean
  completedAt?: Date
  createdAt: Date
  updatedAt: Date
}

export interface Connection {
  _id?: string
  systemId: string
  fromComponentId: string
  toComponentId: string
  type: ConnectionType
  notes?: string
  createdAt: Date
}

export interface CheckIn {
  _id?: string
  weekStart: Date
  weekEnd: Date
  wins?: string
  misses?: string
  notes?: string
  scorecard?: Record<string, number> // e.g. { finance: 4, home: 3 }
  createdAt: Date
  updatedAt: Date
}

export interface Task {
  _id?: string
  systemId?: string
  checkInId?: string
  title: string
  description?: string
  status: TaskStatus
  dueDate?: Date
  createdAt: Date
  updatedAt: Date
}
