<template>
    <div v-if="conversationStore.select_conversation"
        class="pl-[50px] md:pl-0 border-b h-[50px] grid grid-cols-3 xl:grid-cols-2 overflow-hidden overflow-y-auto">
        <div class="flex items-center col-span-2 xl:col-span-1">
            <button @click="backToConversation" class="block md:hidden mr-4">
                <img class="rounded-full" width="13" height="13" src="@/assets/icons/arrow-left.svg">
            </button>
            <ClientAvatar :client_name="conversationStore.select_conversation?.client_name"
                :client_id="conversationStore.select_conversation?.fb_client_id"
                :page_id="conversationStore.select_conversation?.fb_page_id"
                :staff_id="chatbotUserStore.chatbot_user?.fb_staff_id"
                :platform_type="conversationStore.select_conversation?.platform_type" size="37" class="rounded-full" />
            <div class="ml-1">
                <div class="text-sm font-medium">
                    {{ conversationStore.select_conversation?.client_name }}
                </div>
                <button @click="openAssignStaff"
                    class="text-xs bg-slate-200 text-slate-500 rounded px-2 py-[2px] flex items-center">
                    <span class="mr-1">
                        <template v-if="conversationStore.select_conversation?.fb_staff_id" class="mr-2">
                            {{
                                pageStore.selected_page_list_info?.[conversationStore.select_conversation?.fb_page_id]?.staff_list?.[conversationStore.select_conversation?.fb_staff_id]?.name
                            }}
                        </template>
                        <template v-else>
                            {{ $t('v1.view.main.dashboard.chat.assign_staff.title') }}
                        </template>
                    </span>
                    <img width="13" height="13" src="@/assets/icons/arrow-down.svg">
                </button>
            </div>
        </div>
        <div class="flex items-center justify-end">
            <button @click="unreadConversation" class="border border-slate-300 rounded-full p-2 mr-2">
                <img v-if="!is_loading_unread_conversation" width="16" height="16"
                    src="@/assets/icons/envelope-open-icon.svg">
                <Loading v-else class="w-[16px] h-[16px]" />
            </button>
            <button class="border border-slate-300 rounded-full p-2 mr-2">
                <img width="16" height="16" src="@/assets/icons/block-user-unactive.svg">
                <!-- <img src="@/assets/icons/block-user-active.svg"> -->
            </button>
        </div>
    </div>
</template>
<script setup lang="ts">
import {
    useCommonStore, useConversationStore, useChatbotUserStore, usePageStore
} from '@/stores'
import { reset_read_conversation } from '@/service/api/chatbox/n4-service';
import { ref } from 'vue'
import { flow } from '@/service/helper/async'

import ClientAvatar from '@/components/Avatar/ClientAvatar.vue'
import Loading from '@/components/Loading.vue'
import type { CbError } from '@/service/interface/function';

const $emit = defineEmits(['toggle_change_assign_staff'])

const commonStore = useCommonStore()
const conversationStore = useConversationStore()
const chatbotUserStore = useChatbotUserStore()
const pageStore = usePageStore()

/**bật loading khi gọi api đánh dấu hội thoại chưa đọc */
const is_loading_unread_conversation = ref(false)

/**xử lý sự kiện thoát ra ngoài màn hình danh sách khách hàng của mobile */
function backToConversation() {
    commonStore.is_show_message_mobile = false
}
/**mở modal thay đổi assign nhân viên */
function openAssignStaff() {
    $emit('toggle_change_assign_staff')
}
/**đánh dấu hội thoại này là chưa đọc */
function unreadConversation() {
    // api đang chạy thì không cho gọi nữa
    if (is_loading_unread_conversation.value) return

    flow([
        // * bật loading
        (cb: CbError) => {
            is_loading_unread_conversation.value = true

            cb()
        },
        // * gọi api
        (cb: CbError) => reset_read_conversation({
            page_id: conversationStore.select_conversation?.fb_page_id as string,
            client_id: conversationStore.select_conversation?.fb_client_id as string,
            unread_message_amount: 1
        }, (e, r) => {
            if (e) return cb(e)

            cb()
        })
    ], e => {
        // tắt loading
        is_loading_unread_conversation.value = false
    })
}
</script>