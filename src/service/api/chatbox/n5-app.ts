import { chatbox } from '@/service/api/chatbox/common'

import type { AppInfo, AppInstalledInfo, InputCheckPageInstallWidget, InputCreateTokenWidget, InputGetInstalledWidget, InputInstallWidget, InputMarketWidget, InputUpdateWidget, ListPageIsInstall, ResponseInstallWidget } from '@/service/interface/app/widget'
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

/**kiểm tra trang đã cài widget chưa */
export const check_page_install_widget = (
    body: InputCheckPageInstallWidget,
    proceed: Cb<ListPageIsInstall>
) => chatbox({
    uri: `${$env.host.n5_app_v1}/v1/app/app-installed/read`,
    body
}, proceed)

/**lấy danh sách các widget đã cài đặt và token */
export const get_installed_widget = (
    body: InputGetInstalledWidget,
    proceed: Cb<AppInstalledInfo[]>
) => chatbox({
    uri: `${$env.host.n5_app_v1}/v1/app/app-installed/read`,
    body
}, (e, r) => proceed(e, r?.app_installed))

/**cài đặt widget vào trang */
export const install_widget = (
    body: InputInstallWidget,
    proceed: Cb<ResponseInstallWidget>
) => chatbox({
    uri: `${$env.host.n5_app_v1}/v1/app/app-installed/create`,
    body
}, proceed)

/**xoá ứng dụng khỏi trnag */
export const uninstall_widget = (
    id: string,
    proceed: Cb
) => chatbox({
    uri: `${$env.host.n5_app_v1}/v1/app/app-installed/delete`,
    body: { _id: id }
}, proceed)

/**update cài đặt ứng dụng */
export const update_widget = (
    body: InputUpdateWidget,
    proceed: Cb
) => chatbox({
    uri: `${$env.host.n5_app_v1}/v1/app/app-installed/update`,
    body
}, proceed)