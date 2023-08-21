<template>
    <div class="w-full h-full pt-[65px] md:pt-8 xl:pt-4">
        <div id="chat-conversation" class="bg-white md:w-[350px]">
            <div class="pl-14 pr-4 md:pl-4 flex items-center">
                <div @click="openConversationFilter()" class="cursor-pointer">
                    <img v-if="isFilterActive()" src="@/assets/icons/filter-active.svg" width="23" height="23">
                    <img v-else src="@/assets/icons/filter.svg" width="23" height="23">
                </div>
                <div class="flex items-center ml-4 w-full justify-between">
                    <span v-if="!is_show_search" class="font-medium text-2xl">
                        {{ $t('v1.common.chatbox') }}
                    </span>
                    <input v-model="search_conversation" @keyup="onSearchConversation" ref="search_conversation_input"
                        class="h-[32px] w-full px-2" v-if="is_show_search" type="text"
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
    </div>
    <template>
        <FilterModal ref="filter_modal_ref" />
        <StaffInfoModal />
    </template>
</template>

<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref } from 'vue'
import { checkPricingValid } from '@/service/helper/pricing'
import { useRouter } from 'vue-router'
import { useChatbotUserStore, usePageStore, useConversationStore } from '@/stores'
import { flow, toggle_loading } from '@/service/helper/async'
import { get_page_info_to_chat } from '@/service/api/chatbox/n4-service'
import { debounce, identity, isEqual, keys, omit, pickBy, size } from 'lodash'
import { useI18n } from 'vue-i18n'
import { teleportModelFilterOnPcScreen } from '@/service/function'

import UserOnline from '@/views/Main/Dashboard/Chat/UserOnline.vue'
import Conversation from '@/views/Main/Dashboard/Chat/Conversation.vue'
import FilterModal from '@/views/Main/Dashboard/Chat/FilterModal.vue'
import StaffInfoModal from '@/views/Main/Dashboard/Chat/StaffInfoModal.vue'

import type { CbError } from '@/service/interface/function'
import type { ComponentRef } from '@/service/interface/vue'
import type { StaffSocket } from '@/service/interface/app/staff'

const $router = useRouter()
const pageStore = usePageStore()
const chatbotUserStore = useChatbotUserStore()
const conversationStore = useConversationStore()
const { t: $t } = useI18n()

/**giá trị của ô tìm kiếm hội thoại */
const search_conversation = ref<string>()
/**ref của modal filter */
const filter_modal_ref = ref<ComponentRef>()
/**có hiển thị tìm kiếm hay không */
const is_show_search = ref(false)
/**lưu lại kết nối socket */
const socket_connection = ref<WebSocket>()
/**ref của input tìm kiếm hội thoại */
const search_conversation_input = ref<ComponentRef>()

onMounted(() => {
    if (conversationStore.option_filter_page_data.search) {
        // load giá trị search được lưu từ local vào biến khi load lại trang
        search_conversation.value = conversationStore.option_filter_page_data.search

        // hiện input tìm kiếm
        is_show_search.value = true
    }

    getPageInfoToChat()
})
onUnmounted(() => closeSocketConnect())

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
/**đọc dữ liệu của các page được chọn lưu lại */
function getPageInfoToChat() {
    flow([
        // * delay để load dữ liệu từ local vào store
        (cb: CbError) => setTimeout(() => cb(), 200),
        // * đọc dữ liệu các page được chọn để chat
        (cb: CbError) => {
            if (!size(pageStore.selected_page_id_list)) {
                toggle_loading(false)
                return $router.push('/main/dashboard')
            }

            cb()
        },
        (cb: CbError) => get_page_info_to_chat(
            keys(pageStore.selected_page_id_list),
            (e, r) => {
                if (e) return cb(e)
                if (!r) return cb($t('v1.view.main.dashboard.chat.error.get_page_info'))

                pageStore.selected_page_list_info = r
                cb()
            }
        ),
        // * kiểm tra các page được chọn có thoả mãn điều kiện gói hay không
        (cb: CbError) => checkPricingValid((e, r) => {
            if (e) {
                toggle_loading(false)
                return $router.push('/main/dashboard')
            }

            cb()
        }, true),
        (cb: CbError) => {
            onSocketFromChatboxServer()

            cb()
        }
    ], undefined, true)
}
/**lắng nghe sự kiện từ socket */
function onSocketFromChatboxServer() {
    /**tạo kết nối đến socket */
    const CONNECTION = new WebSocket($env.host.n3_socket)
    socket_connection.value = CONNECTION
    /**lưu lại id vòng lặp ping */
    let ping_interval_id: number

    // khi kết nối thành công
    CONNECTION.onopen = () => {
        // gửi danh sách page lên socket
        CONNECTION.send(JSON.stringify({
            list_page: keys(pageStore.selected_page_id_list),
            fb_staff_id: chatbotUserStore.chatbot_user?.fb_staff_id
        }))

        // tự động ping socket liên tục - 30s
        ping_interval_id = setInterval(() => CONNECTION.send('ping'), 1000 * 30)
    }

    // khi kết nối bị đóng
    CONNECTION.onclose = () => {
        // loại bỏ vòng lặp tự động ping socket cũ
        clearInterval(ping_interval_id)

        // khởi tạo lại kết nối sau 100ms
        setTimeout(() => onSocketFromChatboxServer(), 100)
    }

    // nếu có lỗi xảy ra
    CONNECTION.onerror = () => {
        // đóng kết nối đến socket
        CONNECTION.close()
    }

    // khi có thông điệp từ socket gửi xuống
    CONNECTION.onmessage = ({ data }) => {
        if (!data || data === 'pong') return

        /**dữ liệu socket nhận được */
        let socket_data: {
            /**dữ liệu của khách hàng */
            conversation?: {}
            /**dữ liệu tin nhắn */
            message?: {}
            /**dữ liệu nhân viên */
            staff?: StaffSocket
        } = {}

        // cố gắng giải mã dữ liệu
        try { socket_data = JSON.parse(data) } catch (e) { }

        if (!size(socket_data)) return

        let { staff, conversation, message } = socket_data

        // gửi thông điệp đến component xử lý user online
        if (size(staff)) window.dispatchEvent(new CustomEvent(
            'chatbox_socket_staff',
            { detail: staff }
        ))

        // gửi thông điệp đến component xử lý user online
        if (size(conversation)) window.dispatchEvent(new CustomEvent(
            'chatbox_socket_conversation',
            { detail: conversation }
        ))
    }
}
/**đóng kết nối socket */
function closeSocketConnect() {
    socket_connection.value?.close()
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