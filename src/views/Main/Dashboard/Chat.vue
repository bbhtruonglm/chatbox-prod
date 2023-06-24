<template>
    <div class="w-full h-full pt-[65px] md:pt-8 xl:pt-4">
        <div id="chat-conversation" class="bg-white md:w-[300px]">
            <div class="pl-14 pr-4 md:pl-4 flex items-center">
                <div @click="filter_modal_ref?.toggleModal()" class="cursor-pointer">
                    <img src="@/assets/icons/filter.svg" width="23" height="23">
                </div>
                <div class="flex items-center ml-4 w-full justify-between">
                    <span v-if="!is_show_search" class="font-medium text-2xl">
                        {{ $t('v1.common.chatbox') }}
                    </span>
                    <input class="h-[32px] w-full px-2" v-if="is_show_search" type="text"
                        :placeholder="$t('v1.view.main.dashboard.chat.search')">
                    <div @click="is_show_search = !is_show_search" class="cursor-pointer">
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
    </template>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { checkPricingValid } from '@/service/helper/pricing'
import { useRouter } from 'vue-router'
import { useChatbotUserStore, usePageStore } from '@/stores'
import { flow, toggle_loading } from '@/service/helper/async'
import { get_page_info_to_chat } from '@/service/api/chatbox/n4-service'
import { keys, size } from 'lodash'
import { useI18n } from 'vue-i18n'

import UserOnline from '@/views/Main/Dashboard/Chat/UserOnline.vue'
import Conversation from '@/views/Main/Dashboard/Chat/Conversation.vue'
import FilterModal from '@/views/Main/Dashboard/Chat/FilterModal.vue'

import type { CbError } from '@/service/interface/function'
import type { ComponentRef } from '@/service/interface/vue'
import type { StaffSocket } from '@/service/interface/app/staff'

const $router = useRouter()
const pageStore = usePageStore()
const chatbotUserStore = useChatbotUserStore()
const { t: $t } = useI18n()

/**ref của modal filter */
const filter_modal_ref = ref<ComponentRef>()
/**có hiển thị tìm kiếm hay không */
const is_show_search = ref(false)
const socket_connection = ref<WebSocket>()

onMounted(() => getPageInfoToChat())
onUnmounted(() => closeSocketConnect())

/**đọc dữ liệu của các page được chọn lưu lại */
function getPageInfoToChat() {
    flow([
        // * delay để load dữ liệu từ local vào store
        (cb: CbError) => setTimeout(() => cb(), 200),
        // * đọc dữ liệu các page được chọn để chat
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

        // khởi tạo lại kết nối sau 100s
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

        let socket_data: {
            conversation?: {}
            message?: {}
            staff?: StaffSocket
        } = {}
        try { socket_data = JSON.parse(data) } catch (e) { }

        if (!size(socket_data)) return

        let { staff, conversation, message } = socket_data

        // gửi thông điệp đến component xử lý user online
        if (size(staff)) window.dispatchEvent(new CustomEvent(
            'chatbox_socket_staff',
            { detail: staff }
        ))

        /**
         * TODO nếu đang kích hoạt lọc loại tin nhắn
         * - chặn socket nếu đang lọc mess mà về post
         * - chặn socket nếu đang lọc post mà về mess
         */
    }
}
/**đóng kết nối socket */
function closeSocketConnect() {
    socket_connection.value?.close()
}
</script>