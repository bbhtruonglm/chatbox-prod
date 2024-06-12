<template>
  <Header />
  <div class="h-full w-full flex relative">
    <Menu />
    <RouterView />
  </div>
  <RequirePricing />
</template>

<script setup lang="ts">
import { initRequireData } from '@/views/composable'

import Header from '@/views/Dashboard/Header.vue'
import Menu from '@/views/Dashboard/Menu.vue'
import RequirePricing from '@/components/Main/RequirePricing.vue'

// composable
const { getMeChatbotUser } = initRequireData()

defineExpose({ getMeChatbotUser })
</script>
