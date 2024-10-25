import { Botx } from '@/utils/api/Botx'

import type { OrgInfo, PaymentInfo } from '@/service/interface/app/billing'

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
    super(`app/organization`)
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

/**xác minh người dùng thoả mãn điều kiện dùng mã này */
export interface ResponseVerifyVoucher {
  /**kiểm tra xem mã giảm giá có hợp lệ không */
  is_verify?: boolean
  /**số tiền của giao dịch */
  txn_amount?: number
  /**số tiền thực tế mà người dùng nạp vào */
  txn_origin_amount?: number
  /**mô tả về mã giảm giá */
  voucher_description?: string
  /**tiền về đối tác */
  voucher_is_pay_partner?: boolean
  /**thông tin đối tác */
  voucher_partner_info?: PaymentInfo
}

/**gọi API mã khuyến mại */
export class BillingAppVoucher extends Billing {
  constructor() {
    // gọi API lên module billing
    super(`app/voucher`)

    // tự động nạp id tổ chức đang chọn
    this.initSelectedOrgId()
  }

  /**gọi api post */
  protected post(path: string, body?: Record<string, any>): Promise<any> {
    return super.post(path, {
      org_id: this.org_id,
      ...body,
    })
  }

  /**xác minh người dùng thoả mãn điều kiện dùng mã này */
  public async verifyVoucher(
    txn_amount: number,
    voucher_code: string
  ): Promise<ResponseVerifyVoucher> {
    return this.post('verify_voucher', { voucher_code, txn_amount })
  }
}
