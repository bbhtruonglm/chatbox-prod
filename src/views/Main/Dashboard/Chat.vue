<template>
    <div class="w-full h-full pt-[65px] md:pt-8 xl:pt-0 md:flex relative">
        <LeftBar />
        <CenterContent />
        <RightBar />
    </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { checkPricingValid } from '@/service/helper/pricing'
import { useRouter } from 'vue-router'
import { useChatbotUserStore, usePageStore, useConversationStore } from '@/stores'
import { flow, toggle_loading } from '@/service/helper/async'
import { get_page_info_to_chat } from '@/service/api/chatbox/n4-service'
import { difference, intersection, keys, size } from 'lodash'
import { useI18n } from 'vue-i18n'

import LeftBar from '@/views/Main/Dashboard/Chat/LeftBar.vue'
import CenterContent from '@/views/Main/Dashboard/Chat/CenterContent.vue'
import RightBar from '@/views/Main/Dashboard/Chat/RightBar.vue'

import type { CbError } from '@/service/interface/function'
import type { StaffSocket } from '@/service/interface/app/staff'
import type { MessageInfo } from '@/service/interface/app/message'
import type { ConversationInfo } from '@/service/interface/app/conversation'
import type { SocketEvent } from '@/service/interface/app/common'

const $router = useRouter()
const pageStore = usePageStore()
const chatbotUserStore = useChatbotUserStore()
const conversationStore = useConversationStore()
const { t: $t } = useI18n()

/**kết nối socket đến server */
const socket_connection = ref<WebSocket>()
/**gắn cờ đóng kết nối hoàn toàn */
const is_force_close_socket = ref(false)

onMounted(() => {
    getPageInfoToChat()
})
// tiêu huỷ kết nối socket khi thoát khỏi component này
onUnmounted(() => closeSocketConnect())

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
        // * khởi tạo kết nối socket lên server
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

        // nếu đóng kết hoàn toàn thì không cho kết nối tự mở lại nữa
        if (is_force_close_socket.value) return

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
            conversation?: ConversationInfo
            /**dữ liệu tin nhắn */
            message?: MessageInfo
            /**dữ liệu nhân viên */
            staff?: StaffSocket
            /**tên sự kiện */
            event?: SocketEvent
        } = {}

        // cố gắng giải mã dữ liệu
        try { socket_data = JSON.parse(data) } catch (e) { }

        if (!size(socket_data)) return

        let { staff, conversation, message, event } = socket_data

        // gửi thông điệp đến component xử lý user online
        if (size(staff)) window.dispatchEvent(new CustomEvent(
            'chatbox_socket_staff',
            { detail: staff }
        ))

        // gửi thông điệp đến component xử lý danh sách hội thoại
        if (
            validateConversation(conversation, message)
        ) window.dispatchEvent(new CustomEvent(
            'chatbox_socket_conversation',
            {
                detail: {
                    conversation,
                    event
                }
            }
        ))

        // gửi thông điệp đến component xử lý hiển thị danh sách tin nhắn
        if (size(message)) window.dispatchEvent(new CustomEvent(
            'chatbox_socket_message',
            { detail: message }
        ))
    }
}
/**kiểm tra hội thoại có thoả mãn diều kiện lọc để được xuất hiện không */
function validateConversation(
    conversation?: ConversationInfo,
    message?: MessageInfo
) {
    // nêu không có dữ liệu hội thoại thì chặn
    if (!conversation || !size(conversation)) return

    // đang lọc inbox thì không cho post qua
    if (
        conversationStore.option_filter_page_data.display_style === 'INBOX' &&
        message?.platform_type === 'FB_POST'
    ) return

    // đang lọc post thì không cho inbox qua
    if (
        conversationStore.option_filter_page_data.display_style === 'COMMENT' &&
        message?.platform_type === 'FB_MESS'
    ) return

    // lọc theo search: tên, sdt, email
    if (
        conversationStore.option_filter_page_data.search &&
        (
            !conversation.client_name ||
            !new RegExp(conversationStore.option_filter_page_data.search, 'i').test(conversation.client_name)
        ) &&
        (
            !conversation.client_phone ||
            !new RegExp(conversationStore.option_filter_page_data.search, 'i').test(conversation.client_phone)
        ) &&
        (
            !conversation.client_email ||
            !new RegExp(conversationStore.option_filter_page_data.search, 'i').test(conversation.client_email)
        )
    ) return

    // lọc có sdt
    if (
        conversationStore.option_filter_page_data.have_phone === 'YES' &&
        !conversation.client_phone
    ) return

    // lọc không có sdt
    if (
        conversationStore.option_filter_page_data.have_phone === 'NO' &&
        conversation.client_phone
    ) return

    // lọc theo thời gian
    if (
        !conversation.last_message_time ||
        (
            conversationStore.option_filter_page_data.time_range?.lte &&
            conversationStore.option_filter_page_data.time_range?.lte < new Date(conversation.last_message_time).getTime()
        ) ||
        (
            conversationStore.option_filter_page_data.time_range?.gte &&
            conversationStore.option_filter_page_data.time_range?.gte > new Date(conversation.last_message_time).getTime()
        )
    ) return

    // lọc theo nhân viên
    if (
        conversationStore.option_filter_page_data.staff_id &&
        (
            !conversation.fb_staff_id ||
            !conversationStore.option_filter_page_data.staff_id.includes(conversation.fb_staff_id)
        )
    ) return

    // lọc nhãn hoặc
    if (
        conversationStore.option_filter_page_data.label_id &&
        !conversationStore.option_filter_page_data.label_and &&
        !intersection(
            conversationStore.option_filter_page_data.label_id,
            conversation.label_id
        ).length
    ) return

    // lọc nhãn và
    if (
        conversationStore.option_filter_page_data.label_id &&
        conversationStore.option_filter_page_data.label_and &&
        (
            !conversation.label_id ||
            !conversation.label_id.length ||
            difference(
                conversationStore.option_filter_page_data.label_id,
                conversation.label_id
            ).length
        )
    ) return

    // lọc loại trừ nhãn
    if (
        conversationStore.option_filter_page_data.not_label_id &&
        intersection(
            conversationStore.option_filter_page_data.not_label_id,
            conversation.label_id
        ).length
    ) return

    // lọc khách spam
    if (
        conversationStore.option_filter_page_data.is_spam_fb &&
        !conversation.is_spam_fb
    ) return

    // lọc hội thoại chưa gắn nhãn
    if (
        conversationStore.option_filter_page_data.not_exist_label &&
        size(conversation.label_id)
    ) return

    return true
}
/**đóng kết nối socket */
function closeSocketConnect() {
    // gắn cờ ngăn chặn kết nối mở lại
    is_force_close_socket.value = true

    socket_connection.value?.close()
}
</script>