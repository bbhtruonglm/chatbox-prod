<template>
  <div
    v-if="$route.query.user_id"
    id="chat__input-chat"
    ref="input_chat_warper"
    class="w-full relative flex-shrink-0 py-2 flex flex-col gap-2"
  >
    <ScrollToBottomBtn />
    <ReplyComment v-if="messageStore.reply_comment?.root_comment_id" />
    <ListLabel v-else />
    <PreviewAttachment />
    <MainInput
      v-if="conversationStore.select_conversation?.conversation_type !== 'POST'"
    />
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { size } from 'lodash'
import { useConversationStore, useMessageStore } from '@/stores'
import { onUnmounted } from 'vue'
import { useRoute } from 'vue-router'

import ScrollToBottomBtn from '@/views/ChatWarper/Chat/CenterContent/InputChat/ScrollToBottomBtn.vue'
import ListLabel from '@/views/ChatWarper/Chat/CenterContent/InputChat/ListLabel.vue'
import PreviewAttachment from '@/views/ChatWarper/Chat/CenterContent/InputChat/PreviewAttachment.vue'
import MainInput from '@/views/ChatWarper/Chat/CenterContent/InputChat/MainInput.vue'
import ReplyComment from '@/views/ChatWarper/Chat/CenterContent/InputChat/ReplyComment.vue'

import type { ComponentRef } from '@/service/interface/vue'
import type { WidgetEventData } from '@/service/interface/app/widget'

const messageStore = useMessageStore()
const conversationStore = useConversationStore()
const $route = useRoute()

/**ref của input chat */
const input_chat_warper = ref<ComponentRef>()
/**ref của ô chat tin nhắn */
const input_chat_ref = ref<ComponentRef>()

onMounted(() => window.addEventListener('message', onWidgetEvent))
onUnmounted(() => window.removeEventListener('message', onWidgetEvent))

/**xử lý dữ liệu widget truyền vào */
function onWidgetEvent($event: MessageEvent<WidgetEventData>) {
  let { _type, content, list_images } = $event.data

  if (_type !== 'WIDGET') return true

  // thêm văn bản vào input chat, lọc bỏ cũ pháp cũ
  if (content)
    input_chat_ref.value.innerText = content?.split('\n\n##attachment##')?.[0]

  // nạp hình ảnh vào danh sách gửi
  if (list_images && size(list_images))
    messageStore.upload_file_list = list_images?.map(url => {
      return {
        type: 'image',
        is_done: false,
        is_loading: false,
        preview: url,
        url,
      }
    })
}
</script>
