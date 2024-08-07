import type { ChatbotUserInfo } from "./chatbot_user"
import type { PageInfo } from "./page"

/**tổ chức */
export interface OrgInfo {
  /**gắn thêm cờ chọn tổ chức */
  is_selected?: boolean
  /**inject thêm dữ liệu nhân viên nếu cần */
  current_ms?: MemberShipInfo
  /**id của tổ chức */
  org_id?: string
  /**thông tin của tổ chức */
  org_info?: {
    /**tên tổ chức */
    org_name?: string
    /**avatar của tổ chức */
    org_avatar?: string
    /**mã tổ chức */
    org_customer_code?: string
    /**tên doanh nghiệp */
    org_company_name?: string
    /**sdt tổ chức */
    org_phone?: string
    /**mã hợp đồng */
    org_contract_code?: string
    /**mã số thuế */
    org_tax_code?: string
    /**địa chỉ tổ chức */
    org_address?: string
    /**email tổ chức */
    org_email?: string
    /**đại diện tổ chức */
    org_representative?: string
  }
  /**các thiết lập của tổ chức */
  org_config?: {
    /**yêu cầu bảo mật nâng cao 2FA */
    org_is_active_2fa?: boolean
    /**kích hoạt AI tự động dịch en -> vn */
    org_is_ai_auto_translate?: boolean
    /**kích hoạt AI tự động đề xuất câu trả lời */
    org_is_ai_auto_suggest_response?: boolean
    /**kích hoạt AI tự động đánh dấu các tin nhắn phàn nàn của khách hàng */
    org_is_ai_auto_alert_complain?: boolean
    /**kích hoạt AI tự động gắn nhãn cho khách hàng */
    org_is_ai_auto_auto_tag?: boolean
    /**cho phép tự động thanh toán khi đến hạn */
    org_is_auto_charge?: boolean
    /**id của người kích hoạt chế độ tự động thanh toán */
    org_auto_charge_actor?: string
  }
  /**thông số về gói hiện tại của tổ chức */
  org_package?: {
    /**loại gói của tổ chức */
    org_package_type?: OrgPackage
    /**phần trăm giảm giá khi tổ chức mua gói */
    org_discount?: number
    /**mốc thời gian mà sau đó thì discount hết hiệu lực */
    org_discount_end_date?: number
    /**đánh dấu tổ chức đã dùng thử rồi, không cho dùng thứ quá 1 lần */
    org_has_trial?: boolean
    /**có chặn luồng fau không */
    org_is_lock_fau?: boolean
    /**có chặn luồng khách hàng không */
    org_is_lock_client?: boolean
    /**có chặn luồng AI ký tự không */
    org_is_lock_ai_text?: boolean
    /**có chặn luồng AI hình ảnh không */
    org_is_lock_ai_image?: boolean
    /**có chặn luồng AI âm thanh không */
    org_is_lock_ai_sound?: boolean
    /**có chặn luồng AI video không */
    org_is_lock_ai_video?: boolean
    /**ngày bắt đầu sử dụng gói */
    org_start_date?: number
    /**ngày kết thúc sử dụng gói */
    org_end_date?: number
    /**giới hạn số lượng page tối đa của tổ chức */
    org_quota_page?: number
    /**giới hạn số lượng user tối đa của tổ chức */
    org_quota_staff?: number
    /**giới hạn số lượng fau tối đa của tổ chức */
    org_quota_fau?: number
    /**số khách hàng tối đa */
    org_quota_client?: number
    /**giới hạn số lượng AI xử lý ký tự của tổ chức */
    org_quota_ai_text?: number
    /**giới hạn số lượng AI xử lý hình ảnh của tổ chức */
    org_quota_ai_image?: number
    /**giới hạn số lượng AI xử lý âm thanh của tổ chức */
    org_quota_ai_sound?: number
    /**giới hạn số lượng AI xử lý video của tổ chức */
    org_quota_ai_video?: number
    /**số lượng trang hiện tại của tổ chức */
    org_current_page?: number
    /**số lượng user hiện tại của tổ chức */
    org_current_staff?: number
    /**số lượng fau hiện tại của tổ chức */
    org_current_fau?: number
    /**số khách hàng hiện tại */
    org_current_client?: number
    /**số lượng AI xử lý ký tự hiện tại của tổ chức */
    org_current_ai_text?: number
    /**số lượng AI xử lý hình ảnh hiện tại của tổ chức */
    org_current_ai_image?: number
    /**số lượng AI xử lý âm thanh hiện tại của tổ chức */
    org_current_ai_sound?: number
    /**số lượng AI xử lý video hiện tại của tổ chức */
    org_current_ai_video?: number
  }
}

