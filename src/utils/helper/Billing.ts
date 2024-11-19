import type { MemberShipInfo } from '@/service/interface/app/billing'

/**các hàm hỗ trợ cho billing */
export interface IBillingHelper {
  /**
   * kiểm tra user có phải là admin đang kích hoạt không
   * @param ms thông tin membership
   */
  isActiveAdmin(ms?: MemberShipInfo): boolean
  /**
   * kiểm tra user có phải là staff đang kích hoạt không
   */
  isActiveStaff(ms?: MemberShipInfo): boolean
}

/**các hàm hỗ trợ cho billing */
export class BillingHelper implements IBillingHelper {
  isActiveAdmin(ms?: MemberShipInfo) {
    // là admin và đang kích hoạt
    return Boolean(ms?.ms_role === 'ADMIN' && ms?.ms_is_active)
  }
  isActiveStaff(ms?: MemberShipInfo) {
    // là staff và đang kích hoạt
    return Boolean(ms?.ms_role === 'STAFF' && ms?.ms_is_active)
  }
}

/**các hàm hỗ trợ cho billing */
export class SingletonBillingHelper extends BillingHelper {
  /**đối tượng duy nhất */
  private static inst: IBillingHelper

  // chặn khởi tạo từ bên ngoài
  private constructor() {
    super()
  }

  /**lấy đối tượng duy nhất */
  static getInst() {
    // nếu chưa có thì tạo mới
    if (!this.inst) this.inst = new this()

    // trả về đối tượng
    return this.inst
  }
}
