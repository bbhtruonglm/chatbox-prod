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

    /**khoảng cách bộ lọc từ bên trái */
    const conversation_filter_modal_left = ref<string>()
    /**độ rộng của bộ lọc */
    const conversation_filter_modal_width = ref<string>()

    /**cờ để hiển thị danh sách tin nhắn ở mobile */
    const is_show_message_mobile = ref(false)
    /**khoảng cách assign modal từ bên trái */
    const center_modal_left = ref<string>()
    /**độ rộng của assign modal */
    const center_modal_width = ref<string>()
    /**đánh dấu ext được phát hiện */
    const is_active_extension = ref(false)

    return {
        is_loading_full_screen,
        dashboard_toggle_nav,
        chat_toggle_nav,
        trigger_require_pricing,
        conversation_filter_modal_left,
        conversation_filter_modal_width,
        is_show_message_mobile,
        center_modal_left,
        center_modal_width,
        is_active_extension,

        triggerRequirePricing,
    }
})