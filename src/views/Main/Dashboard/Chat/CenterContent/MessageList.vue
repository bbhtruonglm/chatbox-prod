<template>
    <div @scroll="loadMoreMessage" id="list-message" class="p-2 h-[calc(100%_-_150px)] overflow-hidden overflow-y-auto">
        <div v-if="is_loading" class="relative">
            <div class="fixed left-[50%] translate-x-[-50%]">
                <Loading class="mx-auto" />
            </div>
        </div>
        <template v-for="message of list_message">
            <template v-if="message.message_type === 'client'">
                <ClientTextMessage v-if="message.message_text" :text="message.message_text" :time="message.time" />
                <ClientTextMessage v-else text="Nội dung tin nhắn này chưa được hỗ trợ" :time="message.time" />
            </template>

            <template v-if="message.message_type === 'page'">
                <PageTextMessage v-if="message.message_text" :text="message.message_text" :time="message.time" />
                <PageTextMessage v-else text="Nội dung tin nhắn này chưa được hỗ trợ" :time="message.time" />
            </template>
            <!-- <PageTextMessagePrivate :text="random_sentence(1, 5)" :time="message.time" /> -->
            <!-- <SystemMessage :text="random_sentence(10, 15)" /> -->
        </template>
    </div>
</template>
<script setup lang="ts">
import { nextTick, ref, watch } from 'vue'
import { useConversationStore } from '@/stores'
import { flow } from '@/service/helper/async'
import { read_message } from '@/service/api/chatbox/n4-service'
import { toastError } from '@/service/helper/alert'

import Loading from '@/components/Loading.vue'
import ClientTextMessage from '@/views/Main/Dashboard/Chat/CenterContent/MessageList/ClientTextMesage.vue'
import PageTextMessage from '@/views/Main/Dashboard/Chat/CenterContent/MessageList/PageTextMessage.vue'
import SystemMessage from '@/views/Main/Dashboard/Chat/CenterContent/MessageList/SystemMessage.vue'
import PageTextMessagePrivate from '@/views/Main/Dashboard/Chat/CenterContent/MessageList/PageTextMessagePrivate.vue'

import type { MessageInfo } from '@/service/interface/app/message'
import type { CbError } from '@/service/interface/function'

const conversationStore = useConversationStore()

/**danh sách tin nhắn hiện tại */
const list_message = ref<MessageInfo[]>([])
/**có đang load tin nhắn hay không */
const is_loading = ref(false)
/**gắn cờ đã load hết dữ liệu */
const is_done = ref(false)
/**phân trang */
const skip = ref(0)
/**giá trị scroll_height trước đó của danh sách tin nhắn */
const old_scroll_height = ref(0)

watch(() => conversationStore.select_conversation, () => {
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
    const SCROLL_TOP = ($event?.target as HTMLElement)?.scrollTop

    if (
        is_loading.value ||
        SCROLL_TOP > 100 ||
        is_done.value
    ) return

    console.log('hey', SCROLL_TOP)

    getListMessage()
}
/**đọc danh sách tin nhắn */
function getListMessage(is_scroll?: boolean) {
    /**phân trang */
    const LIMIT = 20

    flow([
        // * bật loading
        (cb: CbError) => {
            is_loading.value = true

            cb()
        },
        // * đọc dữ liệu từ api
        (cb: CbError) => read_message(
            {
                page_id: conversationStore.select_conversation.fb_page_id,
                client_id: conversationStore.select_conversation.fb_client_id,
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
                list_message.value = [...r, ...list_message.value]

                // trang tiếp theo
                skip.value += LIMIT

                cb()
            },
        ),
        // * làm cho scroll to top mượt hơn
        (cb: CbError) => {
            nextTick(() => {
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
             * lần đầu tiên load tin nhắn, thì load thêm 1 lần tin nhắn nữa
             * để tránh lỗi scroll không mượt
             */
            getListMessage()

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
</script>