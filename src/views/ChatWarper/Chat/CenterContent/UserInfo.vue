<template>
    <div v-if="conversationStore.select_conversation"
        class="pl-[50px] md:pl-0 border-b h-[50px] grid grid-cols-3 xl:grid-cols-2 overflow-y-auto bg-white rounded-lg flex-shrink-0">
        <div class="flex items-center col-span-2 xl:col-span-1">
            <ClientAvatar @click="openClientInfo" :client_name="conversationStore.select_conversation?.client_name"
                :client_id="conversationStore.select_conversation?.fb_client_id"
                :page_id="conversationStore.select_conversation?.fb_page_id"
                :staff_id="chatbotUserStore.chatbot_user?.fb_staff_id"
                :platform_type="conversationStore.select_conversation?.platform_type" size="37"
                :client_avatar="conversationStore.select_conversation?.client_avatar"
                class="rounded-full cursor-pointer ml-1" />
            <div class="ml-3">
                <div class="flex items-center">
                    <div @click="copyToClipboard(conversationStore.select_conversation?.client_name || '')"
                        class="text-sm font-medium truncate max-w-[150px] cursor-copy">
                        {{ conversationStore.select_conversation?.client_name }}
                    </div>
                    <div v-tooltip.right="$t('v1.view.main.dashboard.chat.client.title')" @click="openClientInfo"
                        class="ml-1 cursor-pointer">
                        <img src="@/assets/icons/info.svg" class="w-[15px] h-[15px]" />
                    </div>
                </div>
                <button v-tooltip.bottom="$t('v1.view.main.dashboard.chat.assign_staff.title')" @click="openAssignStaff"
                    class="text-xs bg-slate-200  rounded px-2 py-[2px] flex items-center" :class="{
        'text-slate-500': is_admin,
        'text-slate-400': !is_admin,
        'cursor-not-allowed': !is_admin
    }">
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
            <template v-if="uid">
                <button v-tooltip.bottom="$t('v1.view.main.dashboard.chat.action.open_facebook')" @click="openFbProfile"
                    class="border border-slate-300 rounded-full p-2 mr-2">
                    <img width="16" height="16" src="@/assets/icons/facebook.svg">
                </button>
                <button v-tooltip.bottom="$t('v1.view.main.dashboard.chat.action.open_inbox')" @click="openPageInbox"
                    class="border border-slate-300 rounded-full p-2 mr-2">
                    <img width="16" height="16" src="@/assets/icons/filter_interact.svg">
                </button>
            </template>
            <button v-tooltip.bottom="$t('v1.view.main.dashboard.chat.action.mark_unread')" @click="unreadConversation"
                class="border border-slate-300 rounded-full p-2 mr-2">
                <img v-if="!is_loading_unread_conversation" width="16" height="16"
                    src="@/assets/icons/envelope-open-icon.svg">
                <Loading v-else class="w-[16px] h-[16px]" />
            </button>
            <button
                v-tooltip.bottom="conversationStore.select_conversation.is_spam_fb ? $t('v1.view.main.dashboard.chat.action.alow_user') : $t('v1.view.main.dashboard.chat.action.block_user')"
                @click="toggleSpam" :class="{
        'bg-red-500': conversationStore.select_conversation.is_spam_fb
    }" class="border border-slate-300 rounded-full p-2 mr-2">
                <Loading v-if="is_loading_spam_conversation" class="w-[16px] h-[16px]" />
                <img v-else-if="!conversationStore.select_conversation.is_spam_fb" width="16" height="16"
                    src="@/assets/icons/block-user-unactive.svg">
                <img v-else src="@/assets/icons/block-user-active.svg">
            </button>
        </div>
    </div>
    <ClientInfo ref="client_info_modal_ref" />
</template>
<script setup lang="ts">
import {
    useCommonStore, useConversationStore, useChatbotUserStore, usePageStore
} from '@/stores'
import { reset_read_conversation, toggle_spam_conversation } from '@/service/api/chatbox/n4-service'
import { ref, computed } from 'vue'
import { flow } from '@/service/helper/async'
import { keyBy, map } from 'lodash'
import { isCurrentStaffIsPageAdmin, openNewTab } from '@/service/function'

import ClientAvatar from '@/components/Avatar/ClientAvatar.vue'
import Loading from '@/components/Loading.vue'
import ClientInfo from '@/views/ChatWarper/Chat/CenterContent/UserInfo/ClientInfo.vue'

import type { CbError } from '@/service/interface/function'
import type { ComponentRef } from '@/service/interface/vue'
import { copyToClipboard } from '@/service/helper/copyWithAlert'

const $emit = defineEmits(['toggle_change_assign_staff'])

