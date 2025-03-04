<template>
  <div class="flex flex-col gap-2 min-h-0 h-[70vh] md:h-auto pb-4 md:pb-0">
    <div class="flex justify-between items-center">
      <label class="text-base font-semibold">
        {{ title }}
      </label>
      <span
        v-if="total_item_selected"
        class="text-sm font-medium"
      >
        {{ $t('Đã chọn') }}: {{ total_item_selected }} {{ title }}
      </span>
    </div>
    <div class="min-h-0 overflow-y-auto flex flex-col gap-2">
      <slot />
    </div>
    <Description />
  </div>
</template>
<script setup lang="ts">
const $props = withDefaults(
  defineProps<{
    /**tên tiêu đề */
    title?: string
    /**tổng số phần tử đã chọn */
    total_item_selected?: number
  }>(),
  {}
)

import Description from '@/views/Dashboard/Org/Setting/Group/GroupUpsertModal/Description.vue'
</script>
