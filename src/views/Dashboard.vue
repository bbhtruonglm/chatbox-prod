<template>
  <div class="flex flex-col h-full">
    <Header class="flex-shrink-0" />
    <div class="overflow-hidden pt-3 h-full">
      <RouterView />
    </div>
  </div>
</template>

<script setup lang="ts">
import { provide } from 'vue'
import { initRequireData } from '@/views/composable'
import { KEY_GET_CHATBOT_USER_FUNCT } from '@/views/Dashboard/symbol'

import Header from '@/views/Dashboard/Header.vue'

// composable
const { getMeChatbotUser } = initRequireData()

// cung cấp hàm này cho component con dùng
provide(KEY_GET_CHATBOT_USER_FUNCT, getMeChatbotUser)
</script>
