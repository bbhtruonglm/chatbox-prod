import { chatbox } from '@/service/api/chatbox/common'

import type { AttachmentInfo, InputGetUrlAttachment } from '@/service/interface/app/message'
import type { Cb } from '@/service/interface/function'

/**đọc dữ liệu file của tin nhắn */
export const get_url_attachment = (
    body: InputGetUrlAttachment,
    proceed: Cb<AttachmentInfo[]>
) => chatbox({
    uri: `${$env.host.n6_static}/app/facebook/attachment/get_url_attachment`,
    body
}, proceed)

/**upload file lên server lấy link, sau 30s file sẽ tự bị xoá */
export const upload_temp_file = (
    body: FormData,
    proceed: Cb<string>
) => chatbox({
    uri: `${$env.host.n6_static}/app/upload/file/upload_temp_file`,
    body,
    form: true
}, proceed)