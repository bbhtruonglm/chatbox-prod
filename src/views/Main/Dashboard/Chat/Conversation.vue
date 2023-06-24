<template>
    <div v-if="!size(items)" class="absolute left-[50%] translate-x-[-50%]">
        <Loading class="mx-auto" />
    </div>
    <VirtualList
        class="conversation h-[calc(100vh_-_142px)] md:h-[calc(100vh_-_109px)]  xl:h-[calc(100vh_-_93px)]  overflow-hidden overflow-y-auto  pb-[40px]"
        item-class="cursor-pointer hover:bg-slate-100" :data-key="'data_key'" :data-sources="items"
        :data-component="ConversationItem" />
</template>
<script setup lang="ts">
import { ref } from 'vue'
import VirtualList from 'vue3-virtual-scroll-list'
import { size } from 'lodash'

import Loading from '@/components/Loading.vue'
import ConversationItem from '@/views/Main/Dashboard/Chat/Conversation/ConversationItem.vue'

let count = 0
const items = ref(Array(100).fill({ data_key: count++, text: 'abc' }))
</script>
<style scoped lang="scss">
.conversation {
    &::-webkit-scrollbar {
        width: 0px;
    }
}
</style>