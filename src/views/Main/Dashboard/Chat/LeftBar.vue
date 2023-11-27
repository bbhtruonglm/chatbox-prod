<template>
    <div id="chat-conversation" class="bg-white md:w-[350px] xl:pt-4">
        <div class="pl-14 pr-4 md:pl-4 flex items-center">
            <div @click="openConversationFilter()" class="cursor-pointer">
                <img v-if="isFilterActive()" src="@/assets/icons/filter-active.svg" width="23" height="23">
                <img v-else src="@/assets/icons/filter.svg" width="23" height="23">
            </div>
            <div class="flex items-center ml-4 w-full justify-between">
                <div v-if="!is_show_search" >
                    <span class="font-medium text-2xl">
                        {{ $t('v1.common.chatbox') }}
                    </span>
                    <span class="text-xs text-slate-500">
                        v{{ version }}
                    </span>
                </div>
                <input v-model="search_conversation" @keyup="onSearchConversation" ref="search_conversation_input"
                    class="h-[32px] w-full px-2 focus:outline-none" v-if="is_show_search" type="text"
                    :placeholder="$t('v1.view.main.dashboard.chat.search')">
                <div @click="toogleSearch" class="cursor-pointer">
                    <img v-if="!is_show_search" src="@/assets/icons/search.svg" width="28" height="28">
                    <img v-else src="@/assets/icons/close-red.svg">
                </div>
            </div>
        </div>
        <UserOnline />
        <Conversation />
    </div>
    <template>
        <FilterModal ref="filter_modal_ref" />
        <StaffInfoModal />
    </template>
</template>

<script setup lang="ts">
import { nextTick, onMounted, ref } from 'vue'
import {  useConversationStore } from '@/stores'
import { debounce, identity, isEqual, omit, pickBy } from 'lodash'
import { useI18n } from 'vue-i18n'
import { teleportModelFilterOnPcScreen } from '@/service/function'

import UserOnline from '@/views/Main/Dashboard/Chat/LeftBar/UserOnline.vue'
import Conversation from '@/views/Main/Dashboard/Chat/LeftBar/Conversation.vue'
import FilterModal from '@/views/Main/Dashboard/Chat/LeftBar/FilterModal.vue'
import StaffInfoModal from '@/views/Main/Dashboard/Chat/LeftBar/StaffInfoModal.vue'

import type { ComponentRef } from '@/service/interface/vue'
const conversationStore = useConversationStore()
const { t: $t } = useI18n()

/**phiên bản trong package.json */
const version = npm_package_version
/**giá trị của ô tìm kiếm hội thoại */
const search_conversation = ref<string>()
/**ref của modal filter */
const filter_modal_ref = ref<ComponentRef>()
/**có hiển thị tìm kiếm hay không */
const is_show_search = ref(false)
/**ref của input tìm kiếm hội thoại */
const search_conversation_input = ref<ComponentRef>()

onMounted(() => {
    if (conversationStore.option_filter_page_data.search) {
        // load giá trị search được lưu từ local vào biến khi load lại trang
        search_conversation.value = conversationStore.option_filter_page_data.search

        // hiện input tìm kiếm
        is_show_search.value = true
    }
})

/**toggle modal */
function openConversationFilter() {
    teleportModelFilterOnPcScreen()

    filter_modal_ref.value?.toggleModal()
}
/**delay tìm kiếm hội thoại */
const onSearchConversation = debounce(($event: Event) => {
    
    const INPUT = $event.target as HTMLInputElement
    
    conversationStore.option_filter_page_data.search = INPUT.value
}, 300)
/**check xem có đang kích hoạt lọc hội thoại hay không */
function isFilterActive() {
    // đọc lấy dữ liệu lọc không có search
    let filter = omit(conversationStore.option_filter_page_data, ['search'])

    // loại bỏ các giá trị bị undefied trong object
    filter = pickBy(filter, identity)

    // kiểm tra lọc
    if (isEqual(filter, { is_spam_fb: 'NO' })) return false

    return true
}
/**ẩn hiện ô tìm kiếm hội thoại */
function toogleSearch() {
    // toggle value
    is_show_search.value = !is_show_search.value

    // nếu hiển thị ô tìm kiếm thì tự động focus vào input
    if (is_show_search.value)
        nextTick(() => search_conversation_input.value?.focus())

    // nếu tắt ô tìm kiếm thì xoá search
    if (!is_show_search.value) {
        // xoá trong store
        conversationStore.option_filter_page_data.search = undefined
        // xoá biến hiện tại
        search_conversation.value = undefined
    }
}
</script>