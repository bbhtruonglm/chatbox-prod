<template>
    <div class="mb-[1px]">
        <div class="text-sm break-words bg-slate-200 rounded-lg p-2 w-fit max-w-[370px]">
            {{ text }}
        </div>
        <MessageDate :time="time" />
    </div>
</template>
<script setup lang="ts">
import MessageDate from '@/views/Main/Dashboard/Chat/CenterContent/MessageList/MessageDate.vue'

const $props = withDefaults(defineProps<{
    /**nội dung tin nhắn bí mật của page */
    text: string
    /**thời gian của tin nhắn */
    time: string
}>(), {})
</script>