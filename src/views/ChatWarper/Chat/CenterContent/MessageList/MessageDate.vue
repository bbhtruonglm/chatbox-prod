<template>
  <div
    class="text-xs text-white bg-black/60 absolute group-hover:block hidden w-max z-10 py-1 px-2 rounded-md"
  >
    <span
      v-if="info"
      class="mr-2"
      >{{ info }}:</span
    >
    <span v-if="time">{{
      format_date(new Date(time), 'HH:mm:ss, dd/MM/yyyy')
    }}</span>
    <span
      v-if="after"
      class="ml-2"
      >{{ after }}</span
    >
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
    /**dữ liệu hiển thị thêm, vd tên nv gửi tin nhắn */
    after?: string
  }>(),
  {}
)
</script>
