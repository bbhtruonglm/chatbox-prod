<template>
    <div v-if="isShowTimeSplit()" class="my-2 text-center">
        <div class="text-[10px] text-slate-500">
            {{ formatDate() }}
        </div>
    </div>
</template>
<script setup lang="ts">
import { format as date_format, isSameDay } from 'date-fns'

import type { MessageInfo } from '@/service/interface/app/message'

const $props = withDefaults(defineProps<{
    /**dữ liệu tin nhắn trước đó */
    before_message?: MessageInfo
    /**dữ liệu tin nhắn hiện tại */
    now_message: MessageInfo
}>(), {})

/**xử lý lại kiểu thời gian */
function formatDate() {
    let date = $props.now_message.time || $props.now_message.createdAt

    return date_format(new Date(date), 'HH:mm, dd/MM/yyyy')
}
/**chỉ hiện thị khi cách ngày */
function isShowTimeSplit() {
    /**thời gian của tin nhắn hiện tại */
    let now_date = $props.now_message.time || $props.now_message.createdAt
    /**thời gian của tin nhắn trước đó */
    let before_date = $props.before_message?.time || $props.before_message?.createdAt

    // nếu trước đó không có tin nhắn thì thôi
    if (!before_date || !now_date) return false

    // nếu cùng ngày thì thôi
    if (isSameDay(new Date(now_date), new Date(before_date))) return false

    return true
}
</script>