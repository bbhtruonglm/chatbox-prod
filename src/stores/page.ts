import { defineStore } from 'pinia'
import { ref } from 'vue'
import { saveIndexedDB, getIndexedDB } from '@/service/helper/store'
import { saveLocal, getLocal } from '@/service/helper/store'

import type { PageList } from '@/service/interface/app/page'
import { filter, map, size } from 'lodash'
import type { AppInfo, AppInstalledInfo, ListPageIsInstall } from '@/service/interface/app/widget'
import type { StaffInfo } from '@/service/interface/app/staff'

export const usePageStore = defineStore('page_store', () => {
  /** -------------- STAGE -------------- */
  /**lưu dữ liệu của các page được kích hoạt của user này */
  const active_page_list = ref<PageList>({})
  // đọc dữ liệu được lưu ở indexeddb
  getIndexedDB(
    'active_page_list',
    undefined,
    (e, r) => (active_page_list.value = r)
  )
  // lưu dữ liệu xuống indexed khi có thay đổi
  saveIndexedDB(active_page_list, 'active_page_list')

  /**lưu id của các page được chọn để chat */
  const selected_page_id_list = ref<{
    [index: string]: boolean | undefined
  }>(getLocal('selected_page_id_list', {}))
  // lưu dữ liệu xuống local
  saveLocal(selected_page_id_list, 'selected_page_id_list')

  /**dữ liệu của các page được chọn khi vào trang chat */
  const selected_page_list_info = ref<PageList>({})

  /**dữ liệu của các nhân viên của các trang đang được chọn */
  const selected_pages_staffs = ref<Record<string, StaffInfo>>({})

  /**danh sách widget */
  const widget_list = ref<AppInstalledInfo[]>([])

  /**các widget trên chợ */
  const market_widgets = ref<Record<string, AppInfo>>()

  /**--------------- GETTER ------------ */
  /**đếm số trang đang kích hoạt */
  function countActivePage() {
    return size(active_page_list.value)
  }
  /**đếm số lượng page được chọn */
  function countSelectedPage() {
    // lọc ra các page được chọn
    return filter(selected_page_id_list.value, value => !!value)?.length
  }
  /**kiểm tra xem page_id có trong danh sách được chọn không */
  function isSelectedPage(page_id?: string) {
    // nếu không có page_id thì tính là chưa chọn
    if (!page_id) return false

    // kiểm tra xem page_id có trong danh sách được chọn không
    return !!selected_page_id_list.value[page_id]
  }

  /** -------------- MUTATION / ACTION -------------- */
  function setPageSelected(page_id?: string, is_selected?: boolean) {
    // nếu page_id không tồn tại thì thôi
    if (!page_id) return

    // ghi trang thái mới
    if (is_selected) selected_page_id_list.value[page_id] = true
    // ghi trang thái mới
    else delete selected_page_id_list.value[page_id]
  }

  return {
    active_page_list,
    selected_page_id_list,
    selected_page_list_info,
    widget_list,
    selected_pages_staffs,
    market_widgets,

    countSelectedPage,
    isSelectedPage,
    setPageSelected,
    countActivePage,
  }
})
