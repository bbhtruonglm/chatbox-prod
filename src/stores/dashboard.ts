import { defineStore } from 'pinia'
import { ref } from 'vue'
import { saveLocal, getLocal } from '@/service/helper/store'

/**store phục vụ riêng cho dashboard */
export const useSelectPageStore = defineStore('select_page_store', () => {
  /** -------------- STAGE -------------- */
  const current_menu = ref<string>(
    getLocal('current_selected_tab', 'ALL_PLATFORM')
  )
  // lưu lại data vào local để khi f5 không bị reset
  saveLocal(current_menu, 'current_selected_tab')

  /**tìm kiếm danh sách page theo tên hoặc id */
  const search = ref('')

  /**gắn cờ loading cho danh sách page */
  const is_loading = ref(false)

  /** -------------- MUTATION -------------- */
  /**chọn menu */
  function selectMenu(key: string) {
    current_menu.value = key
  }

  return {
    current_menu,
    search,
    is_loading,

    selectMenu,
  }
})
