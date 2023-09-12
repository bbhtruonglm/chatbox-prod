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