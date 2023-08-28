import { useConversationStore, usePageStore, useCommonStore } from '@/stores'
import { isEqual, keys, size, sortBy } from 'lodash'
import { flow, toggle_loading } from '@/service/helper/async'
import { checkPricingValid } from '@/service/helper/pricing'

import type { Cb, CbError } from '@/service/interface/function'

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
                keys(sortBy(pageStore.selected_page_id_list)),
                keys(sortBy(pageStore.selected_page_list_info))
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
export const teleportModelAssignStaffOnPcScreen = () => {
    const commonStore = useCommonStore()

    // mobile thì hiển thị full
    if (window.innerWidth < 768) {
        commonStore.assign_staff_modal_left = `0`
        commonStore.assign_staff_modal_width = `100%`
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

        commonStore.assign_staff_modal_left = `${left}px`
        commonStore.assign_staff_modal_width = `${width}px`
    }, 600)
}