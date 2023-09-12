<template>
    <div :class="{
        'justify-end': type === 'PAGE'
    }" class="flex flex-wrap">
        <div v-for="(attachment, index) of message_attachments"
            class="rounded-lg bg-slate-200 w-[84px] h-[84px] mr-[1px] mb-[1px] overflow-hidden">
            <ImageAttachment v-if="attachement_info?.[index]?.type === 'image'" :url="attachement_info?.[index]?.payload?.url" />
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

/**danh sách dữ liệu file của tin nhắn này */
const attachement_info = ref<AttachmentInfo[]>([])

onMounted(() => getAttachmentInfo())

/**đọc dữ liệu của file để hiển thị */
function getAttachmentInfo() {
    const TARGET_ID = $props.message_mid as string

    if (!TARGET_ID) return

    // lấy dữ liệu file từ trong cache
    attachement_info.value = messageStore.attachment_list?.[TARGET_ID] || []

    if (size(attachement_info.value)) return

    get_url_attachment({
        target_id: TARGET_ID,
        type: 'MESSAGE',
        page_id: $props.page_id
    }, (e, r) => {
        if (e || !r) return

        // nạp dữ liệu
        attachement_info.value = r

        // cache dữ liệu
        messageStore.attachment_list[TARGET_ID] = r
    })
}
</script>