<template>
    <div @scroll="loadMoreMessage" id="list-message"
        class="pt-0 p-2 h-[calc(100%_-_150px)] overflow-hidden overflow-y-auto">
        <div v-if="is_loading" class="relative">
            <div class="fixed left-[50%] translate-x-[-50%]">
                <Loading class="mx-auto" />
            </div>
        </div>
        <div v-for="message of list_message" :id="message._id" class="pt-2 pr-5 mb-1 relative">
            <div v-if="message.message_type === 'client'" class="w-fit max-w-[370px]">
                <ClientTextMessage v-if="message.message_text" :text="message.message_text" />
                <UnsupportMessage v-else />
                <MessageDate class="text-right" :time="message.time" />
            </div>
            <div v-else-if="message.message_type === 'page'" class="flex flex-col items-end">
                <div class="w-fit max-w-[370px]">
                    <PageTextMessage v-if="message.message_text" :text="message.message_text" />
                    <UnsupportMessage v-else />
                    <MessageDate :time="message.time" />
                </div>
            </div>
            <div v-else-if="message.message_type === 'note'" class="flex flex-col items-end">
                <div class="w-fit max-w-[370px]">
                    <NoteMessage v-if="message.message_text" :text="message.message_text" />
                    <UnsupportMessage v-else />
                    <MessageDate :time="message.time" />
                </div>
            </div>
            <div v-else-if="message.message_type === 'system'" class="flex justify-center">
                <div class="w-[70%] text-center">
                    <SystemMessage v-if="message.message_text" :text="message.message_text" />
                    <UnsupportMessage v-else />
                </div>
            </div>
            <div v-else class="text-center flex justify-center">
                <UnsupportMessage class="w-[70%]" />
            </div>
            <ClientRead @change_last_read_message="visibleFirstClientReadAvatar" :time="message.time" />
            <StaffRead @change_last_read_message="visibleLastStaffReadAvatar" :time="message.time" />
        </div>
    </div>
</template>
<script setup lang="ts">
import { nextTick, ref, watch } from 'vue'
import { useConversationStore } from '@/stores'
import { flow } from '@/service/helper/async'
import { read_message } from '@/service/api/chatbox/n4-service'
import { toastError } from '@/service/helper/alert'
import { isMobile } from '@/service/function'
import { debounce } from 'lodash'

import Loading from '@/components/Loading.vue'
import MessageDate from '@/views/Main/Dashboard/Chat/CenterContent/MessageList/MessageDate.vue'
import UnsupportMessage from '@/views/Main/Dashboard/Chat/CenterContent/MessageList/UnsupportMessage.vue'
import ClientTextMessage from '@/views/Main/Dashboard/Chat/CenterContent/MessageList/ClientTextMesage.vue'
import PageTextMessage from '@/views/Main/Dashboard/Chat/CenterContent/MessageList/PageTextMessage.vue'
import SystemMessage from '@/views/Main/Dashboard/Chat/CenterContent/MessageList/SystemMessage.vue'
import NoteMessage from '@/views/Main/Dashboard/Chat/CenterContent/MessageList/NoteMessage.vue'
import ClientRead from '@/views/Main/Dashboard/Chat/CenterContent/MessageList/ClientRead.vue'
import StaffRead from '@/views/Main/Dashboard/Chat/CenterContent/MessageList/StaffRead.vue'

import type { MessageInfo } from '@/service/interface/app/message'
import type { CbError } from '@/service/interface/function'
import type { DebouncedFunc } from 'lodash'

const conversationStore = useConversationStore()

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

    // reset cờ đã load hết dữ liệu
    is_done.value = false

    // reset phân trang
    skip.value = 0

    getListMessage(true)
})

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
    if (isMobile() && SCROLL_TOP <= 0) {
        // tắt scroll
        LIST_MESSAGE.style.overflowY = 'hidden'

        // bật scroll lại ngay sau đó
        setTimeout(() => LIST_MESSAGE.style.overflowY = 'auto')
    }

    // nếu đang chạy hoặc đã hết dữ liệu thì thôi
    if (is_loading.value || is_done.value) return

    // nếu là dt thì phải chạm đỉnh mới load tiếp dữ liệu
    if (isMobile() && SCROLL_TOP === 0) getListMessage()

    // các thiết bị còn lại thì cho phép infinitve loading scroll
    if (!isMobile() && SCROLL_TOP < 300) getListMessage()
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
                isMobile() &&
                old_first_message_id
            ) nextTick(
                () => document
                    .getElementById(old_first_message_id)
                    ?.scrollIntoView()
            )

            // nếu là các thiết bị khác thì chạy infinitve loading scroll
            if (!isMobile()) nextTick(() => {
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
            if (!isMobile() && list_message.value.length >= LIMIT) getListMessage()

            scrollToBottomMessage()
        }

        if (e) return toastError(e)
    })
}
/**cuộn xuống cuối trang */
function scrollToBottomMessage() {
    const LIST_MESSAGE = document.getElementById('list-message')

    if (!LIST_MESSAGE) return

    // html được render thì mới cuộn
    nextTick(() => {
        LIST_MESSAGE.scrollTop = LIST_MESSAGE.scrollHeight
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