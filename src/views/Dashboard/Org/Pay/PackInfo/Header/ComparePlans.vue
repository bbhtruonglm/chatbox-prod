<template>
  <div class="flex flex-col gap-5">
    <h2
      class="text-3xl font-medium text-center pt-5 flex justify-center gap-2.5 items-center"
    >
      {{ data.title }}
      <ChevronUpIcon class="size-7" />
    </h2>

    <div class="overflow-x-auto bg-white rounded-xl">
      <!-- Header -->
      <div
        class="grid font-semibold"
        :style="{ gridTemplateColumns: gridCols }"
      >
        <div class="p-3 text-left"></div>
        <div
          v-for="(plan, planIdx) in data.plans"
          :key="plan.key"
          class="p-3 text-center flex justify-center text-2xl rounded-t-xl"
          :class="[
            plan.name === selectedPlanIndex
              ? 'bg-cyan-50 font-bold '
              : 'font-semibold',
          ]"
        >
          <div class="flex items-center gap-2">
            <div
              class="flex size-6 rounded-full justify-center items-center flex-shrink-0"
              :class="[
                plan.name === selectedPlanIndex ? 'bg-cyan-600' : 'bg-gray-400',
              ]"
            >
              <div
                class="flex bg-white rounded-full justify-center items-center"
                :class="[
                  plan.name !== selectedPlanIndex
                    ? 'bg-blue-600'
                    : 'bg-gray-400',
                ]"
              >
                <CheckCircleIcon
                  class="size-5 text-cyan-600"
                  :class="[
                    plan.name === selectedPlanIndex
                      ? 'text-white'
                      : 'text-transparent',
                  ]"
                />
              </div>
            </div>
            {{ plan.name }}
          </div>
        </div>
      </div>

      <!-- Sections -->
      <div
        v-for="(section, sectionIdx) in data.sections"
        :key="section.title"
      >
        <!-- Section row (grid) -->
        <div
          class="grid font-semibold text-2xl text-gray-800"
          :style="{ gridTemplateColumns: gridCols }"
        >
          <!-- Cột feature name -->
          <div class="pt-5">
            {{ section.title }}
          </div>
          <!-- Cột tương ứng với mỗi gói -->
          <div
            v-for="(plan, planIdx) in data.plans"
            :key="plan.key + section.title"
            class="p-3 text-center"
            :class="plan.name === selectedPlanIndex ? 'bg-cyan-50' : ''"
          >
            <!-- để màu nền tương ứng với gói -->
          </div>
        </div>

        <div
          v-for="(feature, idx) in section.features"
          :key="section.title + idx"
          class="grid items-center border-b border-slate-200 cursor-pointer"
          :class="
            isRowSelected(sectionIdx, idx) ? 'bg-cyan-50' : 'hover:bg-gray-50'
          "
          :style="{ gridTemplateColumns: gridCols }"
          @click="onRowClick(sectionIdx, idx)"
        >
          <!-- Feature name cell -->
          <div class="p-3 flex justify-between items-center text-sm">
            <span>
              {{ feature.name }}
            </span>
            <InformationCircleIcon class="size-4 text-slate-400" />
          </div>

          <!-- Each plan cell -->
          <div
            v-for="(plan, planIdx) in data.plans"
            :key="plan.key + idx"
            class="p-3 flex justify-center items-center w-full text-sm"
            :class="plan.name === selectedPlanIndex ? 'bg-cyan-50' : ''"
          >
            <template v-if="feature.values[plan.key] === true">
              <span class="text-slate-800 text-center">
                <CheckIcon class="size-5" />
              </span>
            </template>
            <template v-else-if="feature.values[plan.key]">
              {{ feature.values[plan.key] }}
            </template>
            <template v-else>
              <span class="text-gray-400">-</span>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  CheckCircleIcon,
  CheckIcon,
  ChevronUpIcon,
} from '@heroicons/vue/24/solid'
import { InformationCircleIcon } from '@heroicons/vue/24/outline'

/** Kiểu dữ liệu plans */
interface Plan {
  key: string
  name: string
}
/** Kiểu dữ liệu chức năng */
interface Feature {
  name: string
  values: Record<string, string | number | boolean | null | undefined>
}
/** Kiểu dữ liệu section */
interface Section {
  title: string
  features: Feature[]
}
/** Kiểu dữ liệu Data phần compare plans & feature */
interface CompareData {
  title: string
  plans: Plan[]
  sections: Section[]
}

/** Selected row kiểu object để phân biệt theo section */
type SelectedRow = { sectionIndex: number; rowIndex: number } | null

/** Định nghĩa props */
const props = defineProps<{
  data: CompareData
  selectedPlanIndex?: string // gói được highlight (ở bạn dùng plan.name so sánh)
  selectedRow?: SelectedRow // giờ là object {sectionIndex, rowIndex}
}>()

/** Khai báo hàm emit để component con phát sự kiện 'rowSelect' kèm {sectionIndex,rowIndex} cho cha */
// Phát sự kiện: emit('rowSelect', { sectionIndex: number, rowIndex: number })
const emit = defineEmits<{
  (e: 'rowSelect', payload: { sectionIndex: number; rowIndex: number }): void
}>()

/** tạo call  */
const gridCols = `416px repeat(${props.data.plans.length}, minmax(120px,1fr))`

/** helper: kiểm tra row đang được chọn (theo section) */
function isRowSelected(sectionIdx: number, rowIdx: number) {
  return (
    props.selectedRow?.sectionIndex === sectionIdx &&
    props.selectedRow?.rowIndex === rowIdx
  )
}

/** on click row -> emit payload có sectionIndex & rowIndex */
function onRowClick(sectionIdx: number, rowIdx: number) {
  emit('rowSelect', { sectionIndex: sectionIdx, rowIndex: rowIdx })
}
</script>
