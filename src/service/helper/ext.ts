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

/**dữ liệu ảnh gửi qua ext */
export interface ImageData {
    /**đường dẫn ảnh */
    url: string
    /**id gửi ảnh nhanh */
    fb_image_id?: string
    type: 'image'
}

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

/**gửi tin nhắn dạng văn bản */
export const sendTextMesage = (text: string) => sendMessage(
    'SEND_TEXT_MESSAGE',
    { message_data: { message: { text } } }
)

/**gửi ảnh ngang */
export const sendImageMessage = (list_file: ImageData[]) => sendMessage(
    'SEND_FILE',
    { list_file }
)

/**lắng nghe thông điệp của ext */
export const listen = (proceed: ListenRes) => window.addEventListener('message', $event => {
    /**dữ liệu được ext gửi qua */
    const DATA = $event?.data
    /**tên sự kiện */
    const EVENT: ResExtEvent = DATA?.event

    // chỉ xử lý thông điệp của ext
    if (DATA?.from !== 'CONTENT_SCRIPT' || !EVENT) return true

    // trả về kết quả
    proceed(
        EVENT,
        DATA?.e,
        DATA?.r || DATA?.data || DATA?.local
    )

    return true
})