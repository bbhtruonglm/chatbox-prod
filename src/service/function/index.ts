import { useConversationStore, usePageStore, useCommonStore } from '@/stores'
import { isEqual, keys, size, sortBy } from 'lodash'
import { flow, toggle_loading } from '@/service/helper/async'
import { checkPricingValid } from '@/service/helper/pricing'
import { reset_read_conversation } from '../api/chatbox/n4-service'
import { toastError } from '../helper/alert'

import type { Cb, CbError } from '@/service/interface/function'
import type { ConversationInfo } from '../interface/app/conversation'
import { nextTick } from 'vue'
import type { AppInstalledInfo } from '../interface/app/widget'
import { getItem } from '../helper/localStorage'

/**kiểm tra, xử lý một số logic trước khi đi đến trang chat */
export const preGoToChat = (proceed: Cb) => {
    const pageStore = usePageStore()
    const conversationStore = useConversationStore()

    flow([
        // * kiểm tra xem page đã được chọn hay chưa
        (cb: CbError) => {
            if (!size(pageStore.selected_page_id_list))
                return cb('v1.view.main.dashboard.select_page.empty_page.title')

            cb()
        },
        // * kiểm tra các page và user hiện tại có gói hay không
        (cb: CbError) => checkPricingValid((e, r) => {
            // tắt loading
            if (e) return toggle_loading(false)

            cb()
        }),
        // * nếu danh sách page chọn thay đổi, thì xoá filter conversation
        (cb: CbError) => {
            // nếu vẫn là các page cũ đã chọn thì bỏ qua
            if (isEqual(
                sortBy(keys(pageStore.selected_page_id_list)),
                sortBy(keys(pageStore.selected_page_list_info))
            )) return cb()

            // nếu chọn khác page thì

            //  xoá lọc 
            resetConversationFilter()

            // xoá conversation đang chọn
            conversationStore.select_conversation = undefined

            cb()
        }
    ], proceed, true)
}

/**xoá lọc hội thoại */
export const resetConversationFilter = () => {
    const conversationStore = useConversationStore()

    conversationStore.option_filter_page_data = { is_spam_fb: 'NO' }
}

/**nếu là giao diện pc hoặc tablet thì không hiển thị filter full màn hình nữa */
export const teleportModelFilterOnPcScreen = () => {
    const commonStore = useCommonStore()

    // mobile thì hiển thị full
    if (window.innerWidth < 768) {
        commonStore.conversation_filter_modal_left = `0`
        commonStore.conversation_filter_modal_width = `100%`
    }
    // tablet, pc thì hiển thị nhỏ
    // đợi 1 khoảng thời gian để div gốc di chuyển đến vị trí mong muốn
    else setTimeout(() => {
        let left = document
            .getElementById('chat-conversation')
            ?.getBoundingClientRect()
            ?.left

        let width = document
            .getElementById('chat-conversation')
            ?.offsetWidth

        if (!left || !width) return

        commonStore.conversation_filter_modal_left = `${left}px`
        commonStore.conversation_filter_modal_width = `${width}px`
    }, 600)
}

/**nếu là giao diện pc hoặc tablet thì không hiển thị assign staff full màn hình nữa */
export const teleportCenterModelOnPcScreen = () => {
    const commonStore = useCommonStore()

    // mobile thì hiển thị full
    if (window.innerWidth < 768) {
        commonStore.center_modal_left = `0`
        commonStore.center_modal_width = `100%`
    }
    // tablet, pc thì hiển thị nhỏ
    // đợi 1 khoảng thời gian để div gốc di chuyển đến vị trí mong muốn
    else setTimeout(() => {
        let left = document
            .getElementById('center-content')
            ?.getBoundingClientRect()
            ?.left

        let width = document
            .getElementById('center-content')
            ?.offsetWidth

        if (!left || !width) return

        commonStore.center_modal_left = `${left}px`
        commonStore.center_modal_width = `${width}px`
    }, 600)
}

/**chọn một hội thoại */
export const selectConversation = (conversation: ConversationInfo) => {
    if (!conversation) return

    const conversationStore = useConversationStore()

    // chọn khách hàng này, lưu dữ liệu vào store
    conversationStore.select_conversation = conversation

    // đánh dấu tin nhắn là đã đọc
    reset_read_conversation({
        page_id: conversation?.fb_page_id,
        client_id: conversation?.fb_client_id,
    }, (e, r) => {
        if (e) return toastError(e)
    })

    // tự động focus vào input chat
    document.getElementById('chat-text-input-message')?.focus()
}

