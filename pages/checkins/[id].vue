<template>
  <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div v-if="loading" class="text-center py-12">
      <p class="text-gray-500">Loading...</p>
    </div>

    <div v-else-if="!checkin" class="text-center py-12">
      <p class="text-gray-500">Check-in not found</p>
    </div>

    <div v-else>
      <div class="mb-8">
        <NuxtLink to="/checkins" class="text-sm text-blue-600 hover:text-blue-700 mb-4 inline-block">
          ← Back to Check-ins
        </NuxtLink>
        <h1 class="text-3xl font-bold text-gray-900 mt-4">
          Check-in: {{ formatDateRange(checkin.weekStart, checkin.weekEnd) }}
        </h1>
      </div>

      <div class="bg-white shadow rounded-lg p-6 space-y-6">
        <div>
          <h2 class="text-lg font-semibold text-gray-900 mb-2">Wins</h2>
          <p class="text-gray-700 whitespace-pre-wrap">{{ checkin.wins || 'No wins recorded' }}</p>
        </div>

        <div>
          <h2 class="text-lg font-semibold text-gray-900 mb-2">Misses</h2>
          <p class="text-gray-700 whitespace-pre-wrap">{{ checkin.misses || 'No misses recorded' }}</p>
        </div>

        <div v-if="checkin.notes">
          <h2 class="text-lg font-semibold text-gray-900 mb-2">Notes</h2>
          <p class="text-gray-700 whitespace-pre-wrap">{{ checkin.notes }}</p>
        </div>

        <div v-if="checkin.scorecard && Object.keys(checkin.scorecard).length > 0">
          <h2 class="text-lg font-semibold text-gray-900 mb-2">Scorecard</h2>
          <div class="space-y-2">
            <div v-for="(score, key) in checkin.scorecard" :key="key" class="flex items-center">
              <span class="text-sm font-medium text-gray-700 w-24">{{ key }}:</span>
              <span class="text-sm text-gray-600">{{ score }}/5</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Tasks from this check-in -->
      <div class="bg-white shadow rounded-lg p-6 mt-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Action Items</h2>
        <div v-if="tasks.length === 0" class="text-sm text-gray-500">
          No action items created from this check-in.
        </div>
        <div v-else class="space-y-2">
          <div
            v-for="task in tasks"
            :key="task._id"
            class="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
          >
            <div class="flex items-center">
              <input
                type="checkbox"
                :checked="task.status === 'done'"
                @change="toggleTask(task)"
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span class="ml-3" :class="{ 'line-through text-gray-400': task.status === 'done' }">
                {{ task.title }}
              </span>
            </div>
            <button
              @click="createTaskFromMiss"
              class="text-sm text-blue-600 hover:text-blue-700"
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
      $fetch<CheckIn>(`/api/checkins/${checkinId}`, { credentials: 'include' }),
      $fetch<Task[]>(`/api/tasks?checkInId=${checkinId}`, { credentials: 'include' })
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
      body: { status: newStatus },
      credentials: 'include'
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
      },
      credentials: 'include'
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
