<template>
  <div class="overflow-hidden flex justify-center flex-grow min-h-0">
    <img
      v-if="data_source?.image?.url"
      :src="url || data_source?.image?.url"
      class="attachment-size"
    />
    <video
      v-if="data_source?.video?.url"
      class="attachment-size"
      controls
      preload="metadata"
    >
      <source
        :src="url || data_source?.video?.url"
        type="video/mp4"
      />
    </video>
    <Audio
      v-if="data_source?.audio?.url && url"
      :src="url || data_source?.audio?.url"
      class="w-full p-3"
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
</template>
<script setup lang="ts">
import { getFileName } from '@/service/helper/queryString'

import type { MessageTemplateInput } from '@/service/interface/app/message'

const $props = withDefaults(
  defineProps<{
    data_source?: MessageTemplateInput
    /**link media */
    url?: string
  }>(),
  {}
)
</script>
<style lang="scss" scoped>
.attachment-size {
  @apply h-full object-contain rounded-lg;
}
</style>
