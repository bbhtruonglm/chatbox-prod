<template>
  <div
    :class="{
      'pr-3': isVisibleSendBtn(),
    }"
    class="flex items-end bg-white rounded-3xl py-2 px-4"
  >
    <div class="flex gap-2 items-end flex-grow">
      <AiManager />
      <AttachmentMenu />
      <Input ref="input_chat_ref" />
    </div>
    <SendIcon
      v-if="isVisibleSendBtn()"
      v-tooltip="$t('v1.view.main.dashboard.chat.action.send_message')"
      @click="input_chat_ref?.sendMessage"
      class="w-8 h-8 cursor-pointer flex-shrink-0"
    />
    <QuickAnswer />
  </div>
</template>
<script setup lang="ts">
import { provide, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMessageStore, useCommonStore } from '@/stores'
import { IS_VISIBLE_SEND_BTN_FUNCT } from '@/views/ChatWarper/Chat/CenterContent/InputChat/symbol'

import QuickAnswer from '@/views/ChatWarper/Chat/CenterContent/InputChat/MainInput/QuickAnswer.vue'
import AiManager from '@/views/ChatWarper/Chat/CenterContent/InputChat/MainInput/AiManager.vue'
import AttachmentMenu from '@/views/ChatWarper/Chat/CenterContent/InputChat/MainInput/AttachmentMenu.vue'
import Input from '@/views/ChatWarper/Chat/CenterContent/InputChat/MainInput/Input.vue'

import SendIcon from '@/components/Icons/Send.vue'

const messageStore = useMessageStore()
const commonStore = useCommonStore()
const { t: $t } = useI18n()

/**ref của ô chat tin nhắn */
const input_chat_ref = ref<InstanceType<typeof Input>>()

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
.word-break-all {
  word-break: break-all;
}
</style>
