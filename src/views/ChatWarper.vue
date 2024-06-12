<template>
  <div class="h-full w-full flex relative">
    <Menu />
    <Chat />
  </div>
</template>
<script setup lang="ts">
import { initRequireData } from '@/views/composable'

import Chat from '@/views/ChatWarper/Chat.vue'
import Menu from '@/views/Dashboard/Menu.vue'

// composable
initRequireData()
</script>
