<template>
  <div
    class="flex items-start gap-3 border border-green-600 bg-green-50 rounded-lg text-green-600 px-4 py-3 text-sm"
  >
    <CheckBadgeIcon class="w-5 h-5 flex-shrink-0" />
    <div class="flex flex-col gap-1">
      <slot />
    </div>
  </div>
</template>
<script setup lang="ts">
import { CheckBadgeIcon } from '@heroicons/vue/24/solid'
</script>
