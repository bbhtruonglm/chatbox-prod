<template>
  <ButtonList
    v-if="message_chatbot?.payload?.template_type === 'button'"
    :data="message_chatbot?.payload?.buttons"
    class="message-box btn-list"
  />
  <SliderList
    v-if="message_chatbot?.payload?.template_type === 'generic'"
    :data="message_chatbot?.payload?.elements"
  />
  <template v-if="message_chatbot?.payload?.template_type === 'media'">
    <ButtonList
      v-if="message_chatbot?.payload?.elements?.[0]?.buttons?.length"
      :data="message_chatbot?.payload?.elements?.[0]?.buttons"
      class="message-box btn-list"
    />
    <MediaAsset
      v-if="message_chatbot?.payload?.elements?.[0]?.media_type"
      v-for="element of message_chatbot?.payload?.elements"
      :text="element?.url || ''"
    />
  </template>
</template>
<script setup lang="ts">
import ButtonList from '@/views/ChatWarper/Chat/CenterContent/MessageList/ChatbotMessage/ButtonList.vue'
import SliderList from '@/views/ChatWarper/Chat/CenterContent/MessageList/ChatbotMessage/SliderList.vue'
import MediaAsset from '@/views/ChatWarper/Chat/CenterContent/MessageList/ChatbotMessage/MediaAsset.vue'

import type { AttachmentInfo } from '@/service/interface/app/message'

const $props = withDefaults(
  defineProps<{
    message_chatbot?: AttachmentInfo
  }>(),
  {}
)
</script>
<style scoped lang="scss">
.btn-list {
  @apply mt-2 w-52;
}
</style>
