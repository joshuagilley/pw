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
        <NuxtLink to="/systems" class="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 mb-4 inline-block transition-colors duration-200">
          ← Back to Systems
        </NuxtLink>
        <div class="flex items-center justify-between mt-4">
          <div>
            <h1 class="text-3xl font-bold text-gray-900 dark:text-primary-400 transition-colors duration-200">{{ system.name }}</h1>
            <p v-if="system.description" class="mt-2 text-sm text-gray-600 dark:text-gray-400 transition-colors duration-200">{{ system.description }}</p>
          </div>
          <button
            @click="showComponentModal = true"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 transition-colors duration-200"
          >
            Add Component
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Components -->
        <div class="lg:col-span-2">
          <div class="bg-white dark:bg-dark-100 shadow rounded-lg p-6 border border-gray-200 dark:border-dark-200 transition-colors duration-200">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-primary-400 mb-4 transition-colors duration-200">Components</h2>
            <div v-if="components.length === 0" class="text-sm text-gray-500 dark:text-gray-400">
              No components yet. Add one to get started.
            </div>
            <div v-else class="space-y-3">
              <div
                v-for="component in components"
                :key="component._id"
                class="flex items-center justify-between p-3 border border-gray-200 dark:border-dark-200 rounded-lg transition-colors duration-200"
                :class="{ 'bg-green-50 dark:bg-primary-950/30 border-green-200 dark:border-primary-700': component.completed, 'bg-white dark:bg-dark-100': !component.completed }"
              >
                <div class="flex items-center flex-1">
                  <input
                    type="checkbox"
                    :checked="component.completed || false"
                    @change="toggleComponent(component)"
                    class="h-5 w-5 text-primary-600 dark:text-primary-400 focus:ring-primary-500 border-gray-300 dark:border-dark-300 rounded mr-3 transition-colors duration-200"
                  />
                  <div class="flex-1">
                    <span class="inline-block px-2 py-1 text-xs font-medium bg-primary-100 dark:bg-primary-900/50 text-primary-800 dark:text-primary-300 rounded mr-2 transition-colors duration-200">
                      {{ component.type }}
                    </span>
                    <span 
                      class="font-medium text-gray-900 dark:text-gray-200 transition-colors duration-200"
                      :class="{ 'line-through text-gray-400 dark:text-gray-500': component.completed }"
                    >
                      {{ component.name }}
                    </span>
                    <p v-if="component.notes" class="text-sm text-gray-500 dark:text-gray-400 mt-1 transition-colors duration-200">{{ component.notes }}</p>
                    <p v-if="component.completed && component.completedAt" class="text-xs text-gray-400 dark:text-gray-500 mt-1 transition-colors duration-200">
                      Completed {{ formatDate(component.completedAt) }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Connections -->
          <div class="bg-white dark:bg-dark-100 shadow rounded-lg p-6 mt-6 border border-gray-200 dark:border-dark-200 transition-colors duration-200">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-xl font-semibold text-gray-900 dark:text-primary-400 transition-colors duration-200">Connections</h2>
              <button
                @click="showConnectionModal = true"
                class="text-sm px-3 py-1 border border-primary-600 dark:border-primary-500 text-primary-600 dark:text-primary-400 rounded-md hover:bg-primary-50 dark:hover:bg-primary-900/30 transition-colors duration-200"
              >
                Add Connection
              </button>
            </div>
            <div v-if="connections.length === 0" class="text-sm text-gray-500 dark:text-gray-400">
              No connections yet.
            </div>
            <div v-else class="space-y-2">
              <div
                v-for="conn in connections"
                :key="conn._id"
                class="flex items-center justify-between p-3 border border-gray-200 dark:border-dark-200 rounded-lg bg-white dark:bg-dark-100 transition-colors duration-200"
              >
                <div class="text-sm">
                  <span class="font-medium text-gray-900 dark:text-gray-200 transition-colors duration-200">{{ getComponentName(conn.fromComponentId) }}</span>
                  <span class="mx-2 text-gray-400 dark:text-gray-500">→</span>
                  <span class="font-medium text-gray-900 dark:text-gray-200 transition-colors duration-200">{{ getComponentName(conn.toComponentId) }}</span>
                  <span class="ml-2 text-xs text-gray-500 dark:text-gray-400">({{ conn.type }})</span>
                </div>
                <button
                  @click="deleteConnection(conn._id!)"
                  class="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 text-sm transition-colors duration-200"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Sidebar -->
        <div>
          <div class="bg-white dark:bg-dark-100 shadow rounded-lg p-6 border border-gray-200 dark:border-dark-200 transition-colors duration-200">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-primary-400 mb-4 transition-colors duration-200">System Tasks</h2>
            <div v-if="systemTasks.length === 0" class="text-sm text-gray-500 dark:text-gray-400">
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
                  class="h-4 w-4 text-primary-600 dark:text-primary-400 focus:ring-primary-500 border-gray-300 dark:border-dark-300 rounded transition-colors duration-200"
                />
                <span class="ml-2 text-gray-900 dark:text-gray-200 transition-colors duration-200" :class="{ 'line-through text-gray-400 dark:text-gray-500': task.status === 'done' }">
                  {{ task.title }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Component Modal -->
    <div v-if="showComponentModal" class="fixed inset-0 bg-gray-600 dark:bg-black bg-opacity-50 dark:bg-opacity-75 overflow-y-auto h-full w-full z-50 transition-colors duration-200" @click="showComponentModal = false">
      <div class="relative top-20 mx-auto p-5 border border-gray-200 dark:border-dark-200 w-96 shadow-lg rounded-md bg-white dark:bg-dark-100 transition-colors duration-200" @click.stop>
        <div class="mt-3">
          <h3 class="text-lg font-medium text-gray-900 dark:text-primary-400 mb-4 transition-colors duration-200">Add Component</h3>
          <form @submit.prevent="handleCreateComponent">
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-200">Type *</label>
              <select
                v-model="newComponent.type"
                required
                class="w-full px-3 py-2 border border-gray-300 dark:border-dark-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-dark-50 dark:text-gray-200 transition-colors duration-200"
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
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-200">Name *</label>
              <input
                v-model="newComponent.name"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 dark:border-dark-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-dark-50 dark:text-gray-200 transition-colors duration-200"
              />
            </div>
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-200">Notes</label>
              <textarea
                v-model="newComponent.notes"
                rows="3"
                class="w-full px-3 py-2 border border-gray-300 dark:border-dark-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-dark-50 dark:text-gray-200 transition-colors duration-200"
              />
            </div>
            <div class="flex justify-end space-x-3">
              <button
                type="button"
                @click="showComponentModal = false"
                class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-dark-200 rounded-md hover:bg-gray-200 dark:hover:bg-dark-300 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                :disabled="creating"
                class="px-4 py-2 text-sm font-medium text-white bg-primary-600 dark:bg-primary-500 rounded-md hover:bg-primary-700 dark:hover:bg-primary-600 disabled:opacity-50 transition-colors duration-200"
              >
                {{ creating ? 'Creating...' : 'Create' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Connection Modal -->
    <div v-if="showConnectionModal" class="fixed inset-0 bg-gray-600 dark:bg-black bg-opacity-50 dark:bg-opacity-75 overflow-y-auto h-full w-full z-50 transition-colors duration-200" @click="showConnectionModal = false">
      <div class="relative top-20 mx-auto p-5 border border-gray-200 dark:border-dark-200 w-96 shadow-lg rounded-md bg-white dark:bg-dark-100 transition-colors duration-200" @click.stop>
        <div class="mt-3">
          <h3 class="text-lg font-medium text-gray-900 dark:text-primary-400 mb-4 transition-colors duration-200">Add Connection</h3>
          <form @submit.prevent="handleCreateConnection">
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-200">From Component *</label>
              <select
                v-model="newConnection.fromComponentId"
                required
                class="w-full px-3 py-2 border border-gray-300 dark:border-dark-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-dark-50 dark:text-gray-200 transition-colors duration-200"
              >
                <option value="">Select component...</option>
                <option v-for="comp in components" :key="comp._id" :value="comp._id">
                  {{ comp.name }} ({{ comp.type }})
                </option>
              </select>
            </div>
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-200">To Component *</label>
              <select
                v-model="newConnection.toComponentId"
                required
                class="w-full px-3 py-2 border border-gray-300 dark:border-dark-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-dark-50 dark:text-gray-200 transition-colors duration-200"
              >
                <option value="">Select component...</option>
                <option v-for="comp in components" :key="comp._id" :value="comp._id">
                  {{ comp.name }} ({{ comp.type }})
                </option>
              </select>
            </div>
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-200">Connection Type *</label>
              <select
                v-model="newConnection.type"
                required
                class="w-full px-3 py-2 border border-gray-300 dark:border-dark-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-dark-50 dark:text-gray-200 transition-colors duration-200"
              >
                <option value="FUNDS">FUNDS (Account → Goal)</option>
                <option value="PAYS">PAYS (Account → Bill)</option>
                <option value="AFFECTS">AFFECTS (Routine/Checklist → Goal/Metric)</option>
                <option value="TRACKS">TRACKS (System → Metric)</option>
              </select>
            </div>
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-200">Notes</label>
              <textarea
                v-model="newConnection.notes"
                rows="2"
                class="w-full px-3 py-2 border border-gray-300 dark:border-dark-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-dark-50 dark:text-gray-200 transition-colors duration-200"
              />
            </div>
            <div class="flex justify-end space-x-3">
              <button
                type="button"
                @click="showConnectionModal = false"
                class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-dark-200 rounded-md hover:bg-gray-200 dark:hover:bg-dark-300 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                :disabled="creatingConnection"
                class="px-4 py-2 text-sm font-medium text-white bg-primary-600 dark:bg-primary-500 rounded-md hover:bg-primary-700 dark:hover:bg-primary-600 disabled:opacity-50 transition-colors duration-200"
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

const toggleComponent = async (component: Component) => {
  const newCompleted = !component.completed
  try {
    const updated = await $fetch<Component>(`/api/components/${component._id}`, {
      method: 'PUT',
      body: {
        completed: newCompleted,
        completedAt: newCompleted ? new Date() : undefined
      },
      credentials: 'include'
    })
    // Update the component in the list
    const index = components.value.findIndex(c => c._id === component._id)
    if (index !== -1) {
      components.value[index] = updated
    }
  } catch (error) {
    console.error('Error updating component:', error)
  }
}

const formatDate = (date: Date | string) => {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString()
}

onMounted(() => {
  loadData()
})
</script>
