<template>
  <div class="min-h-screen bg-gray-50 dark:bg-dark-50 transition-colors duration-200">
    <nav class="bg-white dark:bg-dark-100 shadow-sm border-b border-gray-200 dark:border-dark-200 transition-colors duration-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex">
            <NuxtLink to="/" class="flex items-center px-2 py-2 text-xl font-semibold text-gray-900 dark:text-primary-400 transition-colors duration-200">
              <span class="inline-flex items-center">
                <svg class="h-5 w-5 mr-2 text-primary-600 dark:text-primary-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 21c4-4 7-7.5 7-11a7 7 0 10-14 0c0 3.5 3 7 7 11z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 21V9" />
                </svg>
                Stem
              </span>
            </NuxtLink>
            <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
              <NuxtLink 
                to="/" 
                :class="[
                  'inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors duration-200 border-b-2',
                  route.path === '/' 
                    ? 'text-gray-900 dark:text-primary-400 border-primary-500 dark:border-primary-500' 
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-primary-400 hover:border-gray-300 dark:hover:border-primary-600 border-transparent'
                ]"
              >
                Dashboard
              </NuxtLink>
              <NuxtLink 
                to="/systems" 
                :class="[
                  'inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors duration-200 border-b-2',
                  route.path.startsWith('/systems') 
                    ? 'text-gray-900 dark:text-primary-400 border-primary-500 dark:border-primary-500' 
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-primary-400 hover:border-gray-300 dark:hover:border-primary-600 border-transparent'
                ]"
              >
                Systems
              </NuxtLink>
              <NuxtLink 
                to="/checkins" 
                :class="[
                  'inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors duration-200 border-b-2',
                  route.path.startsWith('/checkins') 
                    ? 'text-gray-900 dark:text-primary-400 border-primary-500 dark:border-primary-500' 
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-primary-400 hover:border-gray-300 dark:hover:border-primary-600 border-transparent'
                ]"
              >
                Check-ins
              </NuxtLink>
              <NuxtLink 
                to="/tasks" 
                :class="[
                  'inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors duration-200 border-b-2',
                  route.path.startsWith('/tasks') 
                    ? 'text-gray-900 dark:text-primary-400 border-primary-500 dark:border-primary-500' 
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-primary-400 hover:border-gray-300 dark:hover:border-primary-600 border-transparent'
                ]"
              >
                Tasks
              </NuxtLink>
              <NuxtLink 
                to="/analytics" 
                :class="[
                  'inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors duration-200 border-b-2',
                  route.path === '/analytics' 
                    ? 'text-gray-900 dark:text-primary-400 border-primary-500 dark:border-primary-500' 
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-primary-400 hover:border-gray-300 dark:hover:border-primary-600 border-transparent'
                ]"
              >
                Analytics
              </NuxtLink>
              <NuxtLink 
                to="/garden" 
                :class="[
                  'inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors duration-200 border-b-2',
                  route.path.startsWith('/garden') 
                    ? 'text-gray-900 dark:text-primary-400 border-primary-500 dark:border-primary-500' 
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-primary-400 hover:border-gray-300 dark:hover:border-primary-600 border-transparent'
                ]"
              >
                <svg class="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 20v-8m0 0c-3 0-5-2-5-5 3 0 5 2 5 5zm0 0c3 0 5-2 5-5-3 0-5 2-5 5z" />
                </svg>
                Garden
              </NuxtLink>
            </div>
          </div>
          <div class="flex items-center">
            <button
              @click="toggleDarkMode"
              class="p-2 rounded-md text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-dark-200 transition-colors duration-200"
              aria-label="Toggle dark mode"
            >
              <svg v-if="isDark" class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <svg v-else class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
    <main class="transition-colors duration-200">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const { isDark, toggleDarkMode } = useDarkMode()
</script>
