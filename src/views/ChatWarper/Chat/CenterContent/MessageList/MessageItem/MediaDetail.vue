<template>
  <Modal
    id="chat__view-attachment"
    ref="media_detail_ref"
    class_modal="w-[900px] h-4/5"
  >
    <template v-slot:header>
      {{ $t('v1.view.main.dashboard.chat.message.attachment.title') }}
    </template>
    <template v-slot:body>
      <div
        class="bg-white rounded-md p-2 gap-3 grid grid-cols-2 relative w-full h-full"
      >
        <div class="flex flex-col gap-5 overflow-hidden">
          <Item
            :data_source
            :url
          />

          <!-- <div class="overflow-hidden flex justify-center flex-grow min-h-0">
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
          </div> -->
          <!-- h-[132px] -->

          <div class="flex-shrink-0 flex gap-1.5 h-[46px] items-center">
            <div
              class="flex flex-wrap justify-start gap-1.5 overflow-hidden h-full pt-[3px] px-[3px]"
            >
            <!-- fake-border-3-blue-700 -->
              <button
                v-for="attachment of message?.message_attachments"
                class="w-10 h-10 rounded-lg bg-slate-100 "
              >
                <Item
                  :data_source
                  :url="attachment?.payload?.url"
                />
              </button>
            </div>
            <button
              class="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 flex-shrink-0 flex justify-center items-center text-sm font-medium"
            >
              +31
            </button>
          </div>
        </div>
        <div
          class="h-full overflow-hidden border rounded-lg py-2 px-3 flex flex-col gap-2.5 text-sm"
        >
          <div
            class="bg-slate-200 text-xs font-medium py-1 px-2 rounded flex-shrink-0"
          >
            {{ $t('v1.view.main.dashboard.chat.message.attachment.ai_handle') }}
          </div>
          <div class="min-h-0 overflow-y-auto flex flex-col gap-0 enter-line">
            <div
              v-if="data_source?.ocr?.description"
              class="font-medium"
            >
              {{ $t('v1.view.main.dashboard.chat.message.summary') }}:
              {{ data_source?.ocr?.description }}
              <div>---------</div>
            </div>
            <div>
              {{ data_source?.ocr?.original_text }}
            </div>
          </div>
          <button
            @click="$clipboard.copy(data_source?.ocr?.original_text)"
            class="py-2 px-4 rounded-md text-white bg-slate-700 w-fit"
          >
            {{
              $t('v1.view.main.dashboard.chat.message.attachment.copy_content')
            }}
          </button>
          <Action
            v-if="data_source?.list_button?.length"
            :list_button="data_source?.list_button"
            :message_id
          />
        </div>
      </div>
    </template>
    <template v-slot:footer>
      <div class="flex justify-between mt-2">
        <button
          @click="toggleModal()"
          class="custom-btn bg-white text-slate-700"
        >
          {{ $t('v1.common.close') }}
        </button>
        <button
          @click="downloadFile"
          class="custom-btn text-white bg-blue-700"
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
import { container } from 'tsyringe'
import { Clipboard } from '@/utils/helper/Clipboard'

import Item from '@/views/ChatWarper/Chat/CenterContent/MessageList/MessageItem/MediaDetail/Item.vue'
import Action from '@/views/ChatWarper/Chat/CenterContent/MessageList/MessageItem/MessageTemplate/Action.vue'
import Modal from '@/components/Modal.vue'
import Audio from '@/views/ChatWarper/Chat/CenterContent/MessageList/MessageItem/MessageTemplate/Media/Audio.vue'

import DocumentIcon from '@/components/Icons/Document.vue'

import type {
  MessageInfo,
  MessageTemplateInput,
} from '@/service/interface/app/message'
import type { ComponentRef } from '@/service/interface/vue'

const $props = withDefaults(
  defineProps<{
    data_source?: MessageTemplateInput
    /**link media */
    url?: string
    /**id của tin nhắn */
    message_id?: string
    /**dữ liệu của tin nhắn */
    message?: MessageInfo
  }>(),
  {}
)

const messageStore = useMessageStore()
const $clipboard = container.resolve(Clipboard)

/**ref của modal xem chi tiết file */
const media_detail_ref = ref<ComponentRef>()

/**mở modal xem chi tiết file */
function toggleModal() {
  media_detail_ref.value?.toggleModal()
}
/**tải về tập tin */
function downloadFile() {
  const URL = messageStore.select_attachment?.payload?.url

  // if (!URL) return

  openNewTab($props.url || URL || '')
}

defineExpose({ toggleModal })
</script>
<style lang="scss" scoped>
.custom-btn {
  @apply py-2 px-5 flex items-center gap-1 rounded-lg text-sm;
}
.fake-border-3-blue-700 {
  @apply shadow-[0_0_0_3px_rgba(29,78,216,1)];
}
</style>
