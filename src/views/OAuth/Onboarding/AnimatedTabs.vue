<template>
  <div class="p-6">
    <div class="flex gap-4 mb-4">
      <button
        @click="switchTab(0)"
        :class="[
          'px-4 py-2 rounded',
          ACTIVE_INDEX === 0 ? 'bg-blue-600 text-white' : 'bg-gray-200',
        ]"
      >
        Tab 1
      </button>
      <button
        @click="switchTab(1)"
        :class="[
          'px-4 py-2 rounded',
          ACTIVE_INDEX === 1 ? 'bg-blue-600 text-white' : 'bg-gray-200',
        ]"
      >
        Tab 2
      </button>
    </div>

    <div
      ref="containerRef"
      class="flex-container"
      :class="{ tab2: ACTIVE_INDEX === 1 }"
    >
      <!-- A -->
      <div
        v-show="ACTIVE_INDEX === 0 || isAnimating"
        ref="cardA"
        key="a"
        class="card"
      >
        A1231231231231231
      </div>
      <!-- B -->
      <div
        v-show="ACTIVE_INDEX === 0 || isAnimating"
        ref="cardB"
        key="b"
        class="card"
      >
        B123123123123123123
      </div>
      <!-- C -->
      <div
        ref="cardC"
        key="c"
        class="card c-card"
      >
        C123123123123123123123
      </div>
      <!-- D -->
      <div
        ref="cardD"
        key="d"
        class="card d-card"
      >
        D12312312312312331212312
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue'

const ACTIVE_INDEX = ref(0)
const isAnimating = ref(false)
const containerRef = ref(null)
const cardA = ref(null)
const cardB = ref(null)
const cardC = ref(null)
const cardD = ref(null)

const gap = 16 // Gap from CSS

const switchTab = async tab => {
  if (ACTIVE_INDEX.value === tab) return
  isAnimating.value = true

  const containerRect = containerRef.value.getBoundingClientRect()
  const containerWidth = containerRect.width
  const containerLeft = containerRect.left

  // Record initial positions
  const firstA = cardA.value ? cardA.value.getBoundingClientRect() : null
  const firstB = cardB.value ? cardB.value.getBoundingClientRect() : null
  const firstC = cardC.value.getBoundingClientRect()
  const firstD = cardD.value.getBoundingClientRect()

  const firstLeftA = firstA ? firstA.left - containerLeft : 0
  const firstLeftB = firstB ? firstB.left - containerLeft : 0
  const firstLeftC = firstC.left - containerLeft
  const firstLeftD = firstD.left - containerLeft

  // Calculate fixed width for cards in Tab 1 (1/4 container width)
  const targetWidth = (containerWidth - 3 * gap) / 4

  // Update tab
  ACTIVE_INDEX.value = tab
  await nextTick()

  // Set absolute positioning to invert to initial state
  const cards = {
    A: cardA.value,
    B: cardB.value,
    C: cardC.value,
    D: cardD.value,
  }

  Object.values(cards).forEach(el => {
    if (el) {
      el.style.transition = 'none'
      el.style.position = 'absolute'
    }
  })

  // Set initial positions and widths
  if (cards.A) {
    cards.A.style.left = firstLeftA + 'px'
    cards.A.style.width = targetWidth + 'px'
    cards.A.style.opacity = firstA ? '1' : '0'
  }
  if (cards.B) {
    cards.B.style.left = firstLeftB + 'px'
    cards.B.style.width = targetWidth + 'px'
    cards.B.style.opacity = firstB ? '1' : '0'
  }
  cards.C.style.left = firstLeftC + 'px'
  cards.C.style.width = firstC.width + 'px'
  cards.D.style.left = firstLeftD + 'px'
  cards.D.style.width = firstD.width + 'px'

  // Prevent layout collapse
  containerRef.value.style.height = containerRect.height + 'px'

  // Play animation
  requestAnimationFrame(() => {
    if (tab === 1) {
      // To Tab 2: A, B slide out, C takes 1/4, D takes 3/4
      const targetWidthC = (containerWidth - gap) / 4
      const targetWidthD = (3 * (containerWidth - gap)) / 4
      const shiftAmount = -(targetWidth + gap) // Slide A, B out to the left
      const targetLeftA = firstLeftA + shiftAmount
      const targetLeftB = firstLeftB + shiftAmount
      const targetLeftC = 0
      const targetLeftD = targetWidthC + gap

      Object.values(cards).forEach(el => {
        if (el) el.style.transition = 'all 0.6s ease-in-out'
      })

      if (cards.A) {
        cards.A.style.left = targetLeftA + 'px'
        cards.A.style.opacity = '0'
      }
      if (cards.B) {
        cards.B.style.left = targetLeftB + 'px'
        cards.B.style.opacity = '0'
      }
      cards.C.style.left = targetLeftC + 'px'
      cards.C.style.width = targetWidthC + 'px'
      cards.D.style.left = targetLeftD + 'px'
      cards.D.style.width = targetWidthD + 'px'
    } else {
      // To Tab 1: A, B slide in from outside, all cards 1/4 width
      const targetLeftA = 0
      const targetLeftB = targetWidth + gap
      const targetLeftC = 2 * (targetWidth + gap)
      const targetLeftD = 3 * (targetWidth + gap)
      const shiftAmount = -(2 * (targetWidth + gap)) // Start A, B outside left

      Object.values(cards).forEach(el => {
        if (el) el.style.transition = 'all 0.6s ease-in-out'
      })

      // Initialize A, B outside left
      if (cards.A) {
        cards.A.style.left = shiftAmount + 'px'
        cards.A.style.width = targetWidth + 'px'
        cards.A.style.opacity = '0'
      }
      if (cards.B) {
        cards.B.style.left = shiftAmount + targetWidth + gap + 'px'
        cards.B.style.width = targetWidth + 'px'
        cards.B.style.opacity = '0'
      }
      cards.C.style.left = firstLeftC + 'px'
      cards.C.style.width = firstC.width + 'px'
      cards.D.style.left = firstLeftD + 'px'
      cards.D.style.width = firstD.width + 'px'

      // Animate to target positions
      requestAnimationFrame(() => {
        if (cards.A) {
          cards.A.style.left = targetLeftA + 'px'
          cards.A.style.opacity = '1'
        }
        if (cards.B) {
          cards.B.style.left = targetLeftB + 'px'
          cards.B.style.opacity = '1'
        }
        cards.C.style.left = targetLeftC + 'px'
        cards.C.style.width = targetWidth + 'px'
        cards.D.style.left = targetLeftD + 'px'
        cards.D.style.width = targetWidth + 'px'
      })
    }
  })

  // Cleanup after animation
  const onTransitionEnd = () => {
    Object.values(cards).forEach(el => {
      if (el) el.style = ''
    })
    containerRef.value.style.height = ''
    isAnimating.value = false
  }
  cardD.value.addEventListener('transitionend', onTransitionEnd, { once: true })
}
</script>

<style scoped>
.flex-container {
  display: flex;
  gap: 16px;
  align-items: stretch;
  width: 100%;
  position: relative;
  overflow: hidden;
}

/* Card chung */
.card {
  flex: 1;
  background: #e5e7eb;
  padding: 1.25rem;
  border-radius: 0.75rem;
  text-align: center;
  font-weight: 700;
  font-size: 1.125rem;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  box-sizing: border-box;
  transition: all 0.6s ease-in-out;
}

/* Khi Tab2: D mở rộng width */
.flex-container.tab2 .d-card {
  flex: 3;
}
.flex-container.tab2 .c-card {
  flex: 1;
}
</style>
