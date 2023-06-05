import { defineStore } from 'pinia'
import { ref } from 'vue'
import { saveIndexedDB, getIndexedDB } from '@/service/helper/store'

import type { ChatbotUserInfo } from '@/service/interface/app/chatbot_user'

export const useChatbotUserStore = defineStore('chatbot_user_store', () => {
    /**lưu dữ liệu của user hiện tại đang đăng nhập */
    const chatbot_user = ref<ChatbotUserInfo>()

    // đọc dữ liệu được lưu ở indexeddb
    getIndexedDB(
        'chatbot_user',
        undefined,
        (e, r) => chatbot_user.value = r
    )

    // lưu dữ liệu xuống indexed khi có thay đổi
    saveIndexedDB(chatbot_user, 'chatbot_user')

    return {
        chatbot_user
    }
})