<template>
    <div id="list-message-warper" class="h-[calc(100%_-_150px)] relative">
        <!-- <div class="w-[calc(100vw_/_8)] h-full absolute z-10 top-0 left-0 md:hidden" /> -->
        <div @scroll="loadMoreMessage" id="list-message"
            class="pt-0 p-2 pb-10 h-full overflow-hidden overflow-y-auto bg-gray-100">
            <div v-if="is_loading" class="relative z-10">
                <div class="fixed left-[50%] translate-x-[-50%]">
                    <Loading class="mx-auto" />
                </div>
            </div>
            <div v-for="message of list_message" :id="message._id" class="pt-[1px] pr-5 relative">
                <div v-if="message.message_type === 'client' && !message.ad_id" class="w-fit max-w-[370px] group">
                    <template v-if="message.message_text || message.message_attachments?.length">
                        <ClientTextMessage v-if="message.message_text" :text="message.message_text" />
                        <AttachmentMessage v-if="message.message_attachments"
                            :message_attachments="message.message_attachments" :message_mid="message.message_mid"
                            :page_id="message.fb_page_id" type="CLIENT" />
                    </template>
                    <UnsupportMessage v-else />
                    <MessageDate class="text-right" :time="message.time" />
                </div>
                <div v-else-if="message.message_type === 'page'" class="flex flex-col items-end">
                    <div class="w-fit max-w-[370px] group">
                        <template v-if="message.message_text || message.message_attachments">
                            <PageTextMessage v-if="message.message_text" :text="message.message_text" />
                            <template v-if="message.message_attachments">
                                <AttachmentMessage
                                    v-if="!['template', 'fallback', 'receipt'].includes(message.message_attachments?.[0]?.type || '')"
                                    :message_attachments="message.message_attachments" :message_mid="message.message_mid"
                                    :page_id="message.fb_page_id" type="PAGE" />
                                <ChatbotMessage v-else :message_chatbot="message.message_attachments?.[0]" />
                            </template>
                        </template>
                        <UnsupportMessage v-else />
                        <MessageDate class="right-5" :time="message.time"
                            :info="parserStaffName(message.message_metadata)" />
                    </div>
                </div>
                <div v-else-if="message.message_type === 'note'" class="flex flex-col items-end">
                    <div class="w-fit max-w-[370px] group">
                        <NoteMessage v-if="message.message_text" :text="message.message_text" />
                        <UnsupportMessage v-else />
                        <MessageDate class="right-5" :time="message.time"
                            :info="parserStaffName(message.message_metadata)" />
                    </div>
                </div>
                <div v-else-if="message.message_type === 'system'" class="flex justify-center">
                    <div class="w-[70%] text-center">
                        <SystemMessage v-if="message.message_text" :text="message.message_text" />
                        <UnsupportMessage v-else />
                    </div>
                </div>
                <div v-else-if="message.message_type === 'client' && message.ad_id">
                    <AdMessage :ad_id="message.ad_id" />
                </div>
                <div v-else-if="message.platform_type === 'FB_POST' && message.fb_post_id">
                    <FacebookPost :fb_post_id="message.fb_post_id" />
                </div>
                <div v-else class="text-center flex justify-center">
                    <UnsupportMessage class="w-[70%]" />
                </div>
                <ClientRead @change_last_read_message="visibleFirstClientReadAvatar" :time="message.time" />
                <StaffRead @change_last_read_message="visibleLastStaffReadAvatar" :time="message.time" />
            </div>
            <div v-for="message of messageStore.send_message_list" class="pt-[1px] pr-5 relative group">
                <div class="flex flex-col items-end">
                    <div class="w-fit max-w-[370px] group">
                        <PageTempTextMessage :text="message.text" />
                        <PageMessageError v-if="message.error" />
                        <MessageDate class="right-5" :time="message.time" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { useConversationStore, useMessageStore } from '@/stores'
import { flow } from '@/service/helper/async'
import { read_message } from '@/service/api/chatbox/n4-service'
import { toastError } from '@/service/helper/alert'
import { isNotPc, scrollToBottomMessage } from '@/service/function'
import { debounce, remove } from 'lodash'

