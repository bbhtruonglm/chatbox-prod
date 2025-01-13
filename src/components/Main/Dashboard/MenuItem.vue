<template>
  <button
    :class="{ 'bg-slate-800 text-white hover:bg-slate-800': is_selected }"
    class="flex gap-3 items-center py-1.5 px-2 text-sm font-medium hover:bg-slate-100 rounded-md w-full"
  >
    <div
      :class="{ 'bg-gray-800': is_selected }"
      class="w-8 h-8 rounded-full flex items-center bg-slate-100 justify-center flex-shrink-0"
    >
      <component
        :is="icon"
        :class="class_icon"
        class=""
      />
    </div>
    <div class="flex-grow text-left">
      {{ title }}
    </div>
    <slot />
  </button>
</template>
<script setup lang="ts">
import Badge from '@/components/Badge.vue'

import type { Component } from 'vue'

const $props = withDefaults(
  defineProps<{
    /** Icon vue */
    icon: Component
    /** Tiêu đề */
    title: string
    /** Đã chọn */
    is_selected?: boolean
    /** Icon class */
    class_icon?: string
  }>(),
  {
    class_icon: 'w-5 h-5',
  }
)
</script>
