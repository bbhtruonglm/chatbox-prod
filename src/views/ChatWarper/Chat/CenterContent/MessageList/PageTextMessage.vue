<template>
  <div
    @click="clickCopyPhoneEmail"
    v-html="renderText(current_message.message_text || '')"
    class="message-box z-1 break-words whitespace-pre-line bg-[#FFF8E1]"
  />
</template>
<script setup lang="ts">
import { clickCopyPhoneEmail, renderText } from '@/service/function'
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
