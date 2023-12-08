<template>
    <div :class="{
        'justify-end': type === 'PAGE'
    }" class="flex flex-wrap mt-[1px] relative z-1">
        <template v-if="isMobile()" v-for="(attachment, index) of message_attachments">
            <div v-if="attachment.type !== 'fallback'" @click="viewAttachment(getFile(index))"
                class="rounded-lg bg-slate-200 w-[84px] h-[84px] mr-[1px] mb-[1px] overflow-hidden cursor-pointer hover:opacity-50">
                <ImageAttachment v-if="getTypeFromIndex(index) === 'image'" :url="getFileUrl(index)" />
                <VideoAttachment v-else-if="getTypeFromIndex(index) === 'video'" :url="getFileUrl(index)" />
                <AudioAttachment v-else-if="getTypeFromIndex(index) === 'audio'" :url="getFileUrl(index)" />
                <AnotherAttachment v-else :url="getFileUrl(index)" />
            </div>
        </template>
        <template v-else>
            <template v-for="(attachment) of horizontal_attachment_list">
                <div v-if="attachment.type !== 'fallback'" @click="viewAttachment(getFile(attachment.index))"
                    class="rounded-lg bg-slate-200 w-[84px] h-[84px] mr-[1px] mb-[1px] overflow-hidden cursor-pointer hover:opacity-50">
                    <ImageAttachment v-if="getTypeFromIndex(attachment.index) === 'image'"
                        :url="getFileUrl(attachment.index)" />
                    <AnotherAttachment v-else :url="getFileUrl(attachment.index)" />
                </div>
            </template>
            <template v-for="(attachment) of vertical_attachment_list">
                <div class="mt-[1px] w-full h-full flex justify-end">
                    <div class="rounded-lg overflow-hidden w-[200px] h-[120px]"
                        v-if="getTypeFromIndex(attachment.index) === 'video'">
                        <VideoAttachment :url="getFileUrl(attachment.index)" />
                    </div>
                    <div class="w-[300px] h-[50px]" v-else-if="getTypeFromIndex(attachment.index) === 'audio'">
                        <AudioAttachment :url="getFileUrl(attachment.index)" />
                    </div>
                </div>
            </template>
        </template>
    </div>
</template>
<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { useMessageStore } from '@/stores'
import { size } from 'lodash'
import { get_url_attachment } from '@/service/api/chatbox/n6-static'
import { ref } from 'vue'
import { isMobile } from '@/service/function'

import ImageAttachment from '@/views/Main/Dashboard/Chat/CenterContent/MessageList/AttachmentMessage/ImageAttachment.vue'
import VideoAttachment from '@/views/Main/Dashboard/Chat/CenterContent/MessageList/AttachmentMessage/VideoAttachment.vue'
import AudioAttachment from '@/views/Main/Dashboard/Chat/CenterContent/MessageList/AttachmentMessage/AudioAttachment.vue'
import AnotherAttachment from '@/views/Main/Dashboard/Chat/CenterContent/MessageList/AttachmentMessage/AnotherAttachment.vue'

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

/**các kiểu dữ liệu hiện kiểu khác */
const SHOW_TYPE: any[] = ['video', 'audio']
/**các tập tin sẽ hiển thị dạng đứng */
const vertical_attachment_list = ref<AttachmentInfo[]>([])
/**các tập tin hiển thị dạng dọc */
const horizontal_attachment_list = ref<AttachmentInfo[]>([])

watch(() => $props.message_attachments, () => getAttachmentInfo())

onMounted(() => getAttachmentInfo())

/**lấy link fb của file */
function getFileUrl(index?: number) {
    if (index === undefined) return ''

    return getAttachmentFromStore()?.[index]?.payload?.url
}
/**lấy dữ liệu của file */
function getFile(index?: number) {
    if (index === undefined) return {}

    return getAttachmentFromStore()?.[index]
}
/**đọc kiểu của tập tin */
function getTypeFromIndex(index?: number) {
    if (index === undefined) return ''

    return getAttachmentFromStore()?.[index]?.type
}
/**đọc dữ liệu của tập tin */
function getAttachmentFromStore() {
    const TARGET_ID = $props.message_mid as string

    if (!TARGET_ID) return []

    return messageStore.attachment_list?.[TARGET_ID] || []
}
/**đọc dữ liệu của file để hiển thị */
function getAttachmentInfo() {
    if (!size($props.message_attachments)) return

    // trên pc sẽ chia file thành 2 dạng hiển thị ngang và dọc
    if (!isMobile()) {
        vertical_attachment_list.value = []
        horizontal_attachment_list.value = []

        $props.message_attachments.forEach((attachment, index) => {
            // thêm index vào để mapping với dữ liệu lấy từ sv về
            attachment.index = index

            // dạng dọc
            if (SHOW_TYPE.includes(attachment.type))
                vertical_attachment_list.value.push(attachment)
            // dạng ngang
            else
                horizontal_attachment_list.value.push(attachment)
        })
    }

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