/**bảng tạm liên kết giữa tổ chức và người dùng */
export interface MemberShipInfo {
  /**inject thêm thông tin cá nhân */
  user_info?: ChatbotUserInfo
  /**id của tổ chức */
  org_id?: string
  /**id của nhân viên của tổ chức */
  staff_id?: string
  /**vai trò của nhân viên trong tổ chức */
  ms_role?: 'ADMIN' | 'STAFF'
  createdAt?: string
}

/**gói của tổ chức */
export type OrgPackage = 'FREE' | 'TRIAL' | 'PRO' | 'BUSINESS'

/**bảng tạm liên kết giữa tổ chức và trang */
export interface OwnerShipInfo {
  /**inject thêm thông tin của trang */
  page_info?: PageInfo
  /**id của tổ chức */
  org_id?: string
  /**id của trang của tổ chức */
  page_id?: string
}

/**thông tin của ví */
export interface WalletInfo {
  /**id của ví */
  wallet_id?: string
  /**tổ chức sở hữu ví này: 1-1 */
  org_id?: string
  /**số dư hiện tại của ví */
  wallet_balance?: number
}

/**thông tin giao dịch */
export interface TransactionInfo {
  /**id của giao dịch */
  txn_id?: string
  /**tổ chức thực hiện giao dịch này */
  org_id?: string
  /**id hoá đơn của giao dịch này */
  invoice_id?: string
  /**dánh dấu có xuất hoá đơn hay không */
  txn_is_issue_invoice?: boolean
  /**id của người đại diện tổ chức, người thực tế thực hiện giao dịch này */
  user_id?: string
  /**id của ví chủ của giao dịch */
  wallet_id?: string
  /**số tiền của giao dịch này */
  txn_amount?: number
  /**trạng thái của giao dịch */
  txn_status?: TransactionStatus
  /**phương thức thanh toán */
  txn_payment_method?: PaymentMethod
  /**các dữ liệu cần lưu thêm của giao dịch */
  txn_data?: {
    user_info?: ChatbotUserInfo
  }
  /**loại giao dịch */
  txn_type?: BillingType
  /**mô tả giao dịch */
  txn_description?: string
  /**ngày tạo */
  createdAt?: string
}

/**
 * trạng thái của giao dịch
 * - chờ thanh toán
 * - thành công
 * - thất bại
 */
export type TransactionStatus = 'PENDING' | 'SUCCESS' | 'FAILED'

/**
 * phương thức thanh toán
 * - tiền mặt
 * - chuyển khoản
 * - VNPAY
 * - ZALO PAY
 * - MOMO
 * - thẻ tín dụng hoặc thẻ ATM
 */
export type PaymentMethod =
  | 'CASH'
  | 'TRANSFER'
  | 'VNPAY'
  | 'ZALO_PAY'
  | 'MOMO'
  | 'CARD'
  | 'INTERNAL'

/**
 * loại giao dịch
 * - nạp tiền vào ví
 * - rút tiền ra khỏi ví
 * - thanh toán cho hóa đơn
 */
export type BillingType = 'DEPOSIT' | 'WITHDRAW' | 'PAYMENT'


/** --------------------- NOTI --------------------- */
/**thông tin của 1 thông báo */
export interface NotiInfo {
  /**id của thông báo này */
  noti_id?: string
  /**id của tổ chức thực hiện đặt hàng */
  org_id?: string
  /**tiêu đề của thông báo */
  noti_title?: string
  /**nội dung của thông báo */
  noti_content?: string
  /**thông báo này đã được đọc chưa */
  is_read?: boolean
  /**thời gian record này được xoá */
  auto_remove_at?: string
  /**thời gian thông báo được tạo */
  createdAt?: string
}
