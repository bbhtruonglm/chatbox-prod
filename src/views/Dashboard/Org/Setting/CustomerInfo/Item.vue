<template>
  <div class="flex">
    <div class="w-28 flex-shrink-0">
      {{ title }}
    </div>
    <div class="truncate min-w-0 flex-grow-0">
      {{ value }}
    </div>
  </div>
</template>
<script setup lang="ts">
const $props = withDefaults(
  defineProps<{
    /**tiêu đề */
    title: string
    /**class cho header */
    value?: any
  }>(),
  {}
)
</script>
