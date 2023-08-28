<template>
    <div class="mb-[1px] flex flex-col items-center">
        <div class="text-xs text-center bg-slate-100 text-slate-400 rounded-lg p-1 w-[70%]">
            {{ $t('v1.common.unsupport_message') }}
        </div>
        <MessageDate :time="time" />
    </div>
</template>
<script setup lang="ts">
import MessageDate from '@/views/Main/Dashboard/Chat/CenterContent/MessageList/MessageDate.vue'

const $props = withDefaults(defineProps<{
    /**thời gian của tin nhắn */
    time: string
}>(), {})
</script>