<template>
  <Modal
    ref="media_detail_ref"
    class_modal="w-[811px] h-[630px]"
  >
    <template v-slot:header>
      {{ $t('v1.view.main.dashboard.chat.message.attachment.title') }}
    </template>
    <template v-slot:body>
      <div
        class="bg-white rounded-md p-4 gap-2 grid grid-cols-2 relative w-full h-full"
      >
        <div class="h-full overflow-hidden flex justify-center">
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
          <Audio
            v-if="data_source?.audio?.url"
            :src="data_source?.audio?.url"
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
        <div
          class="h-full overflow-hidden border rounded-lg py-2 px-3 flex flex-col gap-2.5"
        >
          <div
            class="bg-slate-100 text-xs font-medium py-1 px-2 rounded flex-shrink-0"
          >
            {{ $t('v1.view.main.dashboard.chat.message.attachment.ai_handle') }}
          </div>
          <div class="min-h-0 overflow-y-auto flex flex-col gap-2">
            <div class="text-sm enter-line">
              {{ data_source?.content }}
            </div>
            <div
              v-if="data_source?.ai?.summary"
              class="text-sm enter-line text-slate-500"
            >
              <div>-----</div>
              {{ $t('v1.view.main.dashboard.chat.message.summary') }}:
              {{ data_source?.ai?.summary }}
            </div>
          </div>
          <Action
            v-if="data_source?.list_button?.length"
            :list_button="data_source?.list_button"
          />
        </div>
      </div>
    </template>
    <template v-slot:footer>
      <div class="flex justify-between mt-2">
        <button
          @click="toggleModal()"
          class="custom-btn bg-slate-700"
        >
          {{ $t('v1.common.cancel') }}
        </button>
        <button
          @click="downloadFile"
          class="custom-btn bg-blue-700"
        >
          {{ $t('v1.common.download') }}
        </button>
      </div>
    </template>
  </Modal>
</template>
<script setup lang="ts">
import { useMessageStore } from '@/stores'
import { ref } from 'vue'
import { getFileName } from '@/service/helper/queryString'
import { openNewTab } from '@/service/function'

import Action from '@/views/ChatWarper/Chat/CenterContent/MessageList/MessageItem/MessageTemplate/Action.vue'
import Modal from '@/components/Modal.vue'
import Audio from '@/views/ChatWarper/Chat/CenterContent/MessageList/MessageItem/MessageTemplate/Media/Audio.vue'

import DocumentIcon from '@/components/Icons/Document.vue'

import type { MessageTemplateInput } from '@/service/interface/app/message'
import type { ComponentRef } from '@/service/interface/vue'

const $props = withDefaults(
  defineProps<{
    data_source?: MessageTemplateInput
  }>(),
  {}
)

const messageStore = useMessageStore()

/**ref của modal xem chi tiết file */
const media_detail_ref = ref<ComponentRef>()

/**mở modal xem chi tiết file */
function toggleModal() {
  media_detail_ref.value?.toggleModal()
}
/**tải về tập tin */
function downloadFile() {
  const URL = messageStore.select_attachment?.payload?.url

  if (!URL) return

  openNewTab(URL)
}

defineExpose({ toggleModal })
</script>
<style lang="scss" scoped>
.attachment-size {
  @apply h-full object-contain;
}
.custom-btn {
  @apply py-2 px-5 flex items-center gap-1 rounded-lg text-white text-sm hover:brightness-90;
}
</style>
