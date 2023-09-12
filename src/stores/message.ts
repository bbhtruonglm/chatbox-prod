import { defineStore } from 'pinia'
import { ref } from 'vue'

import type { 
    AttachmentCacheList, TempSendMessage 
} from '@/service/interface/app/message'

export const useMessageStore = defineStore('message_store', () => {
    /**danh sách tin nhắn tạm vừa được gửi */
    const send_message_list = ref<TempSendMessage[]>([])

    /**danh sách dữ liệu file được cache để không phải gọi lại nhiều lần */
    const attachment_list = ref<AttachmentCacheList>({})

    return {
        send_message_list,
        attachment_list,
    }
})