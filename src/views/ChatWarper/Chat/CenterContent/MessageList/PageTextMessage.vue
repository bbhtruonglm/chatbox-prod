<template>
  <div
    class="message-box z-1 break-words whitespace-pre-line bg-white"
  >
    {{ current_message.message_text }}
  </div>
</template>
<script setup lang="ts">
import type { MessageInfo } from '@/service/interface/app/message'

const $props = withDefaults(
  defineProps<{
    /**dữ liệu của tin hiện tại */
    current_message: MessageInfo
    /**vị trí của tin nhắn hiện tại */
    current_index: number
    /**toàn bộ danh sách tin nhắn */
    list_message: MessageInfo[]
  }>(),
  {}
)
</script>
