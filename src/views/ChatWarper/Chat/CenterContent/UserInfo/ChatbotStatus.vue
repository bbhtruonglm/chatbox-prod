<template>
  <div
    v-tooltip.bottom="$t('Trợ lý AI')"
    class="flex items-center gap-1"
  >
    <SparklesIcon class="size-5" />
    <Toggle
      v-model="is_enable"
      class_toggle="peer-checked:bg-black"
    />
  </div>
</template>
<script setup lang="ts">
import Toggle from '@/components/Toggle.vue'

import { SparklesIcon } from '@heroicons/vue/24/solid'

import { composableService } from '@/views/ChatWarper/Chat/CenterContent/UserInfo/ChatbotStatus/service'

const { is_enable } = composableService()
</script>
