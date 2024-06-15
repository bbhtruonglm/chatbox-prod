<template>
  <div class="flex flex-col h-full">
    <Header class="flex-shrink-0" />
    <div class="overflow-hidden pt-3 h-full">
      <RouterView />
    </div>
  </div>
  <ConnectPage ref="connect_page_ref" />
</template>

<script setup lang="ts">
import { provide, ref } from 'vue'
import { initRequireData } from '@/views/composable'
import {
  KEY_GET_CHATBOT_USER_FUNCT,
  KEY_TOGGLE_MODAL_CONNECT_PAGE_FUNCT,
} from '@/views/Dashboard/symbol'

import Header from '@/views/Dashboard/Header.vue'
import ConnectPage from '@/views/Dashboard/ConnectPage.vue'

// composable
const { getMeChatbotUser } = initRequireData()

/**ref của modal kết nối nền tảng */
const connect_page_ref = ref<InstanceType<typeof ConnectPage>>()

/**ẩn hiện modal kết nối nền tảng */
function toggleModalConnectPage() {
  connect_page_ref.value?.toggleModal?.()
}

// cung cấp hàm này cho component con dùng
provide(KEY_GET_CHATBOT_USER_FUNCT, getMeChatbotUser)
provide(KEY_TOGGLE_MODAL_CONNECT_PAGE_FUNCT, toggleModalConnectPage)
</script>
