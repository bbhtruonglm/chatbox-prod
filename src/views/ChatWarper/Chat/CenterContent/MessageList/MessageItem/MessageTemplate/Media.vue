<template>
  <div
    @click="openMediaDetail"
    class="gap-2.5 flex flex-col cursor-pointer hover:brightness-90 rounded-lg overflow-hidden"
  >
    <div
      v-if="data_source?.image?.url"
      class="bg-gray-50"
      :style="initSize()"
    >
    <img
    :src="getFbUrl() || data_source?.image?.url"
        class="w-full h-full object-contain"
      />
    </div>
    <div
      v-if="data_source?.video?.url"
      class="bg-gray-100"
      :style="initSize()"
    >
      <video
        class="w-full h-full"
        controls
        preload="metadata"
      >
        <source
          :src="getFbUrl() || data_source?.video?.url"
          type="video/mp4"
        />
      </video>
    </div>
    <Audio
      v-if="data_source?.audio?.url"
      :src="data_source?.audio?.url"
      class="min-w-52"
    />
    <div
      v-if="data_source?.file?.url"
      class="message-box bg-white flex flex-col items-end text-slate-700"
    >
      <div class="p-2 rounded-full bg-slate-300 w-9 h-9">
        <DocumentIcon class="w-5 h-5" />
      </div>
      <div class="text-sm truncate min-w-0 w-full underline">
        {{ getFileName(data_source?.file?.url) }}
      </div>
    </div>
  </div>
  <MediaDetail
    ref="media_detail_ref"
    :data_source
  />
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { last } from 'lodash'
import { FitSize } from '@/utils/helper/Attachment'
import { useMessageStore } from '@/stores'

import MediaDetail from '@/views/ChatWarper/Chat/CenterContent/MessageList/MessageItem/MediaDetail.vue'
import Audio from '@/views/ChatWarper/Chat/CenterContent/MessageList/MessageItem/MessageTemplate/Media/Audio.vue'

import DocumentIcon from '@/components/Icons/Document.vue'

import type {
  AttachmentSize,
  MessageInfo,
  MessageTemplateInput,
} from '@/service/interface/app/message'
import { get_url_attachment } from '@/service/api/chatbox/n6-static'

const $props = withDefaults(
  defineProps<{
    /**dữ liệu tin nhắn đã được định dạng lại */
    data_source?: MessageTemplateInput
    /**kích thước của file đính kèm */
    attachment_size?: AttachmentSize
    /**dữ liệu của tin nhắn */
    message: MessageInfo
  }>(),
  {}
)

const messageStore = useMessageStore()

/**ref của component MediaDetail */
const media_detail_ref = ref<InstanceType<typeof MediaDetail>>()

// khi tin nhắn được render
onMounted(() => {
  // đọc url file mới tránh lỗi 3 tháng
  getAttachmentInfo()
})

/**lấy tên của file */
function getFileName(url: string) {
  try {
    /**Sử dụng URL API để tách phần pathname */
    const PATH = new URL(url)?.pathname

    // lấy tên file từ pathname
    return last(PATH?.split('/'))
  } catch (e) {
    return ''
  }
}
/**mở modal xem chi tiết file */
function openMediaDetail() {
  // mở modal xem chi tiết file
  media_detail_ref.value?.toggleModal()
}
/**tạo ra kích thước cho phần từ trước khi hình ảnh, video được load */
function initSize() {
  // tính toán
  return new FitSize(
    247,
    160,
    $props.attachment_size?.width,
    $props.attachment_size?.height
  ).toCss()
}
/**đọc dữ liệu mới của tập tin */
function getFbUrl(): string | undefined {
  /**lấy id của tin nhắn */
  const TARGET_ID = $props.message?.message_mid

  // nếu không có id thì không cần xử lý
  if (!TARGET_ID) return

  // trả về url của file
  return messageStore.attachment_list?.[TARGET_ID]?.[0]?.payload?.url
}
/**lấy thông tin của file đính kèm */
function getAttachmentInfo() {
  // tạm thời chỉ xử lý trường hợp 1 file, vì nhiều file đã được xử lý ở chỗ khác rồi
  if ($props.message?.message_attachments?.length !== 1) return

  // nếu không có id tin nhắn thì thôi
  if (!$props.message?.message_mid) return

  // chỉ xử lý của FB
  if ($props.message?.platform_type !== 'FB_MESS') return

  // không có file thì không cần xử lý
  if (
    !['image', 'video', 'audio'].includes(
      $props.message?.message_attachments?.[0]?.type || ''
    )
  )
    return

  // nếu đã có dữ liệu rồi thì thôi
  if (messageStore.attachment_list?.[$props.message?.message_mid]) return

  get_url_attachment(
    {
      target_id: $props.message?.message_mid,
      type: 'MESSAGE',
      page_id: $props.message?.fb_page_id,
    },
    (e, r) => {
      if (e || !r) return

      // nạp, cache dữ liệu
      messageStore.attachment_list[$props.message?.message_mid!] = r
    }
  )
}
</script>