/**kiểm tra cỡ màn hình, từ đó suy luận ra có đang ở chế độ dt hay không */
export const isMobile = () => {
    return window.innerWidth < 768
}

/**kiểm tra cỡ màn hình có phải là máy tính bảng hay không */
export const isTablet = () => {
    return window.innerWidth >= 768 && window.innerWidth < 1280
}

/**kiểm tra cỡ màn hình không phải là pc */
export const isNotPc = () => {
    return isMobile() || isTablet()
}

/**cuộn xuống cuối trang */
export const scrollToBottomMessage = () => {
    const LIST_MESSAGE = document.getElementById('list-message')

    if (!LIST_MESSAGE) return

    // html được render thì mới cuộn
    nextTick(() => {
        LIST_MESSAGE.scrollTop = LIST_MESSAGE.scrollHeight
    })
}

/**lấy danh sách nhãn của trang */
export const getPageLabel = (page_id?: string) => {
    const pageStore = usePageStore()

    return pageStore
        .selected_page_list_info
        ?.[page_id as string]
        ?.label_list
}

/**lấy danh sách nhân viên của trang */
export const getPageStaff = (page_id?: string) => {
    const pageStore = usePageStore()

    return pageStore
        .selected_page_list_info
        ?.[page_id as string]
        ?.staff_list
}

/**lấy danh sách widget của trang */
export const getPageWidget = (page_id?: string) => {
    const pageStore = usePageStore()

    return pageStore
        .selected_page_list_info
        ?.[page_id as string]
        ?.widget_list
}

/**lấy thông tin của trang */
export const getPageInfo = (page_id?: string) => {
    const pageStore = usePageStore()

    return pageStore
        .selected_page_list_info
        ?.[page_id as string]
        ?.page
}

/**đọc dữ liệu của nhãn */
export const getLabelInfo = (page_id?: string, label_id?: string) => {
    return getPageLabel(page_id)?.[label_id as string]
}

/**lọc các nhãn chưa bị xoá */
export const getLabelValid = (page_id?: string, label_list?: string[]) => {
    return label_list?.filter(label_id => getLabelInfo(page_id, label_id))
}

/**kiểm tra staff hiện tại có phải là admin của page không */
export const isCurrentStaffIsPageAdmin = (page_id: string) => {
    const pageStore = usePageStore()

    /**dữ liệu của trang */
    const PAGE_INFO = pageStore.selected_page_list_info?.[page_id]

    // kiểm tra staff có nằm trong nhóm admin không
    if (
        !PAGE_INFO?.group_admin_id ||
        !PAGE_INFO?.current_staff?.group_staff ||
        !PAGE_INFO?.current_staff?.group_staff?.includes(PAGE_INFO?.group_admin_id)
    ) return false

    return true
}

/**khởi tạo url và token cho iframe */
export const getIframeUrl = (widget: AppInstalledInfo) => {
    const conversationStore = useConversationStore()

    const URL_APP = widget.snap_app.url_app
    const ACCESS_TOKEN = conversationStore.list_widget_token[widget._id]
    const CHATBOX_TOKEN = getItem('access_token')
    const LOCALE = localStorage.getItem('locale') || 'vn'
    const IS_PAGE_ADMIN = isCurrentStaffIsPageAdmin(widget.fb_page_id)

    return `${URL_APP}?access_token=${ACCESS_TOKEN}&locale=${LOCALE}&chatbox_token=${CHATBOX_TOKEN}&is_page_admin=${IS_PAGE_ADMIN}`
}

/**mở link tab mới */
export const openNewTab = (url: string) => {
    window.open(url, '_blank')
}

/**mở link tab mới */
export const openPopup = (url: string, width = 800, height = 600) => {
    // Tính vị trí bên trái sao cho cửa sổ nằm giữa màn hình
    var left = (screen.width - width) / 2
    // Tính vị trí trên cùng sao cho cửa sổ nằm giữa màn hình
    var top = (screen.height - height) / 2

    var params = `width=${width}, height=${height}, top=${top}, left=${left}, resizable=yes, scrollbars=yes`

    // Mở cửa sổ popup    
    window.open(url, 'PopupWindow', params)
}
