<template>
  <div
    id="main_input_chat"
    :class="{
      'pr-3': isVisibleSendBtn(),
      '!rounded-xl': ai_answer || is_loading_ai_answer,
      'hover:rounded-xl': is_loading_ai_answer,
    }"
    class="flex flex-col gap-1 bg-white rounded-3xl group py-2 px-4 transition-all"
  >
    <AiAnswer v-model:is_loading="is_loading_ai_answer" />
    <div class="flex items-end">
      <div class="flex gap-2 items-end flex-grow min-w-0">
        <!-- <AiManager /> -->
        <AttachmentMenu />
        <Input
          ref="input_chat_ref"
          @keyup="quick_answer_ref?.handleChatValue"
          :class="{
            'animate-fast-pulse': messageStore.is_input_run_ai,
          }"
        />
      </div>
      <div
        v-if="isVisibleSendBtn()"
        class="w-8 h-8 cursor-pointer flex-shrink-0"
      >
        <StopIcon
          v-if="messageStore.is_input_run_ai"
          @click="messageStore.is_input_run_ai = !messageStore.is_input_run_ai"
          v-tooltip="$t('v1.view.main.dashboard.chat.action.stop_action')"
          class="w-full h-full"
        />
        <SendIcon
          v-else
          v-tooltip="$t('v1.view.main.dashboard.chat.action.send_message')"
          @click="input_chat_ref?.sendMessage"
          class="w-full h-full"
        />
      </div>
      <QuickAnswer ref="quick_answer_ref" />
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, provide, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMessageStore, useCommonStore, useConversationStore } from '@/stores'
import { IS_VISIBLE_SEND_BTN_FUNCT } from '@/views/ChatWarper/Chat/CenterContent/InputChat/symbol'

import AiAnswer from '@/views/ChatWarper/Chat/CenterContent/InputChat/MainInput/AiAnswer.vue'
import QuickAnswer from '@/views/ChatWarper/Chat/CenterContent/InputChat/MainInput/QuickAnswer.vue'
import AiManager from '@/views/ChatWarper/Chat/CenterContent/InputChat/MainInput/AiManager.vue'
import AttachmentMenu from '@/views/ChatWarper/Chat/CenterContent/InputChat/MainInput/AttachmentMenu.vue'
import Input from '@/views/ChatWarper/Chat/CenterContent/InputChat/MainInput/Input.vue'

import SendIcon from '@/components/Icons/Send.vue'
import StopIcon from '@/components/Icons/Stop.vue'

const messageStore = useMessageStore()
const commonStore = useCommonStore()
const conversationStore = useConversationStore()
const { t: $t } = useI18n()

/**ref của ô chat tin nhắn */
const input_chat_ref = ref<InstanceType<typeof Input>>()
/**ref của modal chọn câu trả lời nhanh */
const quick_answer_ref = ref<InstanceType<typeof QuickAnswer>>()

/**có đang tạo câu trả lời không */
const is_loading_ai_answer = ref<boolean>(false)
/**hội thoại hiện tại đang dược chọn */
const conversation = computed(() => conversationStore.select_conversation)
/**câu trả lời hiện tại */
const ai_answer = computed(() => conversation.value?.ai_answer)

/**có hiển thị nút gửi tin không */
function isVisibleSendBtn() {
  return (
    // đã chọn file để gửi
    messageStore.upload_file_list?.length ||
    // có nội dung văn bản muốn gửi
    commonStore.is_typing
  )
}

// xuất hàm cho component con xử dụng
provide(IS_VISIBLE_SEND_BTN_FUNCT, isVisibleSendBtn)
</script>
<style scoped lang="scss">
.animate-fast-pulse {
  animation: pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
