<template>
    <div class="md:w-[calc(100%_-_650px)] xl:w-[calc(100%_-_750px)] h-full">
        <UserInfo />
        <MessageList />
        <InputChat />
    </div>
</template>
<script setup lang="ts">
import UserInfo from '@/views/Main/Dashboard/Chat/CenterContent/UserInfo.vue'
import MessageList from '@/views/Main/Dashboard/Chat/CenterContent/MessageList.vue'
import InputChat from '@/views/Main/Dashboard/Chat/CenterContent/InputChat.vue'
</script>