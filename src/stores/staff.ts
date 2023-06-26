import { defineStore } from 'pinia'
import { ref } from 'vue'
import { saveIndexedDB, getIndexedDB } from '@/service/helper/store'

import type { AllStaffList, StaffInfo } from '@/service/interface/app/staff'

export const useStaffStore = defineStore('staff_store', () => {
    /**
     * lưu dữ liệu staff của toàn bộ các page được kích hoạt của user hiện tại 
     * đang đăng nhập
     */
    const staff_list_of_active_page = ref<AllStaffList>()
    // đọc dữ liệu được lưu ở indexeddb
    getIndexedDB(
        'staff_list_of_active_page',
        undefined,
        (e, r) => staff_list_of_active_page.value = r
    )
    // lưu dữ liệu xuống indexed khi có thay đổi
    saveIndexedDB(staff_list_of_active_page, 'staff_list_of_active_page')

    /**dữ liệu tạm khi click xem thông tin của 1 nhân viên */
    const view_staff_info = ref<StaffInfo>()

    return {
        staff_list_of_active_page,
        view_staff_info,
    }
})