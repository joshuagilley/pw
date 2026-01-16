<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="mb-8 flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-primary-400 transition-colors duration-200">Check-ins</h1>
        <p class="mt-2 text-sm text-gray-600 dark:text-gray-400 transition-colors duration-200">Weekly family check-in history</p>
      </div>
      <NuxtLink
        to="/checkins/new"
        class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 transition-colors duration-200"
      >
        New Check-in
      </NuxtLink>
    </div>

    <div v-if="loading" class="text-center py-12">
      <p class="text-gray-500 dark:text-gray-400">Loading...</p>
    </div>

    <div v-else-if="checkins.length === 0" class="text-center py-12">
      <p class="text-gray-500 dark:text-gray-400 mb-4">No check-ins yet.</p>
      <NuxtLink
        to="/checkins/new"
        class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 transition-colors duration-200"
      >
        Create your first check-in
      </NuxtLink>
    </div>

    <div v-else class="space-y-4">
      <NuxtLink
        v-for="checkin in checkins"
        :key="checkin._id"
        :to="`/checkins/${checkin._id}`"
        class="block bg-white dark:bg-dark-100 shadow rounded-lg p-6 hover:shadow-md transition-all duration-200 border border-gray-200 dark:border-dark-200 hover:border-primary-500 dark:hover:border-primary-600"
      >
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-primary-400 transition-colors duration-200">
              {{ formatDateRange(checkin.weekStart, checkin.weekEnd) }}
            </h3>
            <p v-if="checkin.wins" class="mt-2 text-sm text-gray-600 dark:text-gray-300 line-clamp-2 transition-colors duration-200">
              {{ checkin.wins }}
            </p>
          </div>
          <div class="text-sm text-gray-400 dark:text-gray-500 transition-colors duration-200">
            {{ formatDate(checkin.createdAt) }}
          </div>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CheckIn } from '~/types'

const checkins = ref<CheckIn[]>([])
const loading = ref(true)

const formatDate = (date: Date | string) => {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString()
}

const formatDateRange = (start: Date | string, end: Date | string) => {
  const s = typeof start === 'string' ? new Date(start) : start
  const e = typeof end === 'string' ? new Date(end) : end
  return `${s.toLocaleDateString()} - ${e.toLocaleDateString()}`
}

onMounted(async () => {
  try {
    checkins.value = await $fetch<CheckIn[]>('/api/checkins')
  } catch (error) {
    console.error('Error loading check-ins:', error)
  } finally {
    loading.value = false
  }
})
</script>
