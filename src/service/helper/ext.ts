import type { Cb } from '@/service/interface/function'

/**các sự kiện gửi ext */
export type SendExtEvent =
    'GET_FB_USER_INFO' |
    'CHECK_EXTENSION_INSTALLED' |
    'SEND_TEXT_MESSAGE' |
    'SEND_FILE'

/**các sự kiện ext trả về */
export type ResExtEvent =
    'EXTENSION_INSTALLED' |
    'GET_FB_USER_INFO' |
    'RESPONSE_SEND_TEXT' |
    'RESPONSE_SEND_FILE'

/**kết quả khi lắng nghe ext */
export type ListenRes = (event: ResExtEvent, err?: any, res?: any) => void

/**gửi thông điệp cho ext */
export const sendMessage = (
    event: SendExtEvent,
    payload: {} = {}
) => window.postMessage(
    {
        from: 'NATIVE_SCRIPT',
        event,
        ...payload
    },
    '*',
)

/**kiểm tra ext có được cài đặt */
export const ping = () => sendMessage('CHECK_EXTENSION_INSTALLED')

/**gửi sự kiện thấy thông tin của user */
export const getFbUserInfo = () => sendMessage('GET_FB_USER_INFO')

/**lắng nghe thông điệp của ext */
export const listen = (proceed: ListenRes) => window.addEventListener('message', $event => {
    /**tên sự kiện */
    const EVENT: ResExtEvent = $event?.data?.event

    // chỉ xử lý thông điệp của ext
    if ($event?.data?.from !== 'CONTENT_SCRIPT' || !EVENT) return true

    // trả về kết quả
    proceed(
        EVENT,
        $event?.data?.e,
        $event?.data?.r || $event?.data?.data
    )

    return true
})