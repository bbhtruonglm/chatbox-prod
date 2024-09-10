<template>
  <div
    @click="openMediaDetail"
    class="gap-2.5 flex flex-col cursor-pointer hover:brightness-90 rounded-lg overflow-hidden"
  >
    <img
      v-if="data_source?.image?.url"
      :src="data_source?.image?.url"
      class="attachment-size"
    />
    <!-- <img
      v-if="data_source?.image?.url"
      :src="data_source?.image?.url"
      class="attachment-size"
    /> -->
    <video
      v-if="data_source?.video?.url"
      class="attachment-size"
      controls
      preload="metadata"
    >
      <source
        :src="data_source?.video?.url"
        type="video/mp4"
      />
    </video>
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
import { ref } from 'vue'
import { last } from 'lodash'

import MediaDetail from '@/views/ChatWarper/Chat/CenterContent/MessageList/MessageItem/MediaDetail.vue'
import Audio from '@/views/ChatWarper/Chat/CenterContent/MessageList/MessageItem/MessageTemplate/Media/Audio.vue'

import DocumentIcon from '@/components/Icons/Document.vue'

import type { MessageTemplateInput } from '@/service/interface/app/message'

const $props = withDefaults(
  defineProps<{
    data_source?: MessageTemplateInput
  }>(),
  {}
)

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
/**lấy chiều rộng của file */
function getWidth() {

}
/**lấy chiều cao của file */
function getHeight() {

}
</script>
<style lang="scss" scoped>
.attachment-size {
  @apply max-h-40 w-fit;
}
</style>
