<template>
  <div class="bg-white flex flex-col gap-2">
    <button
      v-for="button of data"
      class="bg-slate-200 w-full rounded-md py-2 px-4 text-center truncate cursor-not-allowed font-medium"
    >
      {{ button?.title }}
    </button>
  </div>
</template>
<script setup lang="ts">
import type { ChatbotButton } from '@/service/interface/app/message'

const $props = withDefaults(
  defineProps<{
    data?: ChatbotButton[]
  }>(),
  {}
)
</script>
