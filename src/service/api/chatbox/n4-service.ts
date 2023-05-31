import { chatbox } from '@/service/api/chatbox/common'

import type { ChatbotUserInfo } from '@/service/interface/app/chatbot_user'

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
export const get_me_chatbot_user = (
    proceed: (e: any, r: ChatbotUserInfo) => void
) => chatbox({
    uri: `${$env.host.n4_service}/app/chatbot_user/read_me_chatbot_user`,
}, proceed)