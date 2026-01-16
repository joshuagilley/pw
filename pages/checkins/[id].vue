<template>
  <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div v-if="loading" class="text-center py-12">
      <p class="text-gray-500 dark:text-gray-400">Loading...</p>
    </div>

    <div v-else-if="!checkin" class="text-center py-12">
      <p class="text-gray-500 dark:text-gray-400">Check-in not found</p>
    </div>

    <div v-else>
      <div class="mb-8">
        <NuxtLink to="/checkins" class="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 mb-4 inline-block transition-colors duration-200">
          ← Back to Check-ins
        </NuxtLink>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-primary-400 mt-4 transition-colors duration-200">
          Check-in: {{ formatDateRange(checkin.weekStart, checkin.weekEnd) }}
        </h1>
      </div>

      <div class="bg-white dark:bg-dark-100 shadow rounded-lg p-6 space-y-6 border border-gray-200 dark:border-dark-200 transition-colors duration-200">
        <div>
          <h2 class="text-lg font-semibold text-gray-900 dark:text-primary-400 mb-2 transition-colors duration-200">Wins</h2>
          <p class="text-gray-700 dark:text-gray-300 whitespace-pre-wrap transition-colors duration-200">{{ checkin.wins || 'No wins recorded' }}</p>
        </div>

        <div>
          <h2 class="text-lg font-semibold text-gray-900 dark:text-primary-400 mb-2 transition-colors duration-200">Misses</h2>
          <p class="text-gray-700 dark:text-gray-300 whitespace-pre-wrap transition-colors duration-200">{{ checkin.misses || 'No misses recorded' }}</p>
        </div>

        <div v-if="checkin.notes">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-primary-400 mb-2 transition-colors duration-200">Notes</h2>
          <p class="text-gray-700 dark:text-gray-300 whitespace-pre-wrap transition-colors duration-200">{{ checkin.notes }}</p>
        </div>

        <div v-if="checkin.scorecard && Object.keys(checkin.scorecard).length > 0">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-primary-400 mb-2 transition-colors duration-200">Scorecard</h2>
          <div class="space-y-2">
            <div v-for="(score, key) in checkin.scorecard" :key="key" class="flex items-center">
              <span class="text-sm font-medium text-gray-700 dark:text-gray-300 w-24 transition-colors duration-200">{{ key }}:</span>
              <span class="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-200">{{ score }}/5</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Tasks from this check-in -->
      <div class="bg-white dark:bg-dark-100 shadow rounded-lg p-6 mt-6 border border-gray-200 dark:border-dark-200 transition-colors duration-200">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-primary-400 mb-4 transition-colors duration-200">Action Items</h2>
        <div v-if="tasks.length === 0" class="text-sm text-gray-500 dark:text-gray-400">
          No action items created from this check-in.
        </div>
        <div v-else class="space-y-2">
          <div
            v-for="task in tasks"
            :key="task._id"
            class="flex items-center justify-between p-3 border border-gray-200 dark:border-dark-200 rounded-lg bg-white dark:bg-dark-100 transition-colors duration-200"
          >
            <div class="flex items-center">
              <input
                type="checkbox"
                :checked="task.status === 'done'"
                @change="toggleTask(task)"
                class="h-4 w-4 text-primary-600 dark:text-primary-400 focus:ring-primary-500 border-gray-300 dark:border-dark-300 rounded transition-colors duration-200"
              />
              <span class="ml-3 text-gray-900 dark:text-gray-200 transition-colors duration-200" :class="{ 'line-through text-gray-400 dark:text-gray-500': task.status === 'done' }">
                {{ task.title }}
              </span>
            </div>
            <button
              @click="createTaskFromMiss"
              class="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors duration-200"
            >
              Create Task
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CheckIn, Task } from '~/types'

const route = useRoute()
const checkinId = route.params.id as string

const checkin = ref<CheckIn | null>(null)
const tasks = ref<Task[]>([])
const loading = ref(true)

const formatDateRange = (start: Date | string, end: Date | string) => {
  const s = typeof start === 'string' ? new Date(start) : start
  const e = typeof end === 'string' ? new Date(end) : end
  return `${s.toLocaleDateString()} - ${e.toLocaleDateString()}`
}

const loadData = async () => {
  try {
    const [checkinData, tasksData] = await Promise.all([
      $fetch<CheckIn>(`/api/checkins/${checkinId}`),
      $fetch<Task[]>(`/api/tasks?checkInId=${checkinId}`)
    ])
    
    checkin.value = checkinData
    tasks.value = tasksData
  } catch (error) {
    console.error('Error loading check-in:', error)
  } finally {
    loading.value = false
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

const createTaskFromMiss = async () => {
  // Simple implementation - could be enhanced with a modal
  const title = prompt('Enter task title:')
  if (!title) return
  
  try {
    await $fetch('/api/tasks', {
      method: 'POST',
      body: {
        checkInId: checkinId,
        title,
        status: 'open'
      }
    })
    await loadData()
  } catch (error) {
    console.error('Error creating task:', error)
  }
}

onMounted(() => {
  loadData()
})
</script>
