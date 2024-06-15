<template>
    <div id="chat-conversation" class="bg-white md:w-[350px] xl:pt-2 flex flex-col">
        <div class="pl-14 pr-4 md:pl-0 flex items-center mb-2 flex-shrink-0">
            <div class="flex items-center ml-4 md:ml-0 w-full justify-between">
                <div v-if="!is_show_search" class="flex items-end">
                    <div v-tooltip.bottom="`v${version}`" class="ml-3 font-medium text-2xl">
                        {{ $t('v1.common.chatbox') }}
                    </div>
                    <div v-tooltip.bottom="$t('v1.view.main.dashboard.chat.action.total_client')"
                        @click="reloadConversation" class="flex items-end mb-[2px] cursor-pointer">
                        <div class="text-sm text-slate-700 ml-1">
                            {{ total_conversation?.toLocaleString() }}
                        </div>
                        <div class="mb-[3px]">
                            <img src="@/assets/icons/user-list.svg" class="w-[15px] h-[15px]" />
                        </div>
                    </div>
                    <div class="pb-1 cursor-pointer">
                        <Loading v-if="commonStore.extension_status === 'FINDING'"
                            v-tooltip.bottom="$t('v1.view.main.dashboard.chat.extension.findding')" :size="15" />
                        <img v-if="commonStore.extension_status === 'FOUND'"
                            v-tooltip.bottom="$t('v1.view.main.dashboard.chat.extension.connected')"
                            src="@/assets/icons/extension.svg" width="15" height="15" />
                    </div>
                </div>
                <input v-model="search_conversation" @keyup="onSearchConversation" ref="search_conversation_input"
                    class="h-[32px] w-full px-2 focus:outline-none" v-if="is_show_search" type="text"
                    :placeholder="$t('v1.view.main.dashboard.chat.search')">
                <div v-tooltip.bottom="is_show_search ? $t('v1.view.main.dashboard.chat.action.cancel_search') : $t('v1.view.main.dashboard.chat.action.search_conversation')"
                    @click="toogleSearch" class="cursor-pointer">
                    <img v-if="!is_show_search" src="@/assets/icons/search.svg" width="28" height="28">
                    <img v-else src="@/assets/icons/close-red.svg">
                </div>
            </div>
        </div>
        <Conversation ref="conversation_ref" />
    </div>
</template>

<script setup lang="ts">
import { nextTick, onMounted, ref } from 'vue'
import { useConversationStore, usePageStore, useCommonStore } from '@/stores'
import { debounce, keys } from 'lodash'
import { useI18n } from 'vue-i18n'
import { count_conversation } from '@/service/api/chatbox/n4-service'

import Conversation from '@/views/ChatWarper/Chat/LeftBar/Conversation.vue'
import Loading from '@/components/Loading.vue'

import type { ComponentRef } from '@/service/interface/vue'
import { watch } from 'vue'

const conversationStore = useConversationStore()
const pageStore = usePageStore()
const commonStore = useCommonStore()
const { t: $t } = useI18n()

/**phiên bản trong package.json */
const version = npm_package_version
/**giá trị của ô tìm kiếm hội thoại */
const search_conversation = ref<string>()
/**có hiển thị tìm kiếm hay không */
const is_show_search = ref(false)
/**ref của input tìm kiếm hội thoại */
const search_conversation_input = ref<ComponentRef>()
/**ref của danh sách hội thoại */
const conversation_ref = ref<ComponentRef>()
/**đếm tổng số khách hàng thoả mãn điều kiện lọc */
const total_conversation = ref<number>()

onMounted(() => {
    if (conversationStore.option_filter_page_data.search) {
        // load giá trị search được lưu từ local vào biến khi load lại trang
        search_conversation.value = conversationStore.option_filter_page_data.search

        // hiện input tìm kiếm
        is_show_search.value = true
    }

    countTotalConversationValid()
})

// khi thay đổi giá trị lọc tin nhắn thì load lại dữ liệu
watch(
    () => conversationStore.option_filter_page_data,
    () => countTotalConversationValid(),
    { deep: true }
)

/**xử lý sự kiện khi modal mở ra */
function countTotalConversationValid() {
    count_conversation(
        {
            ...{
                page_id: keys(pageStore.selected_page_id_list),
            },
            ...conversationStore.option_filter_page_data
        },
        (e, r) => total_conversation.value = r
    )
}
/**delay tìm kiếm hội thoại */
const onSearchConversation = debounce(($event: Event) => {

    const INPUT = $event.target as HTMLInputElement

    conversationStore.option_filter_page_data.search = INPUT.value
}, 300)
/**load lại dữ liệu lọc hiện tại */
function reloadConversation() {
    conversation_ref.value?.loadConversationFirstTime(true)
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