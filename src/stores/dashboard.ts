import { defineStore } from 'pinia'
import { ref } from 'vue'
import { saveLocal, getLocal } from '@/service/helper/store'

/**store chọn trang */
export const useSelectPageStore = defineStore('select_page_store', () => {
  /** -------------- STAGE -------------- */
  /**menu đang chọn */
  const current_menu = ref<string>(
    getLocal('current_selected_tab', 'ALL_PLATFORM')
  )
  // lưu lại data vào local để khi f5 không bị reset
  saveLocal(current_menu, 'current_selected_tab')

  /**tìm kiếm danh sách page theo tên hoặc id */
  const search = ref('')

  /**gắn cờ loading cho danh sách page */
  const is_loading = ref(false)

  /**có đang ở chế độ gộp trang không */
  const is_group_page_mode = ref<boolean>(getLocal('is_group_page_mode', false))
  // lưu lại data vào local để khi f5 không bị reset
  saveLocal(is_group_page_mode, 'is_group_page_mode')

  /** -------------- MUTATION / ACTION -------------- */
  /**chọn menu */
  function selectMenu(key: string) {
    current_menu.value = key
  }

  /**bật tắt chế độ chat nhóm trang */
  function toggleGroupPageMode() {
    is_group_page_mode.value = !is_group_page_mode.value
  }

  return {
    current_menu,
    search,
    is_loading,
    is_group_page_mode,

    selectMenu,
    toggleGroupPageMode,
  }
})

/**store kết nối nền tảng */
export const useConnectPageStore = defineStore('connect_page_store', () => {
  /** -------------- STAGE -------------- */
  /**menu đang chọn */
  const current_menu = ref<string>('WATTING')
  /**có hiện loading không */
  const is_loading = ref(false)
  /**tìm kiếm trang */
  const search = ref('')

  /** -------------- MUTATION / ACTION -------------- */
  /**chọn menu */
  function selectMenu(key: string) {
    current_menu.value = key
  }

  return {
    current_menu,
    is_loading,
    search,

    selectMenu,
  }
})

/**store quản lý tổ chức */
export const useOrgStore = defineStore('org_store', () => {
  /** -------------- STAGE -------------- */
  /**có hiện loading không */
  const is_loading = ref(false)

  /** -------------- MUTATION / ACTION -------------- */

  return {
    is_loading,
  }
})
