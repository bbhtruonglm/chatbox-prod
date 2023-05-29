import { getItem } from '@/service/helper/localStorage'
import { request } from '@/service/helper/request'

import type { Cb } from '@/service/interface/function'

/**
 * - fix token cho toàn bộ api gọi lên server chatbox
 * - format lại response trước khi return
 */
export const chatbox = (
    { uri, body }: { uri: string, body?: any },
    proceed: Cb
) => request({
    uri,
    method: 'POST',
    // fix token cho toàn bộ api gọi lên server chatbox
    headers: { Authorization: getItem('access_token') },
    json: true,
    body
}, (e, r) => {
    // format lại response trước khi return
    if (e) return proceed(e)
    if (r && r.mean) return proceed(r.mean)
    if (r && r.message) return proceed(r.message)
    if (r && r.data) return proceed(null, r.data)

    proceed(e, r)
})