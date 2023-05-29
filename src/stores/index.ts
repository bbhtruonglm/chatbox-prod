import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAppStore = defineStore('app_store', () => {
    /**toggle loading toàn trang */
    const is_loading_full_screen = ref(false)

    return {
        is_loading_full_screen,
    }
})