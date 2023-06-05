import { chatbox } from '@/service/api/chatbox/common'

import type { ChatbotUserInfo } from '@/service/interface/app/chatbot_user'
import type { PageList } from '@/service/interface/app/page'
import type { AllStaffList } from '@/service/interface/app/staff'

/**đăng nhập bằng token của fb */
export const login_facebook = (
    access_token: string,
    proceed: (e: any, r: {
        access_token: string
    }) => void
) => chatbox({
    uri: `${$env.host.n4_service}/public/oauth/facebook/login`,
    body: { access_token }
}, proceed)

/** đọc thông tin của user hiện tại đang đăng nhập */
export const read_me_chatbot_user = (
    proceed: (e: any, r: ChatbotUserInfo) => void
) => chatbox({
    uri: `${$env.host.n4_service}/app/chatbot_user/read_me_chatbot_user`,
}, proceed)

/**đọc thông tin của toàn bộ các page đang được kích hoạt của user hiện tại */
export const get_current_active_page = (
    proceed: (e: any, r: {
        page_list: PageList
        all_staff_list: AllStaffList
    }) => void
) => chatbox({
    uri: `${$env.host.n4_service}/app/page/get_current_active_page`,
}, proceed)

/**cập nhật một số dữ liệu của page */
export const update_page = (
    body: {
        page_id?: string
        is_priority?: boolean
        is_active?: boolean
    },
    proceed: (e: any, r: any) => void
) => chatbox({
    uri: `${$env.host.n4_service}/app/page/update_page`,
    body,
}, proceed)