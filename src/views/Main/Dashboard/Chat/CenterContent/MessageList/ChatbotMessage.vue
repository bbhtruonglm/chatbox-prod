<template>
    <ButtonList v-if="message_chatbot?.payload?.template_type === 'button'" :data="message_chatbot?.payload?.buttons" />
    <SliderList v-if="message_chatbot?.payload?.template_type === 'generic'" :data="message_chatbot?.payload?.elements" />
    <ButtonList v-if="message_chatbot?.payload?.template_type === 'media'" :data="message_chatbot?.payload?.elements?.[0]?.buttons" />
</template>
<script setup lang="ts">
import ButtonList from '@/views/Main/Dashboard/Chat/CenterContent/MessageList/ChatbotMessage/ButtonList.vue'
import SliderList from '@/views/Main/Dashboard/Chat/CenterContent/MessageList/ChatbotMessage/SliderList.vue'

import type { AttachmentInfo } from '@/service/interface/app/message'

const $props = withDefaults(defineProps<{
    message_chatbot?: AttachmentInfo
}>(), {})
</script>