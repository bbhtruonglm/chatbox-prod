<template>
  <div
    v-if="$route.query.user_id"
    id="chat__input-chat"
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
import { useConversationStore, useMessageStore } from '@/stores'

import ScrollToBottomBtn from '@/views/ChatWarper/Chat/CenterContent/InputChat/ScrollToBottomBtn.vue'
import ListLabel from '@/views/ChatWarper/Chat/CenterContent/InputChat/ListLabel.vue'
import PreviewAttachment from '@/views/ChatWarper/Chat/CenterContent/InputChat/PreviewAttachment.vue'
import MainInput from '@/views/ChatWarper/Chat/CenterContent/InputChat/MainInput.vue'
import ReplyComment from '@/views/ChatWarper/Chat/CenterContent/InputChat/ReplyComment.vue'

const messageStore = useMessageStore()
const conversationStore = useConversationStore()
</script>
