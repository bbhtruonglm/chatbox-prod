import { defineStore } from 'pinia'
import { ref } from 'vue'

import type { ChatbotUserInfo } from '@/service/interface/app/chatbot_user'

export const useAppStore = defineStore('app_store', () => {
    /**toggle loading toàn trang */
    const is_loading_full_screen = ref(false)

    /**lưu dữ liệu của user hiện tại đang đăng nhập */
    const chatbot_user = ref<ChatbotUserInfo>()

    return {
        is_loading_full_screen,
        chatbot_user
    }
})