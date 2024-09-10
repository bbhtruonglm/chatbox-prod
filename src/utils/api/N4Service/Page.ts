import { N4Serivce } from '../N4Serivce'

import type { PageList } from '@/service/interface/app/page'
import type { AllStaffList } from '@/service/interface/app/staff'

/**dữ liệu của trang hiện tại kích hoạt */
export interface CurrentPageData {
  /**danh sách page đang kích hoạt */
  page_list?: PageList
  /**danh sách nhân viên của các page trên */
  all_staff_list?: AllStaffList
}

/**gọi API module page của chatbox */
export class N4SerivceAppPage extends N4Serivce {
  constructor() {
    // gọi API module page của chatbot
    super('app/page')
  }

  /**đọc danh sách trang mà người dùng có khả năng tiếp cận */
  public async getListPage(
    body?: Record<string, any>
  ): Promise<CurrentPageData> {
    // gọi api
    return this.post('get_current_page', body)
  }
  /**đọc danh sách trang đang kích hoạt của tổ chức */
  public async getOrgActiveListPage(org_id: string): Promise<CurrentPageData> {
    // gọi api
    return this.getListPage({ org_id, is_active: true })
  }
}
