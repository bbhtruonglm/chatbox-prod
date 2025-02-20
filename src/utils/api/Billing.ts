import { Botx } from '@/utils/api/Botx'

import type {
  OrgInfo,
  PaymentInfo,
  TransactionInfo,
} from '@/service/interface/app/billing'
import type { IBankAccount } from './N4Service/Partner'
import { singleton } from 'tsyringe'

/**gọi API lên server của billing */
export class Billing extends Botx {
  constructor(path: string) {
    // gọi API lên server
    super(`${$env.host.billing}/${path}`)
  }
}

/**api bí mật của tổ chức */
export class BillingPrivate extends Botx {
  constructor() {
    // gọi API lên server
    super(`${$env.host.billing}/private`)
  }

  /**
   * xóa tài khoản - dùng để test tính năng tạo tk = email
   * @param email email tài khoản cần xóa
   */
  deleteAccount(email: string) {
    return this.post('chatbot_user/delete_chatbox_user', { email })
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
  /**
   * upload avt của tổ chức
   * @param org_id id tổ chức
   * @param file dữ liệu upload
   */
  async uploadOrgAvatar(org_id: string, file: File): Promise<string> {
    /**đối tượng form */
    const FORM = new FormData()

    // tải file lên hệ thống
    FORM.append('file', file)

    /**kết quả upload */
    return this.upload('upload_org_avatar', { org_id }, FORM)
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
  voucher_partner_info?: IBankAccount
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

/**gọi API giao dịch */
export class BillingAppTxn extends Billing {
  constructor() {
    // gọi API lên module billing
    super(`app/transaction`)

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

  /**
   * kiểm tra giao dịch đã thành công chưa
   * @param txn_id id giao dịch
   * @param txn_amount số tiền giao dịch
   * @param txn_currency loại tiền
   */
  public async checkTxn(
    txn_id: string,
    bank_name: string
  ): Promise<TransactionInfo | undefined> {
    return this.post('check_txn', { txn_id, bank_name })
  }
}

/**gọi API nhóm của tổ chức */
@singleton()
export class BillingAppGroup extends Billing {
  constructor() {
    // gọi API
    super(`app/group`)

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

  /**
   * tạo mới một nhóm
   * @param group_name tên nhóm
   * @param group_pages danh sách id trang
   * @param group_staffs danh sách id nhân viên
   */
  public async createGroup(
    group_name: string,
    group_pages?: string[],
    group_staffs?: string[]
  ): Promise<void> {
    return this.post('create_group', { group_name, group_pages, group_staffs })
  }
  /**lấy danh sách nhóm */
  public async readGroup(): Promise<IGroup[]> {
    return this.post('read_group')
  }
  /**xóa nhóm */
  public async deleteGroup(group_id: string): Promise<void> {
    return this.post('delete_group', { group_id })
  }
  /**cập nhật thông tin nhóm */
  public async updateGroup(
    group_id: string,
    group_name?: string,
    group_pages?: string[],
    group_staffs?: string[]
  ): Promise<void> {
    return this.post('update_group', {
      group_id,
      group_name,
      group_pages,
      group_staffs,
    })
  }
}
