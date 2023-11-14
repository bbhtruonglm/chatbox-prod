import { chatbox } from '@/service/api/chatbox/common'

import type { AttachmentInfo, InputGetUrlAttachment } from '@/service/interface/app/message'
import type { Cb } from '@/service/interface/function'
import type { FileInfo, GetFileInput, FromFile, UpdateFileInfo } from '@/service/interface/app/album'

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

/**đọc danh sách tập tin */
export const read_file_album = (
    body: GetFileInput,
    proceed: Cb<FileInfo[]>
) => chatbox({
    uri: `${$env.host.n6_static}/app/album/file/read_file`,
    body,
}, proceed)

/**xoá tập tin */
export const delete_file_album = (
    body: UpdateFileInfo,
    proceed: Cb
) => chatbox({
    uri: `${$env.host.n6_static}/app/album/file/delete_file`,
    body,
}, proceed)

/**upload file album */
export const upload_file_album = (
    qs: FromFile,
    body: FormData,
    proceed: Cb<FileInfo>
) => chatbox({
    uri: `${$env.host.n6_static}/app/album/file/upload_file`,
    qs,
    body,
    form: true
}, proceed)