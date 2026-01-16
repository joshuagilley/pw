<template>
  <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="mb-8">
      <NuxtLink to="/checkins" class="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 mb-4 inline-block transition-colors duration-200">
        ← Back to Check-ins
      </NuxtLink>
      <h1 class="text-3xl font-bold text-gray-900 dark:text-primary-400 mt-4 transition-colors duration-200">New Check-in</h1>
    </div>

    <form @submit.prevent="handleSubmit" class="bg-white dark:bg-dark-100 shadow rounded-lg p-6 space-y-6 border border-gray-200 dark:border-dark-200 transition-colors duration-200">
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-200">Week Start *</label>
          <input
            v-model="checkin.weekStart"
            type="date"
            required
            class="w-full px-3 py-2 border border-gray-300 dark:border-dark-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-dark-50 dark:text-gray-200 transition-colors duration-200"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-200">Week End *</label>
          <input
            v-model="checkin.weekEnd"
            type="date"
            required
            class="w-full px-3 py-2 border border-gray-300 dark:border-dark-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-dark-50 dark:text-gray-200 transition-colors duration-200"
          />
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-200">Wins</label>
        <textarea
          v-model="checkin.wins"
          rows="4"
          placeholder="What did we accomplish this week?"
          class="w-full px-3 py-2 border border-gray-300 dark:border-dark-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-dark-50 dark:text-gray-200 transition-colors duration-200"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-200">Misses</label>
        <textarea
          v-model="checkin.misses"
          rows="4"
          placeholder="What didn't we do?"
          class="w-full px-3 py-2 border border-gray-300 dark:border-dark-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-dark-50 dark:text-gray-200 transition-colors duration-200"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-200">Notes</label>
        <textarea
          v-model="checkin.notes"
          rows="4"
          placeholder="Additional thoughts or reflections..."
          class="w-full px-3 py-2 border border-gray-300 dark:border-dark-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-dark-50 dark:text-gray-200 transition-colors duration-200"
        />
      </div>

      <div v-if="error" class="text-red-600 dark:text-red-400 text-sm transition-colors duration-200">
        {{ error }}
      </div>

      <div class="flex justify-end space-x-3">
        <NuxtLink
          to="/checkins"
          class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-dark-200 rounded-md hover:bg-gray-200 dark:hover:bg-dark-300 transition-colors duration-200"
        >
          Cancel
        </NuxtLink>
        <button
          type="submit"
          :disabled="submitting"
          class="px-4 py-2 text-sm font-medium text-white bg-primary-600 dark:bg-primary-500 rounded-md hover:bg-primary-700 dark:hover:bg-primary-600 disabled:opacity-50 transition-colors duration-200"
        >
          {{ submitting ? 'Creating...' : 'Create Check-in' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import type { CheckIn } from '~/types'

const router = useRouter()
const submitting = ref(false)
const error = ref('')

// Auto-set current week
const today = new Date()
const weekStart = new Date(today)
weekStart.setDate(today.getDate() - today.getDay()) // Sunday
const weekEnd = new Date(weekStart)
weekEnd.setDate(weekStart.getDate() + 6) // Saturday

const checkin = ref({
  weekStart: weekStart.toISOString().split('T')[0],
  weekEnd: weekEnd.toISOString().split('T')[0],
  wins: '',
  misses: '',
  notes: ''
})

const handleSubmit = async () => {
  submitting.value = true
  error.value = ''
  
  try {
    const newCheckin = await $fetch<CheckIn>('/api/checkins', {
      method: 'POST',
      body: checkin.value
    })
    await router.push(`/checkins/${newCheckin._id}`)
  } catch (err: any) {
    error.value = err.data?.message || 'Failed to create check-in'
  } finally {
    submitting.value = false
  }
}
</script>
