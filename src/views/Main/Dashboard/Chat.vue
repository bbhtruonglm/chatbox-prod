<template>
    <div class="w-full h-full pt-[65px] md:pt-8 xl:pt-0 md:flex relative">
        <LeftBar />
        <CenterContent />
        <RightBar />
    </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { checkPricingValid } from '@/service/helper/pricing'
import { useRouter } from 'vue-router'
import { useChatbotUserStore, usePageStore, useConversationStore, useCommonStore } from '@/stores'
import { flow, toggle_loading } from '@/service/helper/async'
import { get_page_info_to_chat } from '@/service/api/chatbox/n4-service'
import { difference, intersection, keys, map, size } from 'lodash'
import { useI18n } from 'vue-i18n'
import { create_token_app_installed } from '@/service/api/chatbox/n5-app'
import { ping as ext_ping, listen as ext_listen } from '@/service/helper/ext'
import { update_info_conversation } from '@/service/api/chatbox/n4-service'
import { getPageInfo, getPageWidget, isNotPc } from '@/service/function'
import { getItem } from '@/service/helper/localStorage'

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
const commonStore = useCommonStore()
const { t: $t } = useI18n()

/**kết nối socket đến server */
const socket_connection = ref<WebSocket>()
/**gắn cờ đóng kết nối hoàn toàn */
const is_force_close_socket = ref(false)

watch(() => conversationStore.select_conversation, () => getTokenOfWidget())

onMounted(() => {
    getPageInfoToChat()

    initExtensionLogic()
})
// tiêu huỷ kết nối socket khi thoát khỏi component này
onUnmounted(() => closeSocketConnect())

/**gắn cờ nếu ext được kích hoạt + xử lý các logic */
function initExtensionLogic() {
    // chỉ chạy ở trên máy tính web
    if (isNotPc()) return

    /**số lần đã ping ext */
    let count_check = 0

    /**ping qua ext để check tồn tại */
    const LOOP_ID = setInterval(() => {
        count_check++

        // dừng nếu quá số lần hoặc đã phát hiện
        if (
            commonStore.is_active_extension ||
            count_check >= 10
        ) return clearInterval(LOOP_ID)

        // gọi ext
        ext_ping()
    }, 500)

    // lắng nghe ext gửi thông điệp
    ext_listen((event, e, r) => {
        // đánh dấu đã phát hiện ext
        if (event === 'EXTENSION_INSTALLED') {
            // gắn cờ phát hiện ext
            commonStore.is_active_extension = true

            // gắn cờ force all tin nhắn qua ext
            if (r?.force_send_message_over_inbox)
                commonStore.force_send_message_over_inbox = true
        }

        // nếu nhận được thông tin cá nhân của hội thoại thì update uid
        if (
            event === 'GET_FB_USER_INFO' &&
            r?.page_id && r?.client_id && r?.id
        ) {
            /**obj dữ liệu uid */
            const client_bio = { fb_uid: r?.id }

            // ghi dữ liệu vào mảng
            if (conversationStore.conversation_list[r?.client_id])
                conversationStore.conversation_list[r?.client_id].client_bio = client_bio

            // ghi dữ liệu vào user hiện tại đang chọn
            if (
                conversationStore.select_conversation &&
                conversationStore.select_conversation?.fb_client_id === r?.client_id
            ) conversationStore.select_conversation.client_bio = client_bio

            // cập nhật data lên server
            update_info_conversation({
                page_id: r?.page_id,
                client_id: r?.client_id,
                fb_uid: r?.id
            }, (e, r) => { })
        }
    })
}
/**khởi tạo token cho widget */
function getTokenOfWidget() {
    const PAGE_ID = conversationStore.select_conversation?.fb_page_id

    if (!PAGE_ID) return

    /**danh sách id widget */
    let list_app_installed_id: {
        // app_installed_id: app_id
        [index: string]: string
    } = {}

    // khởi tạo dữ liệu
    getPageWidget(PAGE_ID)
        ?.filter(widget => widget.active_widget)
        ?.map(widget => {
            list_app_installed_id[widget._id] = widget.app_id
        })

    create_token_app_installed({
        page_id: PAGE_ID,
        list_app_installed_id,
        payload: {
            fb_client_id: conversationStore.select_conversation?.fb_client_id,
            page_name: getPageInfo()?.name,
            current_staff_id: chatbotUserStore.chatbot_user?.fb_staff_id,
            current_staff_name: chatbotUserStore.chatbot_user?.full_name
        }
    }, (e, r: any) => {
        if (e) return

        conversationStore.list_widget_token = r
    })
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
        // * đọc dữ liệu trang từ server
        (cb: CbError) => get_page_info_to_chat(
            keys(pageStore.selected_page_id_list),
            (e, r) => {
                if (e) return cb(e)
                if (!r) return cb($t('v1.view.main.dashboard.chat.error.get_page_info'))

                pageStore.selected_page_list_info = r
                intergrateChatV1()
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
/**lưu trữ một số dữ liệu giống bản v1, để không cần phải sửa nhiều code */
function intergrateChatV1() {
    /**dữ liệu fake v1 */
    let temp: any = {}

    // format dữ liệu giống v1
    map(pageStore.selected_page_list_info, (data, page_id) => {
        temp[page_id] = {
            name: data.page?.name,
            page_id: data.current_staff?.fb_page_id,
            fb_as_id: data.current_staff?.fb_staff_id,
            isAdmin: !(
                !data?.group_admin_id ||
                !data?.current_staff?.group_staff ||
                !data?.current_staff?.group_staff?.includes(data?.group_admin_id)
            ),
            fb_page_token: data.page?.fb_page_token,
            type: data.page?.type
        }
    })

    // sử dụng thư viện của bản v1, nên không ép kiểu nữa
    // @ts-ignore
    ldb.set('storage-token__Pages', JSON.stringify(temp))

    // dữ liệu local của v1
    localStorage.setItem('vuex', JSON.stringify({
        login: { token: getItem('access_token') }
    }))
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
        conversationStore.option_filter_page_data.is_spam_fb === 'YES' &&
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