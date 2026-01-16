<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div v-if="loading" class="text-center py-12">
      <p class="text-gray-500">Loading...</p>
    </div>

    <div v-else-if="!system" class="text-center py-12">
      <p class="text-gray-500">System not found</p>
    </div>

    <div v-else>
      <div class="mb-8">
        <NuxtLink to="/systems" class="text-sm text-blue-600 hover:text-blue-700 mb-4 inline-block">
          ← Back to Systems
        </NuxtLink>
        <div class="flex items-center justify-between mt-4">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">{{ system.name }}</h1>
            <p v-if="system.description" class="mt-2 text-sm text-gray-600">{{ system.description }}</p>
          </div>
          <button
            @click="showComponentModal = true"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Add Component
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Components -->
        <div class="lg:col-span-2">
          <div class="bg-white shadow rounded-lg p-6">
            <h2 class="text-xl font-semibold text-gray-900 mb-4">Components</h2>
            <div v-if="components.length === 0" class="text-sm text-gray-500">
              No components yet. Add one to get started.
            </div>
            <div v-else class="space-y-3">
              <div
                v-for="component in components"
                :key="component._id"
                class="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
              >
                <div>
                  <span class="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded mr-2">
                    {{ component.type }}
                  </span>
                  <span class="font-medium text-gray-900">{{ component.name }}</span>
                  <p v-if="component.notes" class="text-sm text-gray-500 mt-1">{{ component.notes }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Connections -->
          <div class="bg-white shadow rounded-lg p-6 mt-6">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-xl font-semibold text-gray-900">Connections</h2>
              <button
                @click="showConnectionModal = true"
                class="text-sm px-3 py-1 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50"
              >
                Add Connection
              </button>
            </div>
            <div v-if="connections.length === 0" class="text-sm text-gray-500">
              No connections yet.
            </div>
            <div v-else class="space-y-2">
              <div
                v-for="conn in connections"
                :key="conn._id"
                class="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
              >
                <div class="text-sm">
                  <span class="font-medium">{{ getComponentName(conn.fromComponentId) }}</span>
                  <span class="mx-2 text-gray-400">→</span>
                  <span class="font-medium">{{ getComponentName(conn.toComponentId) }}</span>
                  <span class="ml-2 text-xs text-gray-500">({{ conn.type }})</span>
                </div>
                <button
                  @click="deleteConnection(conn._id!)"
                  class="text-red-600 hover:text-red-700 text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Sidebar -->
        <div>
          <div class="bg-white shadow rounded-lg p-6">
            <h2 class="text-xl font-semibold text-gray-900 mb-4">System Tasks</h2>
            <div v-if="systemTasks.length === 0" class="text-sm text-gray-500">
              No tasks for this system.
            </div>
            <div v-else class="space-y-2">
              <div
                v-for="task in systemTasks"
                :key="task._id"
                class="flex items-center text-sm"
              >
                <input
                  type="checkbox"
                  :checked="task.status === 'done'"
                  @change="toggleTask(task)"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span class="ml-2" :class="{ 'line-through text-gray-400': task.status === 'done' }">
                  {{ task.title }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Component Modal -->
    <div v-if="showComponentModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50" @click="showComponentModal = false">
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white" @click.stop>
        <div class="mt-3">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Add Component</h3>
          <form @submit.prevent="handleCreateComponent">
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">Type *</label>
              <select
                v-model="newComponent.type"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="Account">Account</option>
                <option value="Bill">Bill</option>
                <option value="Goal">Goal</option>
                <option value="Routine">Routine</option>
                <option value="Checklist">Checklist</option>
                <option value="Metric">Metric</option>
              </select>
            </div>
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">Name *</label>
              <input
                v-model="newComponent.name"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <textarea
                v-model="newComponent.notes"
                rows="3"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div class="flex justify-end space-x-3">
              <button
                type="button"
                @click="showComponentModal = false"
                class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                :disabled="creating"
                class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {{ creating ? 'Creating...' : 'Create' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Connection Modal -->
    <div v-if="showConnectionModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50" @click="showConnectionModal = false">
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white" @click.stop>
        <div class="mt-3">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Add Connection</h3>
          <form @submit.prevent="handleCreateConnection">
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">From Component *</label>
              <select
                v-model="newConnection.fromComponentId"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select component...</option>
                <option v-for="comp in components" :key="comp._id" :value="comp._id">
                  {{ comp.name }} ({{ comp.type }})
                </option>
              </select>
            </div>
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">To Component *</label>
              <select
                v-model="newConnection.toComponentId"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select component...</option>
                <option v-for="comp in components" :key="comp._id" :value="comp._id">
                  {{ comp.name }} ({{ comp.type }})
                </option>
              </select>
            </div>
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">Connection Type *</label>
              <select
                v-model="newConnection.type"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="FUNDS">FUNDS (Account → Goal)</option>
                <option value="PAYS">PAYS (Account → Bill)</option>
                <option value="AFFECTS">AFFECTS (Routine/Checklist → Goal/Metric)</option>
                <option value="TRACKS">TRACKS (System → Metric)</option>
              </select>
            </div>
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <textarea
                v-model="newConnection.notes"
                rows="2"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div class="flex justify-end space-x-3">
              <button
                type="button"
                @click="showConnectionModal = false"
                class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                :disabled="creatingConnection"
                class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {{ creatingConnection ? 'Creating...' : 'Create' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { System, Component, Connection, Task } from '~/types'

const route = useRoute()
const systemId = route.params.id as string

const system = ref<System | null>(null)
const components = ref<Component[]>([])
const connections = ref<Connection[]>([])
const systemTasks = ref<Task[]>([])
const loading = ref(true)
const showComponentModal = ref(false)
const showConnectionModal = ref(false)
const creating = ref(false)
const creatingConnection = ref(false)
const newComponent = ref({ type: 'Account' as Component['type'], name: '', notes: '' })
const newConnection = ref({ fromComponentId: '', toComponentId: '', type: 'FUNDS' as Connection['type'], notes: '' })

const loadData = async () => {
  try {
    const [systemData, componentsData, connectionsData, tasksData] = await Promise.all([
      $fetch<System>(`/api/systems/${systemId}`, { credentials: 'include' }),
      $fetch<Component[]>(`/api/components?systemId=${systemId}`, { credentials: 'include' }),
      $fetch<Connection[]>(`/api/connections?systemId=${systemId}`, { credentials: 'include' }),
      $fetch<Task[]>(`/api/tasks?systemId=${systemId}`, { credentials: 'include' })
    ])
    
    system.value = systemData
    components.value = componentsData
    connections.value = connectionsData
    systemTasks.value = tasksData
  } catch (error) {
    console.error('Error loading system data:', error)
  } finally {
    loading.value = false
  }
}

const getComponentName = (componentId: string) => {
  const component = components.value.find(c => c._id === componentId)
  return component?.name || componentId
}

const handleCreateComponent = async () => {
  creating.value = true
  try {
    const component = await $fetch<Component>('/api/components', {
      method: 'POST',
      body: {
        ...newComponent.value,
        systemId
      },
      credentials: 'include'
    })
    components.value.push(component)
    newComponent.value = { type: 'Account', name: '', notes: '' }
    showComponentModal.value = false
  } catch (error) {
    console.error('Error creating component:', error)
  } finally {
    creating.value = false
  }
}

const deleteConnection = async (connectionId: string) => {
  if (!confirm('Delete this connection?')) return
  
  try {
    await $fetch(`/api/connections/${connectionId}`, {
      method: 'DELETE',
      credentials: 'include'
    })
    await loadData()
  } catch (error) {
    console.error('Error deleting connection:', error)
  }
}

const toggleTask = async (task: Task) => {
  const newStatus = task.status === 'open' ? 'done' : 'open'
  try {
    await $fetch(`/api/tasks/${task._id}`, {
      method: 'PUT',
      body: { status: newStatus },
      credentials: 'include'
    })
    await loadData()
  } catch (error) {
    console.error('Error updating task:', error)
  }
}

const handleCreateConnection = async () => {
  if (!newConnection.value.fromComponentId || !newConnection.value.toComponentId) {
    alert('Please select both components')
    return
  }
  
  creatingConnection.value = true
  try {
    const connection = await $fetch<Connection>('/api/connections', {
      method: 'POST',
      body: {
        ...newConnection.value,
        systemId
      },
      credentials: 'include'
    })
    connections.value.push(connection)
    newConnection.value = { fromComponentId: '', toComponentId: '', type: 'FUNDS', notes: '' }
    showConnectionModal.value = false
  } catch (error) {
    console.error('Error creating connection:', error)
    alert('Failed to create connection')
  } finally {
    creatingConnection.value = false
  }
}

onMounted(() => {
  loadData()
})
</script>
