<template>
  <div class="flex flex-col h-full">
    <Header class="flex-shrink-0" />
    <div class="overflow-hidden pt-3 h-full">
      <RouterView />
    </div>
  </div>
</template>

<script setup lang="ts">
import { initRequireData } from '@/views/composable'

import Header from '@/views/Dashboard/Header.vue'

// composable
const { getMeChatbotUser } = initRequireData()

// TODO loại bỏ cái này
defineExpose({ getMeChatbotUser })
</script>
