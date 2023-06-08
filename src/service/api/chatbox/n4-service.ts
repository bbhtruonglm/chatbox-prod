import { chatbox } from '@/service/api/chatbox/common'

import type { ChatbotUserInfo } from '@/service/interface/app/chatbot_user'
import type { PageList, PageWebsiteCreate } from '@/service/interface/app/page'
import type { AllStaffList } from '@/service/interface/app/staff'
import type { Cb } from '@/service/interface/function'

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
    body: {
        is_active?: boolean
    },
    proceed: (e: any, r: {
        page_list: PageList
        all_staff_list: AllStaffList
    }) => void
) => chatbox({
    uri: `${$env.host.n4_service}/app/page/get_current_page`,
    body,
}, proceed)

/**cập nhật một số dữ liệu của page */
export const update_page = (
    body: {
        page_id?: string
        is_priority?: boolean
        is_active?: boolean
    },
    proceed: Cb
) => chatbox({
    uri: `${$env.host.n4_service}/app/page/update_page`,
    body,
}, proceed)

/**đồng bộ dữ liệu page mới nhất từ facebook */
export const sync_facebook_page = (
    access_token: string,
    proceed: Cb
) => chatbox({
    uri: `${$env.host.n4_service}/app/page/sync_facebook_page`,
    body: { access_token },
}, proceed)

/**tạo mới page dạng website */
export const create_website_page = (
    body: PageWebsiteCreate,
    proceed: Cb
) => chatbox({
    uri: `${$env.host.n4_service}/app/page/create_website_page`,
    body,
}, proceed)

/**đọc toàn bộ các gói của user */
export const read_me_pricing = (
    body: { pricing_id?: string },
    proceed: Cb
) => chatbox({
    uri: `${$env.host.n4_service}/app/pricing/read_me_pricing`,
    body,
}, proceed)