<template>
  <div class="h-4" />
  <div class="text-xs absolute w-max bottom-0">
    {{ $t('v1.view.main.dashboard.chat.message.reply_time') }}:
    <span class="text-red-500">{{ calcDuration() }}</span>
  </div>
</template>
<script setup lang="ts">
import { formatDistanceStrict } from 'date-fns'
import { useI18n } from 'vue-i18n'
import viLocale from 'date-fns/locale/vi'

import type { MessageInfo } from '@/service/interface/app/message'

const $props = withDefaults(
  defineProps<{
    /**tin nhắn hiện tại */
    now_message: MessageInfo
    /**tin nhắn tiếp theo */
    next_message?: MessageInfo
  }>(),
  {}
)

const $t = useI18n().t

/**tính khoảng thời gian tin nhắn này của khách chưa được rep */
function calcDuration() {
  // chỉ hiển thị khi tin tiếp theo là trang trả lời
  if ($props.next_message?.message_type !== 'page') return undefined

  let now_date = $props.now_message.time || $props.now_message.createdAt
  let next_date = $props.next_message.time || $props.next_message.createdAt

  // nếu hết tin nhắn rồi thì thôi
  if (!next_date) return undefined

  /**khoảng thời gian */
  let duration = formatDistanceStrict(new Date(now_date), new Date(next_date), {
    locale: viLocale,
  })

  return duration
}
</script>
