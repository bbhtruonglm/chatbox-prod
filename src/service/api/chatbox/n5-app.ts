import { chatbox } from '@/service/api/chatbox/common'

import type { AppInfo, InputCreateTokenWidget, InputMarketWidget } from '@/service/interface/app/widget'
import type { Cb } from '@/service/interface/function'

/**đăng nhập bằng token của fb */
export const create_token_app_installed = (
    body: InputCreateTokenWidget,
    proceed: Cb<{
        // app_installed_id: token
        [index: string]: string
    }>
) => chatbox({
    uri: `${$env.host.n5_app_v2}/app/app_installed/create_token_app_installed`,
    body
}, proceed)

/**lấy danh sách widget trên chợ */
export const get_market_widget = (
    body: InputMarketWidget,
    proceed: Cb<AppInfo[]>
) => chatbox({
    uri: `${$env.host.n5_app_v1}/v1/app/app/read`,
    body
}, (e, r) => proceed(e, r?.app))