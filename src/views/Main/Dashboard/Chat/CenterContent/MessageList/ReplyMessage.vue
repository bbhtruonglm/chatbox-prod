<template>
    <div class="bg-slate-200 text-slate-500 rounded-2xl text-sm p-2 relative bottom-[-8px]">
        <template v-if="message?.message_text">
            {{ message?.message_text }}
        </template>
        <template v-else>
            {{ $t('v1.view.main.dashboard.chat.message.file') }}
            📦
        </template>
    </div>
</template>
<script setup lang="ts">
import type { MessageInfo } from '@/service/interface/app/message'

const $props = withDefaults(defineProps<{
    /**nội dung tin nhắn bí mật của page */
    message: MessageInfo
}>(), {})
</script>