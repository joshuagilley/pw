<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="mb-8 flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Systems</h1>
        <p class="mt-2 text-sm text-gray-600">Manage your family systems</p>
      </div>
      <button
        @click="showCreateModal = true"
        class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
      >
        New System
      </button>
    </div>

    <div v-if="loading" class="text-center py-12">
      <p class="text-gray-500">Loading...</p>
    </div>

    <div v-else-if="systems.length === 0" class="text-center py-12">
      <p class="text-gray-500 mb-4">No systems yet.</p>
      <button
        @click="showCreateModal = true"
        class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
      >
        Create your first system
      </button>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <NuxtLink
        v-for="system in systems"
        :key="system._id"
        :to="`/systems/${system._id}`"
        class="block bg-white shadow rounded-lg p-6 hover:shadow-md transition"
      >
        <h3 class="text-lg font-semibold text-gray-900">{{ system.name }}</h3>
        <p v-if="system.description" class="mt-2 text-sm text-gray-500">{{ system.description }}</p>
        <p class="mt-4 text-xs text-gray-400">
          Created {{ formatDate(system.createdAt) }}
        </p>
      </NuxtLink>
    </div>

    <!-- Create Modal -->
    <div v-if="showCreateModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50" @click="showCreateModal = false">
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white" @click.stop>
        <div class="mt-3">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Create System</h3>
          <form @submit.prevent="handleCreate">
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">Name *</label>
              <input
                v-model="newSystem.name"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                v-model="newSystem.description"
                rows="3"
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
import type { System } from '~/types'

const systems = ref<System[]>([])
const loading = ref(true)
const showCreateModal = ref(false)
const creating = ref(false)
const newSystem = ref({ name: '', description: '' })

const formatDate = (date: Date | string) => {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString()
}

const loadSystems = async () => {
  try {
    systems.value = await $fetch<System[]>('/api/systems', { credentials: 'include' })
  } catch (error) {
    console.error('Error loading systems:', error)
  } finally {
    loading.value = false
  }
}

const handleCreate = async () => {
  creating.value = true
  try {
    const system = await $fetch<System>('/api/systems', {
      method: 'POST',
      body: newSystem.value,
      credentials: 'include'
    })
    systems.value.push(system)
    newSystem.value = { name: '', description: '' }
    showCreateModal.value = false
  } catch (error) {
    console.error('Error creating system:', error)
  } finally {
    creating.value = false
  }
}

onMounted(() => {
  loadSystems()
})
</script>
