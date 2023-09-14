<template>
    <div :class="{
        'justify-end': type === 'PAGE'
    }" class="flex flex-wrap">
        <div v-for="(attachment, index) of message_attachments" @click="viewAttachment(getAttachmentFromStore()?.[index])"
            class="rounded-lg bg-slate-200 w-[84px] h-[84px] mr-[1px] mb-[1px] overflow-hidden cursor-pointer hover:opacity-50">
            <ImageAttachment v-if="getAttachmentFromStore()?.[index]?.type === 'image'"
                :url="getAttachmentFromStore()?.[index]?.payload?.url" />
            <VideoAttachment v-if="getAttachmentFromStore()?.[index]?.type === 'video'"
                :url="getAttachmentFromStore()?.[index]?.payload?.url" />
        </div>
    </div>
</template>
<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { useMessageStore } from '@/stores'
import { size } from 'lodash'
import { get_url_attachment } from '@/service/api/chatbox/n6-static'

import ImageAttachment from '@/views/Main/Dashboard/Chat/CenterContent/MessageList/AttachmentMessage/ImageAttachment.vue'
import VideoAttachment from '@/views/Main/Dashboard/Chat/CenterContent/MessageList/AttachmentMessage/VideoAttachment.vue'

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

watch(() => $props.message_attachments, () => getAttachmentInfo())

onMounted(() => getAttachmentInfo())

/**đọc dữ liệu của tập tin */
function getAttachmentFromStore() {
    const TARGET_ID = $props.message_mid as string

    if (!TARGET_ID) return []

    return messageStore.attachment_list?.[TARGET_ID] || []
}
/**đọc dữ liệu của file để hiển thị */
function getAttachmentInfo() {
    if (!size($props.message_attachments)) return

    if (size(getAttachmentFromStore())) return

    const TARGET_ID = $props.message_mid as string

    if (!TARGET_ID) return

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