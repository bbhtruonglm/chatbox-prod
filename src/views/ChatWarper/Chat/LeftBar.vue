<template>
  <div
    class="bg-white w-[360px] rounded-xl flex flex-col overflow-hidden flex-shrink-0 py-3 px-2 gap-3"
  >
    <Header />
    <Conversation />
  </div>
</template>

<script setup lang="ts">
import Conversation from '@/views/ChatWarper/Chat/LeftBar/Conversation.vue'
import Header from '@/views/ChatWarper/Chat/LeftBar/Header.vue'
</script>
