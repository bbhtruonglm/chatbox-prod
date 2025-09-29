<template>
  <div class="p-6">
    <!-- Header Tabs -->
    <div class="flex gap-4 mb-4">
      <button
        @click="switchTab(1)"
        :class="[
          'px-4 py-2 rounded',
          activeTab === 1 ? 'bg-blue-600 text-white' : 'bg-gray-200',
        ]"
      >
        Tab 1
      </button>
      <button
        @click="switchTab(2)"
        :class="[
          'px-4 py-2 rounded',
          activeTab === 2 ? 'bg-blue-600 text-white' : 'bg-gray-200',
        ]"
      >
        Tab 2
      </button>
    </div>

    <!-- GRID WRAPPER -->
    <div
      ref="gridWrapper"
      class="relative overflow-hidden transition-[height] duration-200"
      :style="{ height: gridHeight + 'px' }"
    >
      <transition-group
        :name="transitionName"
        tag="div"
        class="grid grid-cols-4 gap-4"
      >
        <!-- A -->
        <div
          v-if="activeTab === 1"
          key="a"
          class="card"
        >
          A
        </div>
        <!-- B -->
        <div
          v-if="activeTab === 1"
          key="b"
          class="card"
        >
          B
        </div>

        <!-- C -->
        <div
          :key="'c-' + activeTab"
          class="card col-span-1"
        >
          C
        </div>

        <!-- D -->
        <div
          :key="'d-' + activeTab"
          class="card"
          :class="['transition-all ease-in-out duration-400']"
          :style="dStyle"
        >
          D
        </div>
      </transition-group>
    </div>

    <!-- Hidden measure nodes -->
    <div
      ref="measureWrapper"
      style="
        position: absolute;
        left: -9999px;
        top: 0;
        pointer-events: none;
        visibility: hidden;
        z-index: -1;
      "
    >
      <div
        ref="measureTab1"
        class="w-full"
      >
        <div class="grid grid-cols-4 gap-4">
          <div class="card">A</div>
          <div class="card">B</div>
          <div class="card">C</div>
          <div class="card">D</div>
        </div>
      </div>
      <div
        ref="measureTab2"
        class="w-full mt-2"
      >
        <div class="grid grid-cols-4 gap-4">
          <div class="card">C</div>
          <div class="card col-span-3">D</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue'

const activeTab = ref(1)
const direction = ref('forward')
const gridWrapper = ref(null)
const measureTab1 = ref(null)
const measureTab2 = ref(null)
const gridHeight = ref(0)

const switchTab = tab => {
  if (tab === activeTab.value) return
  direction.value = tab > activeTab.value ? 'forward' : 'backward'
  activeTab.value = tab
}

const transitionName = computed(() =>
  direction.value === 'forward' ? 'slide-right' : 'slide-left'
)

function recalcHeights() {
  if (!gridWrapper.value || !measureTab1.value || !measureTab2.value) return
  const width = gridWrapper.value.clientWidth
  measureTab1.value.style.width = width + 'px'
  measureTab2.value.style.width = width + 'px'
  nextTick(() => {
    const h1 = measureTab1.value.offsetHeight
    const h2 = measureTab2.value.offsetHeight
    gridHeight.value = Math.max(h1, h2, 80)
  })
}
onMounted(() => {
  nextTick(() => recalcHeights())
  window.addEventListener('resize', recalcHeights)
})
onBeforeUnmount(() => {
  window.removeEventListener('resize', recalcHeights)
})

/* Animate D width đồng bộ với A,B leave */
const dStyle = computed(() => {
  if (!gridWrapper.value) return {}
  const totalWidth = gridWrapper.value.clientWidth
  const gap = 16
  const colWidth = (totalWidth - 3 * gap) / 4
  const width = activeTab.value === 2 ? colWidth * 3 + 2 * gap : colWidth
  return {
    width: width + 'px',
  }
})
</script>

<style scoped>
.card {
  background: #e5e7eb;
  padding: 1.25rem;
  border-radius: 0.75rem;
  text-align: center;
  font-weight: 700;
  font-size: 1.125rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 64px;
  box-sizing: border-box;
}

/* Slide-right: từ phải sang trái khi Tab2 */
.slide-right-enter-active,
.slide-right-leave-active {
  transition: transform 0.4s ease, opacity 0.4s ease;
}
.slide-right-enter-from {
  opacity: 0;
  transform: translateX(60px);
}
.slide-right-leave-to {
  opacity: 0;
  transform: translateX(-60px);
}

/* Slide-left: từ trái sang phải khi về Tab1 */
.slide-left-enter-active,
.slide-left-leave-active {
  transition: transform 0.4s ease, opacity 0.4s ease;
}
.slide-left-enter-from {
  opacity: 0;
  transform: translateX(-60px);
}
.slide-left-leave-to {
  opacity: 0;
  transform: translateX(60px);
}
</style>
