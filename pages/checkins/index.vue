<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="mb-8 flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Check-ins</h1>
        <p class="mt-2 text-sm text-gray-600">Weekly family check-in history</p>
      </div>
      <NuxtLink
        to="/checkins/new"
        class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
      >
        New Check-in
      </NuxtLink>
    </div>

    <div v-if="loading" class="text-center py-12">
      <p class="text-gray-500">Loading...</p>
    </div>

    <div v-else-if="checkins.length === 0" class="text-center py-12">
      <p class="text-gray-500 mb-4">No check-ins yet.</p>
      <NuxtLink
        to="/checkins/new"
        class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
      >
        Create your first check-in
      </NuxtLink>
    </div>

    <div v-else class="space-y-4">
      <NuxtLink
        v-for="checkin in checkins"
        :key="checkin._id"
        :to="`/checkins/${checkin._id}`"
        class="block bg-white shadow rounded-lg p-6 hover:shadow-md transition"
      >
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-lg font-semibold text-gray-900">
              {{ formatDateRange(checkin.weekStart, checkin.weekEnd) }}
            </h3>
            <p v-if="checkin.wins" class="mt-2 text-sm text-gray-600 line-clamp-2">
              {{ checkin.wins }}
            </p>
          </div>
          <div class="text-sm text-gray-400">
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
    checkins.value = await $fetch<CheckIn[]>('/api/checkins', { credentials: 'include' })
  } catch (error) {
    console.error('Error loading check-ins:', error)
  } finally {
    loading.value = false
  }
})
</script>
