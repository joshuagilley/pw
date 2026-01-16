<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-primary-400 transition-colors duration-200">Analytics</h1>
      <p class="mt-2 text-sm text-gray-600 dark:text-gray-400 transition-colors duration-200">Check-in consistency and patterns</p>
    </div>

    <div v-if="loading" class="text-center py-12">
      <p class="text-gray-500 dark:text-gray-400">Loading...</p>
    </div>

    <div v-else class="space-y-6">
      <!-- Check-in Consistency Chart -->
      <div class="bg-white dark:bg-dark-100 shadow rounded-lg p-6 border border-gray-200 dark:border-dark-200 transition-colors duration-200">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-primary-400 mb-4 transition-colors duration-200">Weekly Check-in Consistency</h2>
        <div class="h-64">
          <Line
            v-if="chartData"
            :data="chartData"
            :options="chartOptions"
          />
        </div>
        <div class="mt-4 text-sm text-gray-600 dark:text-gray-300 transition-colors duration-200">
          <p>Showing check-ins over the last {{ weeksToShow }} weeks</p>
          <p class="mt-1">
            <strong>Completion Rate:</strong> {{ completionRate }}% 
            ({{ completedCheckins }} of {{ totalWeeks }} weeks)
          </p>
        </div>
      </div>

      <!-- Check-in Frequency Stats -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-white dark:bg-dark-100 shadow rounded-lg p-6 border border-gray-200 dark:border-dark-200 transition-colors duration-200">
          <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 transition-colors duration-200">Total Check-ins</h3>
          <p class="mt-2 text-3xl font-semibold text-gray-900 dark:text-primary-400 transition-colors duration-200">{{ checkins.length }}</p>
        </div>
        <div class="bg-white dark:bg-dark-100 shadow rounded-lg p-6 border border-gray-200 dark:border-dark-200 transition-colors duration-200">
          <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 transition-colors duration-200">Average per Month</h3>
          <p class="mt-2 text-3xl font-semibold text-gray-900 dark:text-primary-400 transition-colors duration-200">{{ averagePerMonth }}</p>
        </div>
        <div class="bg-white dark:bg-dark-100 shadow rounded-lg p-6 border border-gray-200 dark:border-dark-200 transition-colors duration-200">
          <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 transition-colors duration-200">Streak</h3>
          <p class="mt-2 text-3xl font-semibold text-gray-900 dark:text-primary-400 transition-colors duration-200">{{ currentStreak }} weeks</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'
import type { CheckIn } from '~/types'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

const checkins = ref<CheckIn[]>([])
const loading = ref(true)
const weeksToShow = 12

const loadCheckins = async () => {
  try {
    checkins.value = await $fetch<CheckIn[]>('/api/checkins')
    // Sort by week start date
    checkins.value.sort((a, b) => {
      const dateA = typeof a.weekStart === 'string' ? new Date(a.weekStart) : a.weekStart
      const dateB = typeof b.weekStart === 'string' ? new Date(b.weekStart) : b.weekStart
      return dateA.getTime() - dateB.getTime()
    })
  } catch (error) {
    console.error('Error loading check-ins:', error)
  } finally {
    loading.value = false
  }
}

const generateWeekLabels = () => {
  const labels: string[] = []
  const today = new Date()
  for (let i = weeksToShow - 1; i >= 0; i--) {
    const weekStart = new Date(today)
    weekStart.setDate(today.getDate() - (today.getDay() + 7 * i))
    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekStart.getDate() + 6)
    
    const month = weekStart.toLocaleDateString('en-US', { month: 'short' })
    const day = weekStart.getDate()
    labels.push(`${month} ${day}`)
  }
  return labels
}

