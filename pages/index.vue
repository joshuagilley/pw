<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Dashboard</h1>
      <p class="mt-2 text-sm text-gray-600">Overview of your family systems</p>
    </div>

    <div v-if="loading" class="text-center py-12">
      <p class="text-gray-500">Loading...</p>
    </div>

    <div v-else class="space-y-6">
      <!-- Last Check-in -->
      <div class="bg-white shadow rounded-lg p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-semibold text-gray-900">Weekly Check-in</h2>
          <NuxtLink
            to="/checkins/new"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Start Check-in
          </NuxtLink>
        </div>
        <div v-if="lastCheckin" class="mt-4">
          <p class="text-sm text-gray-600">
            Last check-in: {{ formatDate(lastCheckin.weekStart) }} - {{ formatDate(lastCheckin.weekEnd) }}
          </p>
        </div>
        <div v-else class="mt-4 text-sm text-gray-500">
          No check-ins yet. Start your first one!
        </div>
      </div>

      <!-- Open Tasks -->
      <div class="bg-white shadow rounded-lg p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-semibold text-gray-900">Open Tasks</h2>
          <NuxtLink
            to="/tasks"
            class="text-sm text-blue-600 hover:text-blue-700"
          >
            View all
          </NuxtLink>
        </div>
        <div v-if="openTasks.length === 0" class="text-sm text-gray-500">
          No open tasks
        </div>
        <ul v-else class="space-y-2">
          <li v-for="task in openTasks.slice(0, 5)" :key="task._id" class="flex items-center">
            <input
              type="checkbox"
              :checked="false"
              @change="completeTask(task._id!)"
              class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span class="ml-3 text-sm text-gray-900">{{ task.title }}</span>
          </li>
        </ul>
      </div>

      <!-- Systems Overview -->
      <div class="bg-white shadow rounded-lg p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-semibold text-gray-900">Systems</h2>
          <NuxtLink
            to="/systems"
            class="text-sm text-blue-600 hover:text-blue-700"
          >
            View all
          </NuxtLink>
        </div>
        <div v-if="systems.length === 0" class="text-sm text-gray-500">
          No systems yet. <NuxtLink to="/systems" class="text-blue-600">Create one</NuxtLink>
        </div>
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <NuxtLink
            v-for="system in systems.slice(0, 6)"
            :key="system._id"
            :to="`/systems/${system._id}`"
            class="block p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition"
          >
            <h3 class="font-medium text-gray-900">{{ system.name }}</h3>
            <p v-if="system.description" class="mt-1 text-sm text-gray-500">{{ system.description }}</p>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { System, CheckIn, Task } from '~/types'

const systems = ref<System[]>([])
const lastCheckin = ref<CheckIn | null>(null)
const openTasks = ref<Task[]>([])
const loading = ref(true)

const formatDate = (date: Date | string) => {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString()
}

const loadData = async () => {
  try {
    const [systemsData, checkinsData, tasksData] = await Promise.all([
      $fetch<System[]>('/api/systems', { credentials: 'include' }),
      $fetch<CheckIn[]>('/api/checkins', { credentials: 'include' }),
      $fetch<Task[]>('/api/tasks?status=open', { credentials: 'include' })
    ])
    
    systems.value = systemsData
    if (checkinsData.length > 0) {
      lastCheckin.value = checkinsData[0]
    }
    openTasks.value = tasksData
  } catch (error) {
    console.error('Error loading dashboard data:', error)
  } finally {
    loading.value = false
  }
}

const completeTask = async (taskId: string) => {
  try {
    await $fetch(`/api/tasks/${taskId}`, {
      method: 'PUT',
      body: { status: 'done' },
      credentials: 'include'
    })
    await loadData()
  } catch (error) {
    console.error('Error completing task:', error)
  }
}

onMounted(() => {
  loadData()
})
</script>
