<template>
  <div
    :class="{
      'text-slate-500': !source?.unread_message_amount,
    }"
    class="flex items-center text-xs font-medium gap-2 justify-between"
  >
    <div class="truncate">
      <template v-if="source?.last_message_type === 'page'">
        {{ $t('v1.view.main.dashboard.chat.you') }}
      </template>
      {{ source?.last_message }}
    </div>
    <div class="flex-shrink-0">
      {{ formatLastMessageTime(source?.last_message_time) }}
    </div>
  </div>
</template>
<script setup lang="ts">
import {
  format as format_date,
  isThisWeek,
  isThisYear,
  formatDistanceToNow,
} from 'date-fns'
import viLocale from 'date-fns/locale/vi'

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
