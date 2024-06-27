<template>
  <div
    class="text-[10px] text-slate-500 absolute group-hover:block hidden w-max z-10 -top-3.5"
  >
    <span
      v-if="info"
      class="mr-1"
    >
      <span class="font-semibold">{{ info }}</span>
      {{ $t('v1.view.main.dashboard.chat.message.sent') }}
    </span>
    <span v-if="time">
      {{ format_date(new Date(time), 'HH:mm:ss, dd/MM/yyyy') }}
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
  }>(),
  {}
)
</script>
