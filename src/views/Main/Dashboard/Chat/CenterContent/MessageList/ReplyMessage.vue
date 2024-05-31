<template>
    <div class="bg-slate-200 text-slate-500 rounded-2xl text-sm p-2 relative bottom-[-8px]">
        <template v-if="message?.message_text">
            {{ message?.message_text }}
        </template>
        <AttachmentMessage v-else-if="message?.message_attachments" :message_attachments="message?.message_attachments" :message_mid="message?.message_mid" 
        :is_reply="true"
        :platform_type="message?.platform_type" :page_id="message?.fb_page_id" type="CLIENT" class="justify-start" />
        <template v-else>
            {{ $t('v1.view.main.dashboard.chat.message.file') }}
            📦
        </template>
    </div>
</template>
<script setup lang="ts">
import AttachmentMessage from '@/views/Main/Dashboard/Chat/CenterContent/MessageList/AttachmentMessage.vue'

import type { MessageInfo } from '@/service/interface/app/message'

const $props = withDefaults(defineProps<{
    /**nội dung tin nhắn bí mật của page */
    message: MessageInfo
}>(), {})
</script>