import { defineStore } from 'pinia'
import { ref } from 'vue'
import { saveLocal, getLocal } from '@/service/helper/store'
import { format as date_format, differenceInDays } from 'date-fns'

import type { OrgInfo } from '@/service/interface/app/billing'
import type { AppInfo } from '@/service/interface/app/widget'

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
  const current_menu = ref<string>('PAGE')
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
  /**danh sách các tổ chức của user này */
  const list_org = ref<OrgInfo[]>()
  /**id của tổ chức đang được chọn */
  const selected_org_id = ref<string | undefined>(
    getLocal('selected_org_id', '')
  )
  // lưu lại data vào local để khi f5 không bị reset
  saveLocal(selected_org_id, 'selected_org_id')
  /**thông tin tổ chức đang được chọn */
  const selected_org_info = ref<OrgInfo>()
  /**đếm số thông báo */
  const count_noti = ref()

  /** -------------- MUTATION / ACTION -------------- */
  /**có phải là gói miễn phí không */
  function isFreePack() {
    return selected_org_info.value?.org_package?.org_package_type === 'FREE'
  }
  /**có phải là gói dùng thử không */
  function isTrialPack() {
    return selected_org_info.value?.org_package?.org_package_type === 'TRIAL'
  }
  /**có phải là gói pro không */
  function isProPack() {
    return selected_org_info.value?.org_package?.org_package_type === 'PRO'
  }
  /**có phải là gói doanh nghiệp không */
  function isBusinessPack() {
    return selected_org_info.value?.org_package?.org_package_type === 'BUSINESS'
  }
  /**user có phải là admin của tổ chức không */
  function isAdminOrg() {
    return selected_org_info.value?.current_ms?.ms_role === 'ADMIN'
  }
  /**đã kích hoạt gói dùng thử chưa */
  function hasTrial() {
    return selected_org_info.value?.org_package?.org_has_trial
  }
  /**tính thời gian thanh toán tiếp theo */
  function calcNextPay() {
    /**thời gian hết hạn */
    const END_DATE = selected_org_info.value?.org_package?.org_end_date

    // nếu không có thời gian hết hạn thì trả về rỗng
    if (!END_DATE) return ''

    // trả về thời gian thanh toán tiếp theo
    return date_format(new Date(END_DATE), 'dd/MM/yyyy')
  }
  /**tính số ngày còn lại */
  function calcDayRemaining(): number {
    // nếu không có thời gian hết hạn thì trả về 0
    if (!selected_org_info.value?.org_package?.org_end_date) return 0

    /**thời gian hết hạn */
    const END_DATE = new Date(
      selected_org_info.value?.org_package?.org_end_date
    )

    // Tính số ngày giữa hai ngày
    return differenceInDays(END_DATE, new Date())
  }

  return {
    is_loading,
    list_org,
    selected_org_id,
    selected_org_info,
    count_noti,

    isFreePack,
    isTrialPack,
    isProPack,
    isBusinessPack,
    isAdminOrg,
    hasTrial,
    calcNextPay,
    calcDayRemaining,
  }
})

/**store quản lý widget */
export const useWidgetStore = defineStore('widget_store', () => {
  /** -------------- STAGE -------------- */
  /**có hiện loading không */
  const is_loading = ref(false)
  /**widget được chọn để cài đặt */
  const selected_widget = ref<AppInfo>()
  /**id của trang được chọn */
  const selected_page_id = ref<string>()

  /** -------------- MUTATION / ACTION -------------- */

  return {
    is_loading,
    selected_widget,
    selected_page_id,
  }
})

// /**lớp trừu tượng để khởi tạo store */
// export class StoreAbstract {
//   /**store duy nhất */
//   static #inst: StoreAbstract

//   // /**sử dụng store */
//   static use<T extends StoreAbstract>(this: new () => T): T {
//     // nếu chưa khởi tạo thì khởi tạo
//     if (!StoreAbstract.#inst) StoreAbstract.#inst = new this()

//     // trả về store duy nhất
//     return StoreAbstract.#inst.store() as T
//   }

//   /**khởi tạo store */
//   store() {
//     /**tên store bằng tên class */
//     const STORE_NAME = this.constructor.name
//     /**dùng chính các thuộc tính và phương thức của class để thiết lập store */
//     const SETUP = () => this

//     // khởi tạo store
//     return defineStore(STORE_NAME, SETUP)()
//   }
// }

// export class OrgStore extends StoreAbstract {
//   abc = ref('123')

//   edit = (params: string) => {
//     this.abc.value = params
//   }
// }

// đang bị lỗi kiểu ref khi dùng trực tiếp
