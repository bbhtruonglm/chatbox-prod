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
      :src="getFbUrl() || ''"
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
    :url="getFbUrl()"
    :message_id="message?._id"
  />
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { last } from 'lodash'
import { FitSize } from '@/utils/helper/Attachment'

import MediaDetail from '@/views/ChatWarper/Chat/CenterContent/MessageList/MessageItem/MediaDetail.vue'
import Audio from '@/views/ChatWarper/Chat/CenterContent/MessageList/MessageItem/MessageTemplate/Media/Audio.vue'

import DocumentIcon from '@/components/Icons/Document.vue'

import type {
  AttachmentSize,
  MessageInfo,
  MessageTemplateInput,
} from '@/service/interface/app/message'
import { SingletonCdn } from '@/utils/helper/Cdn'

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

const $cdn = SingletonCdn.getInst()

/**ref của component MediaDetail */
const media_detail_ref = ref<InstanceType<typeof MediaDetail>>()

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
  // nếu là slider thực thì dùng luôn
  if ($props.message?.message_attachments?.[0]?.type === 'template') return

  /**lấy id của tin nhắn */
  const TARGET_ID = $props.message?.message_mid

  // nếu không có id thì không cần xử lý
  if (!TARGET_ID) return

  return $cdn.fbMessageMedia($props.message?.fb_page_id, TARGET_ID, 0)
}
</script>
