import { chatbox } from '@/service/api/chatbox/common'

import type { Cb } from '@/service/interface/function'

/**ảnh -> văn bản */
export const image_to_text = (
    url: string,
    proceed: Cb
) => chatbox({
    uri: `${$env.host.widget}/v1/service/ocr`,
    body: {
        url
    }
}, proceed)

/**ảnh -> văn bản */
export const get_quick_answer = (
    params: { 
        fb_page_id: string
        skip?: number
        limit?: number
    },
    proceed: Cb
) => chatbox({
    uri: `${$env.host.widget}/v1/quick-answer/quickanswer/read_answer`,
    body: params
}, proceed)