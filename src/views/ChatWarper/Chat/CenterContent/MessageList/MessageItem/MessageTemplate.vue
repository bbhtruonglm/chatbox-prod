<template>
  <div class="rounded-lg p-2 gap-2.5 flex flex-col max-w-[300px] flex-shrink-0">
    <div
      v-if="isHaveFileAttachment() || data_source?.is_ai"
      class="flex justify-between gap-2"
    >
      <div
        v-if="isHaveFileAttachment()"
        class="gap-2.5 flex flex-col"
      >
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
      <button
        v-if="data_source?.is_ai"
        @click="is_expanded = !is_expanded"
        class="flex-shrink-0 bg-slate-200 rounded-lg w-7 h-7 flex items-center justify-center"
      >
        <template v-if="!is_expanded">
          <ArrowRightIcon class="w-3 h-3 flex-shrink-0" />
          <span class="font-medium text-sm">A</span>
        </template>
        <ArrowDownIcon
          v-else
          class="w-4 h-4 rotate-180"
        />
      </button>
    </div>
    <div
      v-if="data_source?.title && is_expanded"
      class="text-sm font-semibold enter-line"
    >
      {{ data_source?.title }}
    </div>
    <div
      v-if="data_source?.content && is_expanded"
      class="text-sm enter-line"
    >
      {{ data_source?.content }}
    </div>
    <div
      v-if="data_source?.list_button?.length"
      class="flex flex-col gap-1"
    >
      <template v-for="button of data_source?.list_button">
        <button
          v-if="button.type"
          :class="
            isAction(button)
              ? 'bg-slate-800 text-yellow-200'
              : 'bg-slate-600 text-slate-100 cursor-not-allowed'
          "
          class="py-2 px-4 flex justify-center items-center gap-1 rounded-lg"
        >
          {{ genBtnTitle(button) }}
          <NewTabIcon
            v-if="isAction(button)"
            class="w-4 h-4"
          />
        </button>
      </template>
    </div>
  </div>
</template>
<script setup lang="ts">
import { last } from 'lodash'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

import NewTabIcon from '@/components/Icons/NewTab.vue'
import ArrowDownIcon from '@/components/Icons/ArrowDown.vue'
import ArrowRightIcon from '@/components/Icons/ArrowRight.vue'
import DocumentIcon from '@/components/Icons/Document.vue'

import type {
  MessageTemplateButton,
  MessageTemplateInput,
} from '@/service/interface/app/message'

const $props = withDefaults(
  defineProps<{
    data_source?: MessageTemplateInput
  }>(),
  {}
)

const { t: $t } = useI18n()

/**
 * có hiển thị content không
 * - nếu có cờ AI thì tự động không hiển thị
 * - nếu không có AI thì luôn hiển thị
 */
const is_expanded = ref(!$props.data_source?.is_ai)

/**kiểm tra xem tin nhắn có đính kèm file không */
function isHaveFileAttachment() {
  return Boolean(
    $props.data_source?.image?.url ||
      $props.data_source?.video?.url ||
      $props.data_source?.audio?.url ||
      $props.data_source?.file?.url
  )
}
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
/**tạo ra tiêu đề cho nút */
function genBtnTitle(button: MessageTemplateButton) {
  // nếu có title thì trả về title
  if (button?.title) return button?.title

  // xử lý trường hợp BBH tự thêm hành động nút
  switch (button?.type) {
    case 'bbh_place_order':
      return $t('v1.view.main.dashboard.chat.message.cta.place_order')
    case 'bbh_create_transaction':
      return $t('v1.view.main.dashboard.chat.message.cta.create_transaction')
    case 'bbh_schedule_appointment':
      return $t('v1.view.main.dashboard.chat.message.cta.schedule_appointment')
    default:
      return ''
  }
}
/**kiểm tra xem button có bấm được không */
function isAction(button: MessageTemplateButton) {
  // nếu có url thì mở được tab mới
  if (button.url) return true

  // nếu có prefix bbh thì là AI
  if (button.type?.includes('bbh_')) return true

  // mặc định không bấm được
  return false
}
</script>
<style lang="scss" scoped>
.attachment-size {
  @apply max-h-40 w-fit;
}
.enter-line {
  @apply break-words whitespace-pre-line;
}
</style>
