import { defineStore } from 'pinia'
import { ref } from 'vue'
import { saveLocal, getLocal } from '@/service/helper/store'

export const useCommonStore = defineStore('common_store', () => {
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
    const dashboard_toggle_nav = ref(getLocal('dashboard_toggle_nav', false))
    const chat_toggle_nav = ref(getLocal('chat_toggle_nav', false))

    /** lưu toggle xuống local, để khi f5 trang không bị mất */
    saveLocal(dashboard_toggle_nav, 'dashboard_toggle_nav')
    saveLocal(chat_toggle_nav, 'chat_toggle_nav')

    /**trigger sự kiện đến modal báo lỗi không có gói */
    const trigger_require_pricing = ref(false)

    /**action tự động thay đổi value của trigger */
    function triggerRequirePricing() {
        trigger_require_pricing.value = !trigger_require_pricing.value
    }

    return {
        is_loading_full_screen,
        dashboard_toggle_nav,
        chat_toggle_nav,
        trigger_require_pricing,

        triggerRequirePricing,
    }
})