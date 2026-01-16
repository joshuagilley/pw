<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="mb-8 flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-primary-400 transition-colors duration-200">Tasks</h1>
        <p class="mt-2 text-sm text-gray-600 dark:text-gray-400 transition-colors duration-200">Manage your action items</p>
      </div>
      <button
        @click="showCreateModal = true"
        class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 transition-colors duration-200"
      >
        New Task
      </button>
    </div>

    <div class="mb-4 flex space-x-4">
      <button
        @click="filter = 'all'"
        :class="filter === 'all' ? 'bg-primary-600 dark:bg-primary-500 text-white' : 'bg-gray-100 dark:bg-dark-200 text-gray-700 dark:text-gray-300'"
        class="px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200"
      >
        All
      </button>
      <button
        @click="filter = 'open'"
        :class="filter === 'open' ? 'bg-primary-600 dark:bg-primary-500 text-white' : 'bg-gray-100 dark:bg-dark-200 text-gray-700 dark:text-gray-300'"
        class="px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200"
      >
        Open
      </button>
      <button
        @click="filter = 'done'"
        :class="filter === 'done' ? 'bg-primary-600 dark:bg-primary-500 text-white' : 'bg-gray-100 dark:bg-dark-200 text-gray-700 dark:text-gray-300'"
        class="px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200"
      >
        Done
      </button>
    </div>

    <div v-if="loading" class="text-center py-12">
      <p class="text-gray-500 dark:text-gray-400">Loading...</p>
    </div>

    <div v-else-if="filteredTasks.length === 0" class="text-center py-12">
      <p class="text-gray-500 dark:text-gray-400">No tasks found.</p>
    </div>

    <div v-else class="space-y-3">
      <div
        v-for="task in filteredTasks"
        :key="task._id"
        class="bg-white dark:bg-dark-100 shadow rounded-lg p-6 border border-gray-200 dark:border-dark-200 transition-colors duration-200"
      >
        <div class="flex items-start">
          <input
            type="checkbox"
            :checked="task.status === 'done'"
            @change="toggleTask(task)"
            class="h-5 w-5 text-primary-600 dark:text-primary-400 focus:ring-primary-500 border-gray-300 dark:border-dark-300 rounded mt-0.5 transition-colors duration-200"
          />
          <div class="ml-4 flex-1">
            <h3 class="text-lg font-medium text-gray-900 dark:text-gray-200 transition-colors duration-200" :class="{ 'line-through text-gray-400 dark:text-gray-500': task.status === 'done' }">
              {{ task.title }}
            </h3>
            <p v-if="task.description" class="mt-1 text-sm text-gray-600 dark:text-gray-400 transition-colors duration-200">{{ task.description }}</p>
            <div class="mt-2 flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400 transition-colors duration-200">
              <span v-if="task.dueDate">Due: {{ formatDate(task.dueDate) }}</span>
              <span v-if="task.systemId">System: {{ getSystemName(task.systemId) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Create Modal -->
    <div v-if="showCreateModal" class="fixed inset-0 bg-gray-600 dark:bg-black bg-opacity-50 dark:bg-opacity-75 overflow-y-auto h-full w-full z-50 transition-colors duration-200" @click="showCreateModal = false">
      <div class="relative top-20 mx-auto p-5 border border-gray-200 dark:border-dark-200 w-96 shadow-lg rounded-md bg-white dark:bg-dark-100 transition-colors duration-200" @click.stop>
        <div class="mt-3">
          <h3 class="text-lg font-medium text-gray-900 dark:text-primary-400 mb-4 transition-colors duration-200">Create Task</h3>
          <form @submit.prevent="handleCreate">
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-200">Title *</label>
              <input
                v-model="newTask.title"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 dark:border-dark-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-dark-50 dark:text-gray-200 transition-colors duration-200"
              />
            </div>
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-200">Description</label>
              <textarea
                v-model="newTask.description"
                rows="3"
                class="w-full px-3 py-2 border border-gray-300 dark:border-dark-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-dark-50 dark:text-gray-200 transition-colors duration-200"
              />
            </div>
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-200">Due Date</label>
              <input
                v-model="newTask.dueDate"
                type="date"
                class="w-full px-3 py-2 border border-gray-300 dark:border-dark-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-dark-50 dark:text-gray-200 transition-colors duration-200"
              />
            </div>
            <div class="flex justify-end space-x-3">
              <button
                type="button"
                @click="showCreateModal = false"
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
      $fetch<Task[]>('/api/tasks'),
      $fetch<System[]>('/api/systems')
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
      }
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
      body: { status: newStatus }
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