import Loading from '@/components/Loading.vue'
import MessageDate from '@/views/Main/Dashboard/Chat/CenterContent/MessageList/MessageDate.vue'
import ChatbotMessage from '@/views/Main/Dashboard/Chat/CenterContent/MessageList/ChatbotMessage.vue'
import AttachmentMessage from '@/views/Main/Dashboard/Chat/CenterContent/MessageList/AttachmentMessage.vue'
import UnsupportMessage from '@/views/Main/Dashboard/Chat/CenterContent/MessageList/UnsupportMessage.vue'
import ClientTextMessage from '@/views/Main/Dashboard/Chat/CenterContent/MessageList/ClientTextMesage.vue'
import PageTextMessage from '@/views/Main/Dashboard/Chat/CenterContent/MessageList/PageTextMessage.vue'
import PageTempTextMessage from '@/views/Main/Dashboard/Chat/CenterContent/MessageList/PageTempTextMessage.vue'
import PageMessageError from '@/views/Main/Dashboard/Chat/CenterContent/MessageList/PageMessageError.vue'
import SystemMessage from '@/views/Main/Dashboard/Chat/CenterContent/MessageList/SystemMessage.vue'
import NoteMessage from '@/views/Main/Dashboard/Chat/CenterContent/MessageList/NoteMessage.vue'
import ClientRead from '@/views/Main/Dashboard/Chat/CenterContent/MessageList/ClientRead.vue'
import StaffRead from '@/views/Main/Dashboard/Chat/CenterContent/MessageList/StaffRead.vue'
import AdMessage from '@/views/Main/Dashboard/Chat/CenterContent/MessageList/AdMessage.vue'
import FacebookPost from '@/views/Main/Dashboard/Chat/CenterContent/MessageList/FacebookPost.vue'

import type { MessageInfo } from '@/service/interface/app/message'
import type { CbError } from '@/service/interface/function'
import type { DebouncedFunc } from 'lodash'

/**dữ liệu từ socket */
interface CustomEvent extends Event {
    detail?: MessageInfo
}

const conversationStore = useConversationStore()
const messageStore = useMessageStore()

/**danh sách tin nhắn hiện tại */
const list_message = ref<MessageInfo[]>([])
/**có đang load tin nhắn hay không */
const is_loading = ref(false)
/**gắn cờ đã load hết dữ liệu */
const is_done = ref(false)
/**phân trang */
const skip = ref(0)
/**phân trang */
const LIMIT = 20
/**giá trị scroll_height trước đó của danh sách tin nhắn */
let old_scroll_height = ref(0)
/**danh sách các hàm debounce cho từng staff */
const list_debounce_staff = ref<{
    [index: string]: DebouncedFunc<any>
}>({})

watch(() => conversationStore.select_conversation, (new_val, old_val) => {
    // * reset danh sách tin nhắn khi đổi khách hàng
    list_message.value = []

    // * reset danh sách tin nhắn chờ
    messageStore.send_message_list = []

    // reset cờ đã load hết dữ liệu
    is_done.value = false

    // reset phân trang
    skip.value = 0

    getListMessage(true)
})

onMounted(() => window.addEventListener(
    'chatbox_socket_message',
    onRealtimeHandleMessage
))
onUnmounted(() => window.removeEventListener(
    'chatbox_socket_message',
    onRealtimeHandleMessage
))