const generateCheckInData = () => {
  const labels = generateWeekLabels()
  const data = new Array(weeksToShow).fill(0)
  
  // Calculate the date range for the last N weeks
  const today = new Date()
  const weeksData: { date: Date; hasCheckin: boolean }[] = []
  
  for (let i = weeksToShow - 1; i >= 0; i--) {
    const weekStart = new Date(today)
    weekStart.setDate(today.getDate() - (today.getDay() + 7 * i))
    weekStart.setHours(0, 0, 0, 0)
    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekStart.getDate() + 6)
    weekEnd.setHours(23, 59, 59, 999)
    
    // Check if any check-in exists for this week
    const hasCheckin = checkins.value.some(checkin => {
      const checkinStart = typeof checkin.weekStart === 'string' 
        ? new Date(checkin.weekStart) 
        : checkin.weekStart
      const checkinStartDate = new Date(checkinStart)
      checkinStartDate.setHours(0, 0, 0, 0)
      
      return checkinStartDate >= weekStart && checkinStartDate <= weekEnd
    })
    
    weeksData.push({ date: weekStart, hasCheckin })
    data[weeksToShow - 1 - i] = hasCheckin ? 1 : 0
  }
  
  return { labels, data, weeksData }
}

const chartData = computed(() => {
  if (checkins.value.length === 0) return null
  
  const { labels, data } = generateCheckInData()
  return {
    labels,
    datasets: [
      {
        label: 'Check-in Completed',
        data,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true,
        pointRadius: 6,
        pointHoverRadius: 8,
        pointBackgroundColor: (context: any) => {
          return context.raw === 1 ? 'rgb(59, 130, 246)' : 'rgb(209, 213, 219)'
        }
      }
    ]
  }
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      callbacks: {
        label: (context: any) => {
          return context.raw === 1 ? 'Check-in completed' : 'No check-in'
        }
      }
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      max: 1,
      ticks: {
        stepSize: 1,
        callback: (value: any) => value === 1 ? 'Yes' : 'No'
      },
      grid: {
        display: false
      }
    },
    x: {
      grid: {
        display: false
      }
    }
  }
}

const completionRate = computed(() => {
  if (checkins.value.length === 0) return 0
  const { weeksData } = generateCheckInData()
  const completed = weeksData.filter(w => w.hasCheckin).length
  return Math.round((completed / weeksToShow) * 100)
})

const completedCheckins = computed(() => {
  const { weeksData } = generateCheckInData()
  return weeksData.filter(w => w.hasCheckin).length
})

const totalWeeks = computed(() => weeksToShow)

const averagePerMonth = computed(() => {
  if (checkins.value.length === 0) return 0
  // Calculate months covered
  const firstCheckin = checkins.value[0]
  const lastCheckin = checkins.value[checkins.value.length - 1]
  const firstDate = typeof firstCheckin.weekStart === 'string' 
    ? new Date(firstCheckin.weekStart) 
    : firstCheckin.weekStart
  const lastDate = typeof lastCheckin.weekStart === 'string'
    ? new Date(lastCheckin.weekStart)
    : lastCheckin.weekStart
  
  const monthsDiff = (lastDate.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24 * 30)
  const months = Math.max(1, monthsDiff)
  return Math.round((checkins.value.length / months) * 10) / 10
})

const currentStreak = computed(() => {
  if (checkins.value.length === 0) return 0
  
  const today = new Date()
  let streak = 0
  let weekOffset = 0
  
  while (true) {
    const weekStart = new Date(today)
    weekStart.setDate(today.getDate() - (today.getDay() + 7 * weekOffset))
    weekStart.setHours(0, 0, 0, 0)
    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekStart.getDate() + 6)
    weekEnd.setHours(23, 59, 59, 999)
    
    const hasCheckin = checkins.value.some(checkin => {
      const checkinStart = typeof checkin.weekStart === 'string'
        ? new Date(checkin.weekStart)
        : checkin.weekStart
      const checkinStartDate = new Date(checkinStart)
      checkinStartDate.setHours(0, 0, 0, 0)
      
      return checkinStartDate >= weekStart && checkinStartDate <= weekEnd
    })
    
    if (hasCheckin) {
      streak++
      weekOffset++
    } else {
      break
    }
  }
  
  return streak
})

onMounted(() => {
  loadCheckins()
})
</script>
