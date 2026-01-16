<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-primary-400 transition-colors duration-200">
        Garden
      </h1>
      <p class="mt-2 text-sm text-gray-600 dark:text-gray-400 transition-colors duration-200">
        One shared garden bed, split into sections for each system.
      </p>
    </div>

    <div v-if="loading" class="text-center py-12">
      <p class="text-gray-500 dark:text-gray-400">Loading...</p>
    </div>

    <div v-else class="space-y-6">
      <div class="garden-map" ref="gardenRef">
        <div class="garden-title">
          <span class="title-pill">Monthly Garden</span>
          <span class="subtitle-pill">Seeds → Buds → Blooms</span>
        </div>

        <div class="garden-bed-single">
          <div class="bed-fence"></div>
          <div class="bed-soil"></div>
          <div class="pollen-layer">
            <span
              v-for="particle in pollen"
              :key="particle.id"
              class="pollen"
              :style="particle.style"
            ></span>
          </div>

          <div class="bed-sections">
            <div
              v-for="section in beds"
              :key="section.systemId"
              class="garden-section"
              :class="[section.growthStage, section.tint]"
            >
              <div class="section-header">
                <span class="section-name">{{ section.name }}</span>
                <span class="section-status">{{ section.statusLabel }}</span>
              </div>

              <div class="section-plants" :data-section-id="section.systemId">
                <div
                  v-for="(plant, idx) in section.plants"
                  :key="`${section.systemId}-${idx}`"
                  class="plant"
                  :class="[plant.type, plant.color, plant.state]"
                  :style="plant.style"
                ></div>
              </div>

              <div class="section-metrics">
                <div class="metric">
                  <span>This month</span>
                  <strong>{{ section.thisMonth }}</strong>
                </div>
                <div class="metric">
                  <span>Last month</span>
                  <strong>{{ section.lastMonth }}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <p class="text-xs text-gray-500 dark:text-gray-400">
        Demo mode: the first two systems are boosted to show blooms + buds.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, nextTick } from 'vue'
import gsap from 'gsap'
import type { System, Task } from '~/types'

type BedView = {
  systemId: string
  name: string
  thisMonth: number
  lastMonth: number
  statusLabel: string
  growthStage: 'seed' | 'bud' | 'bloom' | 'wilt'
  tint: 'tint-green' | 'tint-blue' | 'tint-gold' | 'tint-rose'
  plants: Array<{
    type: 'seed' | 'sprout' | 'flower'
    color: 'blue' | 'green' | 'gold' | 'rose' | 'neutral'
    state: 'seed' | 'bud' | 'bloom' | 'wilt'
    style: string
  }>
}

type PollenParticle = {
  id: string
  style: string
}

const gardenRef = ref<HTMLElement | null>(null)
const systems = ref<System[]>([])
const tasks = ref<Task[]>([])
const loading = ref(true)
const pollen = ref<PollenParticle[]>([])

const startOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1)
const startOfPrevMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() - 1, 1)
const endOfPrevMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 0, 23, 59, 59, 999)

const loadData = async () => {
  try {
    const [systemsData, tasksData] = await Promise.all([
      $fetch<System[]>('/api/systems'),
      $fetch<Task[]>('/api/tasks')
    ])
    systems.value = systemsData
    tasks.value = tasksData
  } catch (error) {
    console.error('Error loading garden data:', error)
  } finally {
    loading.value = false
  }
}

const buildPlants = (count: number, stage: BedView['growthStage'], color: BedView['tint']) => {
  const plantType: BedView['plants'][0]['type'] =
    stage === 'seed' ? 'seed' : stage === 'bud' ? 'sprout' : 'flower'
  const colorMap: Record<BedView['tint'], BedView['plants'][0]['color']> = {
    'tint-green': 'green',
    'tint-blue': 'blue',
    'tint-gold': 'gold',
    'tint-rose': 'rose'
  }
  const plantColor: BedView['plants'][0]['color'] = stage === 'wilt' ? 'neutral' : colorMap[color]
  return Array.from({ length: count }).map((_, i) => ({
    type: plantType,
    color: plantColor,
    state: stage,
    style: `--plant-x:${(i % 3) * 28 + 20}%; --plant-y:${Math.floor(i / 3) * 32 + 24}%; --plant-delay:${(i % 3) * 0.4}s;`
  }))
}

