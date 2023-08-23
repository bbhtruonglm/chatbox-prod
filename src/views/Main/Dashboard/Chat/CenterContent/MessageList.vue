<template>
    <div class="p-2 h-[calc(100%_-_150px)] overflow-hidden overflow-y-auto">
        <template v-for="i of 10">
            <ClientTextMessage :text="random_sentence(1, 5)" />
            <PageTextMessage :text="random_sentence(3, 5)" />
            <PageTextMessage :text="random_sentence()" />
            <PageTextMessagePrivate :text="random_sentence(1, 5)" />
            <ClientTextMessage :text="random_sentence(1, 5)" />
            <ClientTextMessage :text="random_sentence(1, 5)" />
            <ClientTextMessage :text="random_sentence()" />
            <PageTextMessagePrivate :text="random_sentence(1, 5)" />
            <SystemMessage :text="random_sentence(10, 15)" />
        </template>
    </div>
</template>
<script setup lang="ts">
import { random_sentence } from '@/service/helper/random'

import ClientTextMessage from '@/views/Main/Dashboard/Chat/CenterContent/MessageList/ClientTextMesage.vue'
import PageTextMessage from '@/views/Main/Dashboard/Chat/CenterContent/MessageList/PageTextMessage.vue'
import SystemMessage from '@/views/Main/Dashboard/Chat/CenterContent/MessageList/SystemMessage.vue'
import PageTextMessagePrivate from '@/views/Main/Dashboard/Chat/CenterContent/MessageList/PageTextMessagePrivate.vue'
</script>