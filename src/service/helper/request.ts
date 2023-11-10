/**
 * lib để request api
 */

import type { Cb } from '@/service/interface/function'

/**phương thức cho phép */
export type Method = 'POST' | 'GET'

/**đầu vào của api */
interface InputRequest {
    /**đường dẫn */
    uri: string
    /**phương thức */
    method: Method
    /**có thể là obj hoặc form upload */
    body?: any
    /**đánh dấu là dạng form upload */
    form?: boolean
    /**đánh dấu format kết quả json trả về */
    json?: boolean
    /**headers truyền thêm */
    headers?: HeadersInit
}

/**adapter để gửi api bằng fetch */
export const request = (
    { uri, method, json, form, body = {}, headers = {} }: InputRequest,
    proceed: Cb
) => {
    if (json && !form) {
        body = JSON.stringify(body)
        headers = {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
            ...headers
        }
    }

    if (method === 'GET') body = undefined

    fetch(uri, { method, headers, body })
        .then(r => json ? r.json() : r)
        .then(r => {
            proceed(null, r)
        })
        .catch(e => {
            proceed(e.message || e)
        })
}