const demoBeds: BedView[] = [
  {
    systemId: 'demo-1',
    name: 'Family Finance',
    thisMonth: 12,
    lastMonth: 4,
    statusLabel: 'Blooming (showcase)',
    growthStage: 'bloom',
    tint: 'tint-blue',
    plants: buildPlants(1, 'bloom', 'tint-blue')
  },
  {
    systemId: 'demo-2',
    name: 'Home + Admin',
    thisMonth: 4,
    lastMonth: 4,
    statusLabel: 'Budding (showcase)',
    growthStage: 'bud',
    tint: 'tint-green',
    plants: buildPlants(1, 'bud', 'tint-green')
  }
]

const applyShowcase = (bedsList: BedView[]): BedView[] => {
  if (bedsList.length === 0) return bedsList
  return bedsList.map((bed, index) => {
    if (index === 0) {
      return {
        ...bed,
        statusLabel: 'Blooming (showcase)',
        growthStage: 'bloom',
        tint: 'tint-blue',
        thisMonth: 12,
        lastMonth: 4,
        plants: buildPlants(1, 'bloom', 'tint-blue')
      }
    }
    if (index === 1) {
      return {
        ...bed,
        statusLabel: 'Budding (showcase)',
        growthStage: 'bud',
        tint: 'tint-green',
        thisMonth: 4,
        lastMonth: 4,
        plants: buildPlants(1, 'bud', 'tint-green')
      }
    }
    return bed
  })
}

const beds = computed<BedView[]>(() => {
  const now = new Date()
  const thisStart = startOfMonth(now)
  const prevStart = startOfPrevMonth(now)
  const prevEnd = endOfPrevMonth(now)

  if (systems.value.length === 0) {
    return demoBeds
  }

  const realBeds: BedView[] = systems.value.map((system) => {
    const systemTasks = tasks.value.filter(t => t.systemId === system._id)
    const doneThisMonth = systemTasks.filter(t => {
      if (!t.updatedAt || t.status !== 'done') return false
      const updated = new Date(t.updatedAt)
      return updated >= thisStart
    }).length

    const doneLastMonth = systemTasks.filter(t => {
      if (!t.updatedAt || t.status !== 'done') return false
      const updated = new Date(t.updatedAt)
      return updated >= prevStart && updated <= prevEnd
    }).length

    const status: 'seedling' | 'growing' | 'steady' | 'wilting' =
      doneThisMonth === 0 && doneLastMonth === 0 ? 'seedling' :
      doneThisMonth > doneLastMonth ? 'growing' :
      doneThisMonth === doneLastMonth ? 'steady' : 'wilting'

    const labels = {
      seedling: 'Seedling (no recent momentum)',
      growing: 'Growing (better than last month)',
      steady: 'Steady (same as last month)',
      wilting: 'Wilting (down vs last month)'
    } as const
    const growthStage: BedView['growthStage'] =
      status === 'seedling' ? 'seed' : status === 'growing' ? 'bloom' : status === 'steady' ? 'bud' : 'wilt'
    const tint: BedView['tint'] =
      status === 'growing' ? 'tint-blue' : status === 'steady' ? 'tint-green' : status === 'wilting' ? 'tint-rose' : 'tint-gold'

    return {
      systemId: system._id || system.name,
      name: system.name,
      thisMonth: doneThisMonth,
      lastMonth: doneLastMonth,
      statusLabel: labels[status],
      growthStage,
      tint,
      plants: buildPlants(1, growthStage, tint)
    }
  })
  return applyShowcase(realBeds)
})

let ctx: gsap.Context | undefined

