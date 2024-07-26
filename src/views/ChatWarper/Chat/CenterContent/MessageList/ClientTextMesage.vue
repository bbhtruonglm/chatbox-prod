<template>
  <div
    @click="clickCopyPhoneEmail"
    v-html="
      renderText(
        current_message?.message_text || current_message?.postback_title || ''
      )
    "
    :class="{
      'border border-red-500': calcIsClientRepSlow(
        current_message?.fb_page_id,
        current_message?.time || current_message?.createdAt,
        current_index,
      ),
    }"
    class="message-box break-words whitespace-pre-line bg-white z-1"
  />
</template>
<script setup lang="ts">
import {
  calcIsClientRepSlow,
  clickCopyPhoneEmail,
  renderText,
} from '@/service/function'

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
