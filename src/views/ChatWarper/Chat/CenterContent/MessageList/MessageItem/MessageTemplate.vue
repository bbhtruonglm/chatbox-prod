<template>
  <div
    class="rounded-lg p-2 gap-2.5 flex flex-col max-w-[300px] flex-shrink-0 justify-between"
  >
    <div
      v-if="isHaveFileAttachment() || data_source?.is_ai"
      class="flex justify-between gap-2"
    >
      <Media
        v-if="isHaveFileAttachment()"
        :data_source
      />
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
          class="w-3.5 h-3.5 rotate-180"
        />
      </button>
    </div>
    <div
      v-if="(data_source?.title || data_source?.content) && is_expanded"
      class="text-sm"
    >
      <div
        v-if="data_source?.title"
        class="font-semibold enter-line"
      >
        {{ data_source?.title }}
      </div>
      <div
        v-if="data_source?.content"
        class="enter-line"
      >
        {{ data_source?.content }}
      </div>
    </div>
    <Action
      v-if="data_source?.list_button?.length"
      :list_button="data_source?.list_button"
    />
  </div>
</template>
<script setup lang="ts">
import { ref, watch } from 'vue'

import Media from '@/views/ChatWarper/Chat/CenterContent/MessageList/MessageItem/MessageTemplate/Media.vue'
import Action from '@/views/ChatWarper/Chat/CenterContent/MessageList/MessageItem/MessageTemplate/Action.vue'

import ArrowDownIcon from '@/components/Icons/ArrowDown.vue'
import ArrowRightIcon from '@/components/Icons/ArrowRight.vue'

import type { MessageTemplateInput } from '@/service/interface/app/message'

const $props = withDefaults(
  defineProps<{
    data_source?: MessageTemplateInput
  }>(),
  {}
)

/**
 * có hiển thị content không
 * - nếu có cờ AI thì tự động không hiển thị
 * - nếu không có AI thì luôn hiển thị
 */
const is_expanded = ref(!$props.data_source?.is_ai)

// theo dõi nếu cờ AI
watch(
  () => $props.data_source?.is_ai,
  is_ai => {
    // -> true: tức là tin nhắn mới được xử lý AI -> đóng content
    if (is_ai) is_expanded.value = false
  }
)

/**kiểm tra xem tin nhắn có đính kèm file không */
function isHaveFileAttachment() {
  return Boolean(
    $props.data_source?.image?.url ||
      $props.data_source?.video?.url ||
      $props.data_source?.audio?.url ||
      $props.data_source?.file?.url
  )
}
</script>
<style lang="scss" scoped>
.enter-line {
  @apply break-words whitespace-pre-line;
}
</style>