const animateGarden = () => {
  if (!gardenRef.value) return
  ctx = gsap.context(() => {
    const plants = gsap.utils.toArray<HTMLElement>('.plant')
    const bloomPlants = gsap.utils.toArray<HTMLElement>('.plant.bloom')
    const budPlants = gsap.utils.toArray<HTMLElement>('.plant.bud')
    const wiltPlants = gsap.utils.toArray<HTMLElement>('.plant.wilt')
    const pollenEls = gsap.utils.toArray<HTMLElement>('.pollen')

    gsap.fromTo(
      plants,
      { scale: 0, opacity: 0, transformOrigin: '50% 100%' },
      {
        scale: 1,
        opacity: 1,
        duration: 1.2,
        ease: 'power2.out',
        stagger: 0.03
      }
    )

    gsap.to(plants, {
      y: -2,
      duration: 2.4,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true,
      stagger: {
        each: 0.05,
        from: 'random'
      }
    })

    gsap.to(bloomPlants, {
      scale: 1.08,
      duration: 1.8,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true
    })

    gsap.to(budPlants, {
      scale: 1.03,
      duration: 2.2,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true
    })

    gsap.to(wiltPlants, {
      rotation: -6,
      opacity: 0.6,
      duration: 2.6,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true
    })

    gsap.to(pollenEls, {
      y: -40,
      x: 20,
      opacity: 0,
      duration: 6,
      ease: 'sine.inOut',
      repeat: -1,
      stagger: 0.2
    })
  }, gardenRef.value)
}

const seedPollen = () => {
  pollen.value = Array.from({ length: 16 }).map((_, i) => ({
    id: `pollen-${i}`,
    style: `--pollen-x:${(i % 8) * 12 + 8}%; --pollen-y:${Math.floor(i / 8) * 20 + 30}%; --pollen-delay:${(i % 6) * 0.3}s;`
  }))
}

onMounted(async () => {
  seedPollen()
  await loadData()
  await nextTick()
  animateGarden()
})

onUnmounted(() => {
  ctx?.revert()
})
</script>

<style scoped>
.garden-map {
  border-radius: 18px;
  padding: 24px;
  background: linear-gradient(180deg, rgba(14, 62, 39, 0.9), rgba(7, 29, 21, 0.95));
  border: 1px solid rgba(34, 197, 94, 0.25);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.25);
  position: relative;
  overflow: hidden;
}

.garden-map::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: radial-gradient(circle at 25% 20%, rgba(34, 197, 94, 0.18), transparent 40%),
    radial-gradient(circle at 75% 80%, rgba(34, 197, 94, 0.12), transparent 35%);
  pointer-events: none;
}

.garden-title {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 18px;
}

.title-pill,
.subtitle-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: rgba(236, 253, 245, 0.9);
  background: rgba(20, 83, 45, 0.6);
  border: 1px solid rgba(34, 197, 94, 0.4);
  border-radius: 999px;
  padding: 6px 12px;
}

.subtitle-pill {
  color: rgba(226, 232, 240, 0.85);
  background: rgba(30, 41, 59, 0.5);
  border-color: rgba(148, 163, 184, 0.3);
}

.garden-bed-single {
  position: relative;
  padding: 18px;
  border-radius: 20px;
  border: 2px solid rgba(148, 163, 184, 0.35);
  background: rgba(15, 23, 42, 0.5);
  min-height: 340px;
  overflow: hidden;
}

.bed-fence {
  position: absolute;
  inset: 42px 16px 18px 16px;
  border: 2px dashed rgba(148, 163, 184, 0.35);
  border-radius: 18px;
}

.bed-soil {
  position: absolute;
  inset: 52px 24px 28px 24px;
  background: linear-gradient(180deg, rgba(120, 53, 15, 0.9), rgba(69, 26, 3, 0.95));
  border-radius: 16px;
  box-shadow: inset 0 0 24px rgba(0, 0, 0, 0.35);
}

.pollen-layer {
  position: absolute;
  inset: 60px 30px 36px 30px;
  pointer-events: none;
  z-index: 3;
}

