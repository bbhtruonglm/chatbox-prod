<template>
  <button
    class="flex gap-3 items-center py-1.5 px-2 text-sm font-medium hover:bg-slate-100 rounded-md w-full"
  >
    <div
      class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0"
    >
      <component :is="icon"></component>
    </div>
    <div class="flex-grow text-left">
      {{ title }}
    </div>
    <Badge
      v-if="alert_value"
      :value="alert_value"
      class="flex-shrink-0"
    />
  </button>
</template>
<script setup lang="ts">
import Badge from '@/views/Dashboard/Header/Badge.vue'

import type { Component } from 'vue'

const $props = withDefaults(
  defineProps<{
    /** Icon vue */
    icon: Component
    /** Tiêu đề */
    title: string
    /** Số lượng thông báo */
    alert_value?: number
  }>(),
  {}
)
</script>
