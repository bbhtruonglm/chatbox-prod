<template>
  <div
    id="chat__message-date"
    class="text-[10px] text-slate-500 absolute group-hover:block hidden w-max z-10 -top-3.5"
  >
    <span
      v-if="parserStaffName()"
      class="mr-1"
    >
      <span class="font-medium">{{ parserStaffName() }}</span>
      {{ $t('v1.view.main.dashboard.chat.message.sent') }}
    </span>
    <span
      v-if="time"
      class="mr-1"
    >
      {{ format_date(new Date(time), 'HH:mm:ss, dd/MM/yyyy') }}
    </span>
    <span v-if="is_edit">
      ({{ $t('v1.view.main.dashboard.chat.message.edited') }})
    </span>
    <span v-if="is_show_duration">
      {{ $t('v1.view.main.dashboard.chat.message.reply_time_basic') }}
      {{ duration }}
    </span>
  </div>
</template>
<script setup lang="ts">
import { format as format_date } from 'date-fns'

const $props = withDefaults(
  defineProps<{
    /**thời gian của tin nhắn */
    time?: string
    /**dữ liệu hiển thị thêm, vd tên nv gửi tin nhắn */
    info?: string
    /**dữ liệu đính kèm của tin nhắn */
    meta?: string
    /**tin nhắn này có phải bị sửa không */
    is_edit?: boolean
    /**số thời gian tin nhắn này được rep */
    duration?: string
    /**có hiển thị thời gian tin nhắn không */
    is_show_duration?: boolean
  }>(),
  {}
)

/**phân tích tên nv từ meta */
function parserStaffName() {
  return $props.meta?.split('__')?.[1]
}
</script>
