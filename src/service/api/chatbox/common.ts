import { getItem } from '@/service/helper/localStorage'
import { request } from '@/service/helper/request'

import type { Cb } from '@/service/interface/function'

/**
 * - fix token cho toàn bộ api gọi lên server chatbox
 * - format lại response trước khi return
 */
export const chatbox = (
    { uri, body, form, qs }: { uri: string, body?: any, form?: boolean, qs?: any },
    proceed: Cb
) => request({
    uri,
    method: 'POST',
    // fix token cho toàn bộ api gọi lên server chatbox
    headers: { Authorization: getItem('access_token') },
    json: true,
    qs,
    form,
    body
}, (e, r) => {
    // format lại response trước khi return
    if (e) return proceed(e)
    if (r?.mean) return proceed(r.mean)
    if (r?.message) return proceed(r.message)
    if (r?.data || r?.data === 0) return proceed(null, r.data)

    proceed(e, r)
})