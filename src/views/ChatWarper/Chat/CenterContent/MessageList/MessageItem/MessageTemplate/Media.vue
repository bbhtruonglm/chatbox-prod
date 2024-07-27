<template>
  <div class="gap-2.5 flex flex-col">
    <img
      v-if="data_source?.image?.url"
      :src="data_source?.image?.url"
      class="attachment-size"
    />
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
    <audio
      v-if="data_source?.audio?.url"
      class="w-full min-w-52"
      controls
      preload="metadata"
    >
      <source
        :src="data_source?.audio?.url"
        type="audio/mpeg"
      />
    </audio>
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
</template>
<script setup lang="ts">
import { last } from 'lodash'

import DocumentIcon from '@/components/Icons/Document.vue'

import type { MessageTemplateInput } from '@/service/interface/app/message'

const $props = withDefaults(
  defineProps<{
    data_source?: MessageTemplateInput
  }>(),
  {}
)

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
</script>
<style lang="scss" scoped>
.attachment-size {
  @apply max-h-40 w-fit;
}
</style>
