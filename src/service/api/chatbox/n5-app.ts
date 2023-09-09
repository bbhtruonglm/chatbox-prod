import { chatbox } from '@/service/api/chatbox/common'

import type { InputCreateTokenWidget } from '@/service/interface/app/widget'
import type { Cb } from '@/service/interface/function'

/**đăng nhập bằng token của fb */
export const create_token_app_installed = (
    body: InputCreateTokenWidget,
    proceed: Cb<{
        // app_installed_id: token
        [index: string]: string
    }>
) => chatbox({
    uri: `${$env.host.n5_app}/app/app_installed/create_token_app_installed`,
    body
}, proceed)