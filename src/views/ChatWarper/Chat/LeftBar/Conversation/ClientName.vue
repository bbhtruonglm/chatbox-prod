<template>
  <div class="flex items-center justify-between gap-3">
    <div class="flex items-center flex-grow gap-1 min-w-0">
      <template v-if="source?.fb_staff_id">
        <StaffAvatar
          v-tooltip="
            getStaffInfo(source?.fb_page_id, source?.fb_staff_id)?.name
          "
          :id="source?.fb_staff_id"
          class="rounded-full w-4 h-4 flex-shrink-0"
        />
        <ArrowDown class="-rotate-90 w-2 h-2 text-slate-500 flex-shrink-0" />
      </template>
      <div class="text-left truncate text-sm font-semibold flex-grow min-w-0">
        {{ source?.client_name }}
      </div>
    </div>
    <Badge
      v-if="isNewMessage()"
      :value="source?.unread_message_amount!"
      class="flex-shrink-0"
    />
  </div>
</template>
<script setup lang="ts">
import { useConversationStore } from '@/stores'
import { getStaffInfo } from '@/service/function'

import StaffAvatar from '@/components/Avatar/StaffAvatar.vue'
import Badge from '@/components/Badge.vue'

import ArrowDown from '@/components/Icons/ArrowDown.vue'

import type { ConversationInfo } from '@/service/interface/app/conversation'

const $props = withDefaults(
  defineProps<{
    source?: ConversationInfo
  }>(),
  {}
)

const conversationStore = useConversationStore()

/**có đánh dấu hội thoại này là chưa đọc không */
function isNewMessage(): boolean {
  // nếu đang chọn hội thoại này thì không hiện
  if (
    conversationStore.select_conversation?.data_key ===
      $props.source?.data_key &&
    !conversationStore.select_conversation?.is_force_unread
  )
    return false

  // tính toán dựa trên số tin nhắn chưa đọc
  return !!$props.source?.unread_message_amount
}
</script>
