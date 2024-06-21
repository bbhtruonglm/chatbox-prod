<template>
  <button
    v-tooltip.right="title"
    :tooltip-disabled="is_disable_tooltip"
    :class="{
      'bg-slate-300': is_active,
    }"
    class="rounded-lg hover:bg-slate-300 p-2.5"
  >
    <component
      :is="icon"
      class="w-6 h-6 m-auto text-slate-900"
    />
  </button>
</template>

<script setup lang="ts">
import type { Component } from 'vue'

withDefaults(
  defineProps<{
    /**icon */
    icon: Component
    /** tiêu đề */
    title: string
    /** đang chọn ? */
    is_active?: boolean
    /**có huỷ bỏ tooltip không */
    is_disable_tooltip?: boolean
  }>(),
  {}
)
</script>
