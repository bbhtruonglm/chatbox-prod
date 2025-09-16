<template>
  <!-- container -->
  <div
    class="relative flex flex-row gap-5 h-16 items-end overflow-hidden bg-slate-50"
  >
    <!-- white seam, chỉ bằng width tabs -->
    <div class="flex">
      <!-- filler trái -->
      <div class="first-tab w-12 bg-slate-50 z-20"></div>

      <!-- tabs -->
      <div class="flex relative">
        <div
          v-for="(label, index) in tabs"
          :key="index"
          class="tab whitespace-nowrap px-10 py-4 font-medium grid place-items-center text-black text-xl relative z-20 cursor-pointer select-none first:ml-0"
          :class="[
            index === active_index
              ? 'bg-white z-30 rounded-t-xl'
              : 'bg-yellow-200',
            index === active_index - 1 ? 'rounded-br-xl' : '',
            index === active_index + 1 ? 'rounded-bl-xl' : '',
            index === 0 ? 'rounded-tl-xl' : '',
            index === tabs.length - 1 ? 'rounded-tr-xl' : '',
          ]"
          @click="selectTab(index)"
        >
          {{ label }}
        </div>
        <div
          class="absolute top-0 left-0 h-4 w-full bg-yellow-200 z-20 rounded-t-2xl"
        ></div>
        <div class="absolute bottom-0 left-0 h-2 w-full bg-white z-10"></div>
      </div>
      <div class="last-tab w-12 bg-slate-50 z-20"></div>
    </div>

    <!-- filler phải -->
    <div
      class="flex items-center justify-end w-full h-full gap-4 bg-gray-50 px-12 rounded-lg"
    >
      <span class="font-medium">Choose month</span>

      <ShadcnSelectPopper
        v-model="SELECTED"
        :options="MONTHS"
        placeholder="Select month"
        width="180px"
      />

      <div class="flex items-center text-green-600 gap-1 cursor-pointer">
        <GiftIcon class="w-5 h-5" />
        <span>
          Promotion:
          <a
            href="#"
            class="font-semibold underline text-green-600"
            >Claim here</a
          >
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ShadcnSelectPopper from '@/components/Select/ShadcnSelectPopper.vue'
import { GiftIcon } from '@heroicons/vue/24/outline'
import { ref } from 'vue'

const props = defineProps<{
  active_index: number
  tabs: string[]
}>()

const emit = defineEmits<{
  (e: 'change-tab', index: number): void
}>()

function selectTab(index: number) {
  emit('change-tab', index)
}
/** Các option chọn tháng */
const MONTHS = [
  { value: '1', label: '1 month' },
  { value: '3', label: '3 months' },
  { value: '6', label: '6 months' },
  { value: '12', label: '12 months' },
]
/** giá trị mặc định */
const SELECTED = ref('12')
</script>
