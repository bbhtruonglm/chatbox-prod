<template>
  <div
    id="center-content"
    class="h-full w-full flex flex-col overflow-hidden gap-1"
  >
    <MessageList />
    <InputChat />
  </div>
  <template>
    <!-- <AttachmentViewModal /> -->
    <StaffReadModal />
  </template>
</template>
<script setup lang="ts">
import MessageList from '@/views/ChatWarper/Chat/CenterContent/MessageList.vue'
import InputChat from '@/views/ChatWarper/Chat/CenterContent/InputChat.vue'

// import AttachmentViewModal from '@/views/ChatWarper/Chat/CenterContent/AttachmentViewModal.vue'
import StaffReadModal from '@/views/ChatWarper/Chat/CenterContent/StaffReadModal.vue'
</script>
