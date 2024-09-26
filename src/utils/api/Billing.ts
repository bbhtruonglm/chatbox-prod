import { Botx } from '@/utils/api/Botx'

import type { OrgInfo } from '@/service/interface/app/billing'

/**gọi API lên server của billing */
class Billing extends Botx {
  constructor(path: string) {
    // gọi API lên server
    super(`${$env.host.billing}/${path}`)
  }
}

/**gọi API quản lý tổ chức */
export class BillingAppOrganization extends Billing {
  constructor() {
    // gọi API lên module billing
    super(`app/organization/`)
  }

  /**
   * đọc danh sách các tổ chức mà người dùng có quyền
   * - tự động tạo 1 tổ chức mặc định nếu người dùng chưa có
   */
  public async readOrg(): Promise<OrgInfo[]> {
    // đọc danh sách các tổ chức
    return this.post('read_org')
  }
  /**cập nhật thiết lập, thông tin một tổ chức */
  public async updateOrg(
    org_id: string,
    body: Record<string, any>
  ): Promise<OrgInfo> {
    // cập nhật thiết lập, thông tin một tổ chức
    return this.post('update_org', { org_id, ...body })
  }
}
