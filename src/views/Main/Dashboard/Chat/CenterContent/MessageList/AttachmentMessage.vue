<template>
    <div :class="{
        'justify-end': type === 'PAGE'
    }" class="flex flex-wrap">
        <div v-for="(attachment, index) of message_attachments" @click="viewAttachment(getAttachmentFromStore()?.[index])"
            class="rounded-lg bg-slate-200 w-[84px] h-[84px] mr-[1px] mb-[1px] overflow-hidden">
            <ImageAttachment v-if="getAttachmentFromStore()?.[index]?.type === 'image'"
                :url="getAttachmentFromStore()?.[index]?.payload?.url" />
        </div>
    </div>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useMessageStore } from '@/stores'
import { size } from 'lodash'
import { get_url_attachment } from '@/service/api/chatbox/n6-static'

import ImageAttachment from '@/views/Main/Dashboard/Chat/CenterContent/MessageList/AttachmentMessage/ImageAttachment.vue'

import type { AttachmentInfo } from '@/service/interface/app/message'

const $props = withDefaults(defineProps<{
    /**mảng các tập tin của tin nhắn này */
    message_attachments: AttachmentInfo[]
    /**id tin nhắn của nền tảng gốc */
    message_mid?: string
    /**id trang */
    page_id: string
    /**được gửi từ đâu */
    type: 'CLIENT' | 'PAGE'
}>(), {})

const messageStore = useMessageStore()

onMounted(() => getAttachmentInfo())

function getAttachmentFromStore() {
    const TARGET_ID = $props.message_mid as string

    if (!TARGET_ID) return []

    return messageStore.attachment_list?.[TARGET_ID] || []
}
/**đọc dữ liệu của file để hiển thị */
function getAttachmentInfo() {
    if (!size($props.message_attachments)) return

    const TARGET_ID = $props.message_mid as string

    if (!TARGET_ID) return

    if (size(getAttachmentFromStore())) return

    get_url_attachment({
        target_id: TARGET_ID,
        type: 'MESSAGE',
        page_id: $props.page_id
    }, (e, r) => {
        if (e || !r) return

        // nạp, cache dữ liệu
        messageStore.attachment_list[TARGET_ID] = r
    })
}
/**xem chi tiết file này */
function viewAttachment(attachment?: AttachmentInfo) {
    if (!attachment) return

    messageStore.select_attachment = attachment
}
</script>