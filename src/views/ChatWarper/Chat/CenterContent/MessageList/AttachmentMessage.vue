<template>
  <div
    :class="{ 'justify-end': type === 'PAGE' }"
    class="p-2 bg-white rounded-lg flex flex-col gap-2"
  >
    <div class="flex gap-2 justify-between">
      <div class="flex flex-wrap relative z-1 gap-2">
        <template v-for="(attachment, index) of horizontal_attachment_list">
          <div
            @click="viewAttachment(attachment.index, getFile(attachment.index))"
            class="cursor-pointer hover:brightness-90 rounded-lg bg-gray-50 overflow-hidden"
            :style="
              initSize(
                message?.attachment_size?.[index]?.width,
                message?.attachment_size?.[index]?.height
              )
            "
          >
            <img
              v-if="getFileUrl(attachment.index)"
              :src="getFileUrl(attachment.index)"
              class="object-contain w-full h-full"
            />
          </div>
        </template>
      </div>
    </div>
  </div>
  <MediaDetail
    ref="media_detail_ref"
    :data_source
  />
</template>
<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { useMessageStore } from '@/stores'
import { size } from 'lodash'
import { get_url_attachment } from '@/service/api/chatbox/n6-static'
import { ref } from 'vue'

import MediaDetail from '@/views/ChatWarper/Chat/CenterContent/MessageList/MessageItem/MediaDetail.vue'

import type {
  AttachmentInfo,
  MessageInfo,
  MessageTemplateInput,
} from '@/service/interface/app/message'
import { FitSize } from '@/utils/helper/Attachment'

const $props = withDefaults(
  defineProps<{
    /**dữ liệu của tin nhắn */
    message: MessageInfo
    /**được gửi từ đâu */
    type: 'CLIENT' | 'PAGE'
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
/**ref của component MediaDetail */
const media_detail_ref = ref<InstanceType<typeof MediaDetail>>()
/**dữ liệu của tin nhắn đã được format sang dạng mới */
const data_source = ref<MessageTemplateInput>({})

watch(
  () => $props.message?.message_attachments,
  () => getAttachmentInfo()
)

onMounted(() => getAttachmentInfo())

/**lấy link fb của file */
function getFileUrl(index?: number) {
  // nếu không có index thì không cần xử lý
  if (index === undefined) return ''

  return getAttachmentFromStore()?.[index]?.payload?.url
}
/**lấy dữ liệu của file */
function getFile(index?: number) {
  if (index === undefined) return {}

  return getAttachmentFromStore()?.[index]
}
/**đọc dữ liệu của tập tin */
function getAttachmentFromStore() {
  const TARGET_ID = $props.message?.message_mid

  if (!TARGET_ID) return []

  return messageStore.attachment_list?.[TARGET_ID] || []
}
/**đọc dữ liệu của file để hiển thị */
function getAttachmentInfo() {
  // hình ảnh của nền tảng khác FB không cần xử lý lấy link mới nhất
  if ($props.message?.platform_type !== 'FB_MESS') {
    // thêm index vào để mapping với dữ liệu
    let list_att =
      $props.message?.message_attachments?.map((attr, index) => ({
        ...attr,
        index,
      })) || []

    // luôn luôn hiển thị dọc
    horizontal_attachment_list.value = list_att

    // nạp thông tin att vào store
    messageStore.attachment_list[$props.message?.message_mid || ''] = list_att

    return
  }

  // xử lý hình ảnh cho riêng FB

  // không có file thì không cần xử lý
  if (!size($props.message?.message_attachments)) return

  // chia file thành 2 dạng hiển thị ngang và dọc

  // xóa dữ liệu cũ nếu có
  vertical_attachment_list.value = []
  horizontal_attachment_list.value = []

  // duyệt qua từng file
  $props.message?.message_attachments?.forEach((attachment, index) => {
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

  const TARGET_ID = $props.message?.message_mid

  if (!TARGET_ID) return

  get_url_attachment(
    {
      target_id: TARGET_ID,
      type: 'MESSAGE',
      page_id: $props.message?.fb_page_id,
    },
    (e, r) => {
      if (e || !r) return

      // nạp, cache dữ liệu
      messageStore.attachment_list[TARGET_ID] = r
    }
  )
}
/**xem chi tiết file này */
function viewAttachment(index: number = 0, attachment?: AttachmentInfo) {
  if (!attachment) return

  // tạm thời xử lý data để hiện CTA
  data_source.value = {
    image: {
      url: attachment?.payload?.url,
    },
    content: $props.message?.ai?.[index]?.ocr,
    list_button:
      $props.message?.message_attachments?.[index]?.payload?.elements?.[0]
        ?.buttons,
  }

  // mở modal
  media_detail_ref.value?.toggleModal()
}
/**tạo ra kích thước cho phần từ trước khi hình ảnh, video được load */
function initSize(width?: number, height?: number) {
  // tính toán
  return new FitSize(368, 80, width, height).toCss()
}
</script>
