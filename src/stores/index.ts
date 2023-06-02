import { defineStore } from 'pinia'
import { ref } from 'vue'
import { saveLocal, getLocal } from '@/service/helper/store'

import type { ChatbotUserInfo } from '@/service/interface/app/chatbot_user'

export const useAppStore = defineStore('app_store', () => {
    /**toggle loading toàn trang */
    const is_loading_full_screen = ref(false)

    /**
     * load toggle từ local
     * 
     * - tablet/pc
     * false: hiển thị full nav
     * true: hiển thị nav nhỏ
     * 
     * - mobile
     * false: không hiển thị nav
     * true: hiển thị full nav
     */
    const toggle_nav = ref(getLocal('dashboard_toggle_nav', false))
    /** lưu toggle xuống local, để khi f5 trang không bị mất */
    saveLocal(toggle_nav, 'dashboard_toggle_nav')

    /**lưu dữ liệu của user hiện tại đang đăng nhập */
    const chatbot_user = ref<ChatbotUserInfo>()

    return {
        is_loading_full_screen,
        toggle_nav,
        chatbot_user
    }
})