.pollen {
  position: absolute;
  left: var(--pollen-x);
  top: var(--pollen-y);
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: rgba(236, 253, 245, 0.8);
  box-shadow: 0 0 8px rgba(236, 253, 245, 0.6);
  opacity: 0.8;
}

.bed-sections {
  position: absolute;
  inset: 60px 30px 36px 30px;
  z-index: 2;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.garden-section {
  position: relative;
  padding: 12px;
  border-radius: 14px;
  border: 2px solid rgba(148, 163, 184, 0.4);
  background: rgba(15, 23, 42, 0.35);
  overflow: hidden;
  min-height: 140px;
}

.garden-section.tint-blue {
  border-color: rgba(59, 130, 246, 0.5);
}

.garden-section.tint-green {
  border-color: rgba(34, 197, 94, 0.5);
}

.garden-section.tint-gold {
  border-color: rgba(234, 179, 8, 0.55);
}

.garden-section.tint-rose {
  border-color: rgba(244, 63, 94, 0.55);
}

.section-header {
  display: flex;
  flex-direction: column;
  gap: 2px;
  color: rgba(226, 232, 240, 0.9);
}

.section-name {
  font-size: 14px;
  font-weight: 600;
}

.section-status {
  font-size: 11px;
  color: rgba(148, 163, 184, 0.9);
}

.section-plants {
  position: absolute;
  inset: 38px 12px 30px 12px;
}

.plant {
  position: absolute;
  left: var(--plant-x);
  top: var(--plant-y);
  transform: translate(-50%, -50%);
  animation: sway 3.6s ease-in-out infinite;
  animation-delay: var(--plant-delay);
}

.plant.seed {
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: rgba(226, 232, 240, 0.7);
}

.plant.sprout {
  width: 12px;
  height: 18px;
  border-radius: 999px 999px 8px 8px;
  background: rgba(34, 197, 94, 0.75);
  position: relative;
}

.plant.sprout::after {
  content: '';
  position: absolute;
  top: -6px;
  left: 6px;
  width: 10px;
  height: 10px;
  border-radius: 999px;
  background: rgba(34, 197, 94, 0.6);
}

.plant.flower {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: rgba(59, 130, 246, 0.75);
  box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
}

.plant.flower::after {
  content: '';
  position: absolute;
  inset: 4px;
  border-radius: 50%;
  background: rgba(248, 250, 252, 0.8);
}

.plant.blue { background: rgba(59, 130, 246, 0.85); box-shadow: 0 0 10px rgba(59, 130, 246, 0.5); }
.plant.green { background: rgba(34, 197, 94, 0.85); box-shadow: 0 0 10px rgba(34, 197, 94, 0.5); }
.plant.gold { background: rgba(234, 179, 8, 0.85); box-shadow: 0 0 10px rgba(234, 179, 8, 0.5); }
.plant.rose { background: rgba(244, 63, 94, 0.85); box-shadow: 0 0 10px rgba(244, 63, 94, 0.5); }
.plant.neutral { background: rgba(148, 163, 184, 0.7); box-shadow: none; }

.plant.seed { opacity: 0.75; }
.plant.bud { filter: brightness(1.05); }
.plant.bloom { filter: brightness(1.2); }
.plant.wilt { filter: grayscale(0.2); }

.garden-bed.seed .plant { animation-duration: 4.5s; opacity: 0.75; }
.garden-bed.wilt .plant { animation-duration: 5s; opacity: 0.6; filter: grayscale(0.3); }
.garden-bed.bloom .plant { animation-duration: 3s; }

.section-metrics {
  position: absolute;
  bottom: 8px;
  left: 10px;
  right: 10px;
  display: flex;
  justify-content: space-between;
  font-size: 10px;
  color: rgba(226, 232, 240, 0.8);
}

.section-metrics strong {
  display: block;
  font-size: 12px;
  color: rgba(236, 253, 245, 0.95);
}

@keyframes sway {
  0%, 100% {
    transform: translate(-50%, -50%) rotate(-2deg);
  }
  50% {
    transform: translate(-50%, -50%) rotate(2deg);
  }
}
</style>