const commonStore = useCommonStore()
const conversationStore = useConversationStore()
const chatbotUserStore = useChatbotUserStore()
const pageStore = usePageStore()

/**ref của modal thông tin khách hàng */
const client_info_modal_ref = ref<ComponentRef>()
/**bật loading khi gọi api đánh dấu hội thoại chưa đọc */
const is_loading_unread_conversation = ref(false)
/**bật loading khi gọi api toggle spam */
const is_loading_spam_conversation = ref(false)
/**vị trí của hội thoại vừa mới được ẩn */
const index_of_spam_conversation = ref(0)
/** trạng thái của tài khoản hiện tại có phải là admin hay ko? */
const is_admin = computed(() => isCurrentStaffIsPageAdmin(
    conversationStore.select_conversation?.fb_page_id as string
))

/**uid của khách */
const uid = computed(() => conversationStore.select_conversation?.client_bio?.fb_uid)

/**mở fb của khách */
function openFbProfile() {
    // nếu có uid thì mở fb của khách
    if (uid.value)
        openNewTab(`https://fb.com/${uid.value}`)

    // chạy qua ext -> click vào btn tạo ở file index.html
    else
        (document.getElementsByClassName('open-fb-profile')?.[0] as HTMLButtonElement)?.click()
}
/**mở inbox chat page */
function openPageInbox() {
    // nếu có uid thì mở fb của khách
    if (uid.value)
        openNewTab(`https://business.facebook.com/latest/inbox/all?selected_item_id=${uid.value}&asset_id=${conversationStore.select_conversation?.fb_page_id}&mailbox_id=&thread_type=FB_MESSAGE`)

    // chạy qua ext -> click vào btn tạo ở file index.html
    else
        (document.getElementsByClassName('open-fb-inbox-page')?.[0] as HTMLButtonElement)?.click()
}
/**mở popup thông tin chi tiết của khách hàng */
function openClientInfo() {
    client_info_modal_ref.value.toggleModal()
}
/**mở modal thay đổi assign nhân viên */
function openAssignStaff($event: MouseEvent) {
    /** Nếu tài khoản hiện tại không phải admin thì ko cho assign nhân viên */
    if (!is_admin.value) return

    /** Mở modal */
    $emit('toggle_change_assign_staff', $event)
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
        // * gắn cờ hội thoại chưa đọc, để không bị conflig vào code hiện thị
        (cb: CbError) => {
            // nếu không có hội thoại nào đang chọn thì thoát
            if (!conversationStore.select_conversation) return cb()

            // gắn cờ hội thoại chưa đọc
            conversationStore.select_conversation.is_force_unread = true

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
/**toggle hội thoại này là spam */
function toggleSpam() {
    // api đang chạy thì không cho gọi
    if (is_loading_spam_conversation.value) return

    /**giá trị spam mới */
    const NEW_IS_SPAM = !conversationStore.select_conversation?.is_spam_fb

    flow([
        // * bật loading
        (cb: CbError) => {
            is_loading_spam_conversation.value = true

            cb()
        },
        // * gọi api
        (cb: CbError) => toggle_spam_conversation({
            page_id: conversationStore.select_conversation?.fb_page_id as string,
            client_id: conversationStore.select_conversation?.fb_client_id as string,
            is_spam: NEW_IS_SPAM
        }, (e, r) => {
            if (e) return cb(e)

            cb()
        }),
        // * di chuyển hội thoại ra khỏi danh sách nếu cần thiết
        (cb: CbError) => {
            if (!conversationStore.select_conversation) return

            /**key của hội thoại */
            const KEY = conversationStore.select_conversation?.data_key

            if (!KEY) return cb()

            // thay đổi cờ của conversation đang chọn
            conversationStore.select_conversation.is_spam_fb = NEW_IS_SPAM

            // nếu trong danh sách đang tồn tại hội thoại thì xoá đi
            if (conversationStore.conversation_list[KEY]) {
                // lấy vị trí trước khi bị ẩn
                index_of_spam_conversation.value = Object
                    .keys(conversationStore.conversation_list)
                    .indexOf(KEY)

                // xoá khỏi danh sách
                delete conversationStore.conversation_list[KEY]
            }
            // nếu trong danh sách không tồn tại hội thoại thì hiện lên
            else {
                // đổi danh sách hội thoại thành mảng
                let conversation_array = map(conversationStore.conversation_list)

                // thêm phần tử bị xoá vào đúng vị trí cũ của mảng
                conversation_array.splice(
                    index_of_spam_conversation.value,
                    0,
                    conversationStore.select_conversation
                )

                // biến đổi mảng thành obj
                conversationStore.conversation_list = keyBy(conversation_array, 'data_key')
            }

            cb()
        },
    ], e => {
        // tắt loading
        is_loading_spam_conversation.value = false
    })
}
</script>