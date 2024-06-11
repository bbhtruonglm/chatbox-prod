<template>
  <div
    :class="{
      'justify-end': type === 'PAGE',
    }"
    class="flex flex-wrap mt-[1px] relative z-1"
  >
    <template v-for="attachment of horizontal_attachment_list">
      <div
        v-if="attachment.type !== 'fallback'"
        @click="viewAttachment(getFile(attachment.index))"
        :class="
        // bắt buộc phải fix cứng độ cao nếu không giao diện sẽ bị giật, vì infinity scroll tính sai vị trí
        // nếu chỉ có 1 ảnh thì tăng độ cao để hiển thị to hơn
        // nếu có nhiều ảnh thì giảm độ cao để hiển thị được nhiều ảnh cùng lúc hơn
        // kích thước chiều rộng để auto, tự động co kéo theo chiều ngang
        // để kích thước chiều rộng auto có thể gây giật với một bộ các ảnh, vì trước khi hình ảnh render thì widget = 1, render xong with dài hơn đẩy hình ảnh xuống, làm tăng chiều dài tổng thể của trang
          horizontal_attachment_list?.length === 1 ? 'h-[168px]' : 'h-[84px]'
        "
        class="rounded-lg bg-slate-200 shadow mr-[1px] mb-[1px] overflow-hidden cursor-pointer hover:opacity-50"
      >
        <ImageAttachment
          v-if="getTypeFromIndex(attachment.index) === 'image'"
          :url="getFileUrl(attachment.index)"
        />
        <AnotherAttachment
          v-else
          :url="getFileUrl(attachment.index)"
        />
      </div>
    </template>
    <template v-for="attachment of vertical_attachment_list">
      <div class="mt-[1px] w-full h-full flex justify-end">
        <div
          class="rounded-lg overflow-hidden w-[200px] h-[120px]"
          v-if="getTypeFromIndex(attachment.index) === 'video'"
        >
          <VideoAttachment :url="getFileUrl(attachment.index)" />
        </div>
        <div
          class="w-[300px] h-[50px]"
          v-else-if="getTypeFromIndex(attachment.index) === 'audio'"
        >
          <AudioAttachment :url="getFileUrl(attachment.index)" />
        </div>
      </div>
    </template>
  </div>
</template>
<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { useMessageStore } from '@/stores'
import { size } from 'lodash'
import { get_url_attachment } from '@/service/api/chatbox/n6-static'
import { ref } from 'vue'

import ImageAttachment from '@/views/Main/Dashboard/Chat/CenterContent/MessageList/AttachmentMessage/ImageAttachment.vue'
import VideoAttachment from '@/views/Main/Dashboard/Chat/CenterContent/MessageList/AttachmentMessage/VideoAttachment.vue'
import AudioAttachment from '@/views/Main/Dashboard/Chat/CenterContent/MessageList/AttachmentMessage/AudioAttachment.vue'
import AnotherAttachment from '@/views/Main/Dashboard/Chat/CenterContent/MessageList/AttachmentMessage/AnotherAttachment.vue'

import type {
  AttachmentInfo,
  MessageInfo,
} from '@/service/interface/app/message'

const $props = withDefaults(
  defineProps<{
    /**mảng các tập tin của tin nhắn này */
    message_attachments: AttachmentInfo[]
    /**id tin nhắn của nền tảng gốc */
    message_mid?: string
    /**id trang */
    page_id: string
    /**được gửi từ đâu */
    type: 'CLIENT' | 'PAGE'
    /**loại nền tảng của tin nhắn */
    platform_type: MessageInfo['platform_type']
    /**có phải là tin nhắn trả lời không */
    is_reply?: boolean
  }>(),
  {}
)

const messageStore = useMessageStore()

/**các kiểu dữ liệu hiện kiểu khác */
const SHOW_TYPE: any[] = ['video', 'audio']
/**các tập tin sẽ hiển thị dạng đứng */
const vertical_attachment_list = ref<AttachmentInfo[]>([])
/**các tập tin hiển thị dạng dọc */
const horizontal_attachment_list = ref<AttachmentInfo[]>([])

watch(
  () => $props.message_attachments,
  () => getAttachmentInfo()
)

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
  // hình ảnh của nền tảng khác FB không cần xử lý lấy link mới nhất
  if ($props.platform_type !== 'FB_MESS') {
    // thêm index vào để mapping với dữ liệu
    let list_att = $props.message_attachments?.map((attr, index) => ({
      ...attr,
      index,
    }))

    // luôn luôn hiển thị dọc
    horizontal_attachment_list.value = list_att

    // nạp thông tin att vào store
    messageStore.attachment_list[$props.message_mid as string] = list_att

    return
  }

  // xử lý hình ảnh cho riêng FB

  // không có file thì không cần xử lý
  if (!size($props.message_attachments)) return

  // chia file thành 2 dạng hiển thị ngang và dọc

  // xóa dữ liệu cũ nếu có
  vertical_attachment_list.value = []
  horizontal_attachment_list.value = []

  // duyệt qua từng file
  $props.message_attachments.forEach((attachment, index) => {
    // thêm index vào để mapping với dữ liệu lấy từ sv về
    attachment.index = index

    // dạng dọc thì hiển thị tất cả
    if (SHOW_TYPE.includes(attachment.type))
      return vertical_attachment_list.value.push(attachment)

    // dạng ngang

    // nếu là tin nhắn trả lời thì chỉ hiển thị 1 file đầu tiên
    // if ($props.is_reply && index > 0) return

    // nếu không phải tin nhắn trả lời thì hiển thị tất cả
    horizontal_attachment_list.value.push(attachment)
  })

  if (size(getAttachmentFromStore())) return

  const TARGET_ID = $props.message_mid as string

  if (!TARGET_ID) return

  get_url_attachment(
    {
      target_id: TARGET_ID,
      type: 'MESSAGE',
      page_id: $props.page_id,
    },
    (e, r) => {
      if (e || !r) return

      // nạp, cache dữ liệu
      messageStore.attachment_list[TARGET_ID] = r
    }
  )
}
/**xem chi tiết file này */
function viewAttachment(attachment?: AttachmentInfo) {
  if (!attachment) return

  messageStore.select_attachment = attachment
}
</script>
