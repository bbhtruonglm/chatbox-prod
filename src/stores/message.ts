import { defineStore } from 'pinia'
import { ref } from 'vue'

import type { TempSendMessage } from '@/service/interface/app/message'

export const useMessageStore = defineStore('message_store', () => {
    /**danh sách tin nhắn tạm vừa được gửi */
    const send_message_list = ref<TempSendMessage[]>([])

    return {
        send_message_list
    }
})