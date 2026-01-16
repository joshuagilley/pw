<template>
  <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="mb-8">
      <NuxtLink to="/checkins" class="text-sm text-blue-600 hover:text-blue-700 mb-4 inline-block">
        ← Back to Check-ins
      </NuxtLink>
      <h1 class="text-3xl font-bold text-gray-900 mt-4">New Check-in</h1>
    </div>

    <form @submit.prevent="handleSubmit" class="bg-white shadow rounded-lg p-6 space-y-6">
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Week Start *</label>
          <input
            v-model="checkin.weekStart"
            type="date"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Week End *</label>
          <input
            v-model="checkin.weekEnd"
            type="date"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Wins</label>
        <textarea
          v-model="checkin.wins"
          rows="4"
          placeholder="What did we accomplish this week?"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Misses</label>
        <textarea
          v-model="checkin.misses"
          rows="4"
          placeholder="What didn't we do?"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Notes</label>
        <textarea
          v-model="checkin.notes"
          rows="4"
          placeholder="Additional thoughts or reflections..."
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div v-if="error" class="text-red-600 text-sm">
        {{ error }}
      </div>

      <div class="flex justify-end space-x-3">
        <NuxtLink
          to="/checkins"
          class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
        >
          Cancel
        </NuxtLink>
        <button
          type="submit"
          :disabled="submitting"
          class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
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
      body: checkin.value,
      credentials: 'include'
    })
    await router.push(`/checkins/${newCheckin._id}`)
  } catch (err: any) {
    error.value = err.data?.message || 'Failed to create check-in'
  } finally {
    submitting.value = false
  }
}
</script>