/**phân tích tên nv từ meta */
function parserStaffName(meta?: string) {
    return meta?.split('__')?.[1] || ''
}
/**xử lý socket message */
function onRealtimeHandleMessage({ detail }: CustomEvent) {
    if (!detail) return

    // nếu không phải của khách hàng đang chọn thì chặn
    if (
        detail.fb_page_id !== conversationStore.select_conversation?.fb_page_id ||
        detail.fb_client_id !== conversationStore.select_conversation.fb_client_id
    ) return

    // thêm tin nhắn vào danh sách
    list_message.value.push(detail)

    // xử lý khi gặp trường hợp phát hiện tin nhắn chờ
    if (detail?.message_mid) remove(
        messageStore.send_message_list,
        message => message.message_id === detail?.message_mid
    )

    scrollToBottomMessage()
}
/**load thêm dữ liệu khi lăn chuột lên trên */
function loadMoreMessage($event: Event) {
    /**div chưa danh sách tin nhắn */
    const LIST_MESSAGE = $event?.target as HTMLElement

    if (!LIST_MESSAGE) return

    /**giá trị scroll top hiện tại */
    const SCROLL_TOP = LIST_MESSAGE?.scrollTop

    /**
     * nếu là dt, thì khi scroll lên trên cùng, sẽ dùng thủ thuật này, để hạn
     * chế không cho phép giá trị scroll thành số âm, gây ra bug bị trắng màn hình
     */
    if (isNotPc() && SCROLL_TOP <= 0 && !is_done.value) {
        // tắt scroll
        LIST_MESSAGE.style.overflowY = 'hidden'

        // bật scroll lại ngay sau đó
        setTimeout(() => LIST_MESSAGE.style.overflowY = 'auto')
    }

    // nếu đang chạy hoặc đã hết dữ liệu thì thôi
    if (is_loading.value || is_done.value) return

    // nếu là dt thì phải chạm đỉnh mới load tiếp dữ liệu
    if (isNotPc() && SCROLL_TOP === 0) getListMessage()

    // các thiết bị còn lại thì cho phép infinitve loading scroll
    if (!isNotPc() && SCROLL_TOP < 300) getListMessage()
}
/**đọc danh sách tin nhắn */
function getListMessage(is_scroll?: boolean) {
    /**id tin nhắn trên đầu của lần loading trước */
    let old_first_message_id = list_message.value?.[0]?._id

    flow([
        // * bật loading
        (cb: CbError) => {
            is_loading.value = true

            cb()
        },
        // * đọc dữ liệu từ api
        (cb: CbError) => read_message(
            {
                page_id: conversationStore.select_conversation?.fb_page_id,
                client_id: conversationStore.select_conversation?.fb_client_id,
                skip: skip.value,
                limit: LIMIT
            },
            (e, r) => {
                if (e) return cb(e)
                if (!r || !r.length) {
                    // gắn cờ đã load hết dữ liệu
                    is_done.value = true

                    return cb()
                }

                // đảo chiều mảng
                r.reverse()

                // thêm dữ liệu đã đảo chiều lên đầu
                list_message.value.unshift(...r)

                // trang tiếp theo
                skip.value += LIMIT

                cb()
            },
        ),
        // * làm cho scroll to top mượt hơn
        (cb: CbError) => {
            // nếu là điện thoại thì scroll đến phần tử cuối cùng trước đó
            if (
                isNotPc() &&
                old_first_message_id
            ) nextTick(
                () => document
                    .getElementById(old_first_message_id)
                    ?.scrollIntoView()
            )

            // nếu là các thiết bị khác thì chạy infinitve loading scroll
            if (!isNotPc()) nextTick(() => {
                // lấy div chưa danh sách tin nhắn
                const LIST_MESSAGE = document.getElementById('list-message')

                if (!LIST_MESSAGE) return

                // nếu có scroll height, thì scroll lại div cho về đúng giá trị trước -> gần như mượt
                if (old_scroll_height.value) LIST_MESSAGE.scrollTop =
                    LIST_MESSAGE.scrollHeight -
                    old_scroll_height.value
                    + LIST_MESSAGE.scrollTop

                // lấy giá trị mới 
                old_scroll_height.value = LIST_MESSAGE.scrollHeight
            })

            cb()
        }
    ], e => {
        // tắt loading
        is_loading.value = false

        // load lần đầu thì tự động cuộn xuống
        if (is_scroll) {
            /**
             * nếu không phải mobile, thì chạy logic infinitve loading scroll 
             * lần đầu tiên load tin nhắn, mà phát hiện tin nhắn vẫn còn,
             * thì load thêm 1 lần tin nhắn nữa, để tránh lỗi scroll không mượt
             */
            if (!isNotPc() && list_message.value.length >= LIMIT) getListMessage()

            scrollToBottomMessage()

            setTimeout(() => scrollToBottomMessage(), 500)
        }

        if (e) return toastError(e)
    })
}
/**
 * chỉ hiển thị avatar khách hàng đã đọc đến tin nhắn đầu tiên
 * vì cùng mội thời điểm sẽ có nhiều div thoả mãn điều kiện gửi event
 * nên sử dụng debounce để chỉ chạy event cuối cùng, tránh bị lặp code
 */
const visibleFirstClientReadAvatar = debounce(() => {
    const FIRST_AVATAR = document.querySelector('.mesage-client-read') as HTMLElement

    if (!FIRST_AVATAR) return

    // thêm css để hiển thị
    FIRST_AVATAR.style.display = 'block'
}, 50)
/**
 * chỉ hiển thị avatar nhân viên đã đọc tin nhắn cuối cùng
 * vì cùng mội thời điểm sẽ có nhiều div thoả mãn điều kiện gửi event
 * nên sử dụng debounce để chỉ chạy event cuối cùng, tránh bị lặp code
 */
function visibleLastStaffReadAvatar(staff_id: string) {
    // init hàm debounce cho từng staff nếu không tồn tại
    if (!list_debounce_staff.value[staff_id])
        list_debounce_staff.value[staff_id] = debounce(doVisibleAvatar, 50)

    // chạy hàm debounce
    list_debounce_staff.value[staff_id](staff_id)

    /**hiển thị avatar staff cuối cùng */
    function doVisibleAvatar(staff_id: string) {
        /**toàn bộ các div avatar */
        const LIST_AVATAR: HTMLElement[] = Array.from(
            document.querySelectorAll(`.message-staff-read-${staff_id}`)
        )

        // lặp qua toàn bộ các div
        LIST_AVATAR.forEach((element: any, i: number) => {
            // reset ẩn toàn bộ các avatar hiện tại
            if (i < LIST_AVATAR.length - 1) element.style.display = 'none'
            // chỉ hiển thị avatar cuối cùng
            else element.style.display = 'block'
        })
    }
}
</script>