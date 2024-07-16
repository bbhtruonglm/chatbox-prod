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
      <div
        :class="{
          'font-semibold': source?.unread_message_amount,
        }"
        class="text-left truncate text-sm flex-grow min-w-0"
      >
        {{ source?.client_name }}
      </div>
    </div>
    <div class="flex-shrink-0 text-xs">
      {{ formatLastMessageTime(source?.last_message_time) }}
    </div>
  </div>
</template>
<script setup lang="ts">
import { getStaffInfo } from '@/service/function'
import {
  format as format_date,
  isThisWeek,
  isThisYear,
  formatDistanceToNow,
} from 'date-fns'
import viLocale from 'date-fns/locale/vi'

import StaffAvatar from '@/components/Avatar/StaffAvatar.vue'

import ArrowDown from '@/components/Icons/ArrowDown.vue'

import type { ConversationInfo } from '@/service/interface/app/conversation'

const $props = withDefaults(
  defineProps<{
    source?: ConversationInfo
  }>(),
  {}
)

/**20 giây trước, 2 ngày trước, ... */
function genAgoDate(timestamp: number) {
  return formatDistanceToNow(new Date(timestamp), {
    addSuffix: true,
    locale: viLocale,
  })
}
/**format lại thời gian trước khi hiển thị */
function formatLastMessageTime(timestamp?: number) {
  if (!timestamp) return ''

  // nếu thời gian trong tuần thì chỉ hiện ago
  if (isThisWeek(timestamp)) return genAgoDate(timestamp)

  // nếu trong năm thì hiện ngày tháng
  if (isThisYear(timestamp)) return format_date(timestamp, 'dd/MM')

  // nếu khác năm thì hiện full
  return format_date(timestamp, 'dd/MM/yy')
}
</script>
