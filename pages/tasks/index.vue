<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="mb-8 flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Tasks</h1>
        <p class="mt-2 text-sm text-gray-600">Manage your action items</p>
      </div>
      <button
        @click="showCreateModal = true"
        class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
      >
        New Task
      </button>
    </div>

    <div class="mb-4 flex space-x-4">
      <button
        @click="filter = 'all'"
        :class="filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'"
        class="px-4 py-2 text-sm font-medium rounded-md"
      >
        All
      </button>
      <button
        @click="filter = 'open'"
        :class="filter === 'open' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'"
        class="px-4 py-2 text-sm font-medium rounded-md"
      >
        Open
      </button>
      <button
        @click="filter = 'done'"
        :class="filter === 'done' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'"
        class="px-4 py-2 text-sm font-medium rounded-md"
      >
        Done
      </button>
    </div>

    <div v-if="loading" class="text-center py-12">
      <p class="text-gray-500">Loading...</p>
    </div>

    <div v-else-if="filteredTasks.length === 0" class="text-center py-12">
      <p class="text-gray-500">No tasks found.</p>
    </div>

    <div v-else class="space-y-3">
      <div
        v-for="task in filteredTasks"
        :key="task._id"
        class="bg-white shadow rounded-lg p-6"
      >
        <div class="flex items-start">
          <input
            type="checkbox"
            :checked="task.status === 'done'"
            @change="toggleTask(task)"
            class="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-0.5"
          />
          <div class="ml-4 flex-1">
            <h3 class="text-lg font-medium text-gray-900" :class="{ 'line-through text-gray-400': task.status === 'done' }">
              {{ task.title }}
            </h3>
            <p v-if="task.description" class="mt-1 text-sm text-gray-600">{{ task.description }}</p>
            <div class="mt-2 flex items-center space-x-4 text-xs text-gray-500">
              <span v-if="task.dueDate">Due: {{ formatDate(task.dueDate) }}</span>
              <span v-if="task.systemId">System: {{ getSystemName(task.systemId) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Create Modal -->
    <div v-if="showCreateModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50" @click="showCreateModal = false">
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white" @click.stop>
        <div class="mt-3">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Create Task</h3>
          <form @submit.prevent="handleCreate">
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">Title *</label>
              <input
                v-model="newTask.title"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                v-model="newTask.description"
                rows="3"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
              <input
                v-model="newTask.dueDate"
                type="date"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div class="flex justify-end space-x-3">
              <button
                type="button"
                @click="showCreateModal = false"
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
  </div>
</template>

<script setup lang="ts">
import type { Task, System } from '~/types'

const tasks = ref<Task[]>([])
const systems = ref<System[]>([])
const loading = ref(true)
const filter = ref<'all' | 'open' | 'done'>('all')
const showCreateModal = ref(false)
const creating = ref(false)
const newTask = ref({ title: '', description: '', dueDate: '' })

const filteredTasks = computed(() => {
  if (filter.value === 'all') return tasks.value
  return tasks.value.filter(t => t.status === filter.value)
})

const formatDate = (date: Date | string) => {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString()
}

const getSystemName = (systemId: string) => {
  const system = systems.value.find(s => s._id === systemId)
  return system?.name || systemId
}

const loadData = async () => {
  try {
    const [tasksData, systemsData] = await Promise.all([
      $fetch<Task[]>('/api/tasks', { credentials: 'include' }),
      $fetch<System[]>('/api/systems', { credentials: 'include' })
    ])
    
    tasks.value = tasksData
    systems.value = systemsData
  } catch (error) {
    console.error('Error loading tasks:', error)
  } finally {
    loading.value = false
  }
}

const handleCreate = async () => {
  creating.value = true
  try {
    const task = await $fetch<Task>('/api/tasks', {
      method: 'POST',
      body: {
        ...newTask.value,
        dueDate: newTask.value.dueDate || undefined
      },
      credentials: 'include'
    })
    tasks.value.push(task)
    newTask.value = { title: '', description: '', dueDate: '' }
    showCreateModal.value = false
  } catch (error) {
    console.error('Error creating task:', error)
  } finally {
    creating.value = false
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

onMounted(() => {
  loadData()
})
</script>
