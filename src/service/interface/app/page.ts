import type { AllStaffList, StaffInfo } from '@/service/interface/app/staff'
import type { ILabel } from './label'
import type { AppInstalledInfo } from './widget'

export type PageType =
  | 'FB_MESS'
  | 'ZALO_OA'
  | 'WEBSITE'
  | 'FB_WHATSAPP'
  | 'FB_INSTAGRAM'

export interface PageInfo {
  /**vị trí quét từ FB */
  location?: {
    /**thành phố */
    city?: string
  }
  fb_page_id: string
  type: PageType
  name: string
  avatar?: string
  /**thời gian hết hạn gói dùng thử */
  end_date_trial?: number
  /**thời gian hết hạn gói hiện tại */
  end_date?: number
  /**id của gói hiện tại */
  pricing_id?: string
  is_priority?: boolean
  is_active?: boolean
  /**page này là page nội bộ được sử dụng vĩnh viễn */
  is_internal?: boolean
  /**page này bị hệ thống chặn */
  is_block?: boolean
  /**token của page */
  fb_page_token?: string
  /**cài đặt cảnh báo tin nhắn rep chậm */
  alert_slow_rep_time?: number
  /**cài đặt ẩn avatar trang */
  is_hide_page_avatar?: boolean
  /**cài đặt hiển thị nhãn */
  display_label_type?: 'ICON' | 'ICON_TOOLTIP' | 'FULL'
  /**id của page gốc được kết nối */
  page_id?: string
  /**trang có bị khoá tính năng khách hàng (không cho xem tin nhắn) không */
  is_lock_client?: boolean
}

/**trang thuộc loại nào */
export type IPageType = 'FB_MESS' | 'ZALO_OA' | 'FB_INSTAGRAM' | 'WEBSITE'

/**các thông tin cơ bản của trang */
export interface IPageInfo {
  // TODO sau này sẽ migrate "fb_page_id" -> "page_id"
  /**
   * id trang
   * - id page của fb
   * - uuid v4 tự định nghĩa
   */
  fb_page_id?: string
  /**
   * tên hiển thị
   * - tự động quét nếu là của nền tảng khác
   * - cho phép chỉnh sửa nếu là page tự tạo (WEB)
   */
  name?: string
  // TODO sửa lại để tất cả các trang đều dùng link ảnh trong avatar, thay vì mỗi page type chạy 1 kiểu khác nhau
  /**link ảnh đại diện của trang */
  avatar?: string
  /**trang thuộc nền tảng nào */
  type?: IPageType
  /**token fb cuối cùng được tạo của trang */
  fb_page_token?: string
  /**mô tả về trang này */
  description?: string
  /**token của merchant */
  merchant_token?: string
  /**token cập nhật */
  update_token?: string
}
/**các thiết lập cờ của trang */
export interface IPageFlag {
  /**
   * - trang có bị khoá tính năng khách hàng (không cho xem tin nhắn) không
   * - chỉ có tác dụng ở tổ chức gói FREE
   * - sẽ được reset cờ hàng tháng
   */
  is_lock_client?: boolean
  /**trang có đang được kích hoạt hiển thị không */
  is_active?: boolean
  /**trang có đang quét tên hiển thị mới không */
  is_scan_name?: boolean
  /**trang có đang chuyển nhân viên không */
  is_tranfer_staff?: boolean
  /**
   * @deprecated
   * - huỷ kích hoạt page
   * - không thể push thêm conversation hoặc message dạng website
   */
  is_disable?: boolean
  /**sort các page ưu tiên lên đầu danh sách, sau các page được tích chọn */
  is_priority?: boolean
  /**gắn cờ để check page này đã xoá data không cần thiết khi hết gói hay chưa */
  is_has_remove_page_data?: boolean
  /**cài đặt ẩn ảnh của trang trong danh sách conversation, hover vào mới hiện */
  is_hide_page_avatar?: boolean
}
/**thiết lập tự động chia nhân viên cho khách mới */
export interface IPageAssignConfig {
  /**có bật tự động chia nhân viên không */
  is_auto_assign_staff?: boolean
  /**index của nhân viên cuối cùng được assign */
  last_assign_staff_index?: number
  /**
   * - nếu sau xx khoảng thời gian mà nhân viên không chat khách,
   * - Tự động chuyển assign cho nhân viên tiếp theo (bật/ tắt)
   */
  is_auto_change_assign?: boolean
  /**thời gian chuyển assign */
  change_assign_after?: number
}
// TODO sau khi chuyển hết sang bot v2 sẽ bỏ field này
/**phiên bản trigger là chatbot cũ hay mới */
export type IPageTriggerVersion = 'v1' | 'v2'

/**thiết lập trigger tin nhắn */
export interface IPageTriggerMessageConfig {
  /**có kích hoạt trigger qua email không */
  is_trigger_email?: boolean
  /**có kích hoạt trigger qua số điện thoại không */
  is_trigger_phone?: boolean
  /**phiên bản trigger là chatbot cũ hay mới */
  version?: IPageTriggerVersion
}

/**thiết lập trigger tin nhắn chatbot */
export interface IPageTriggerChatbotConfig {
  /**trigger tin nhắn */
  is_trigger_message?: IPageTriggerMessageConfig
}

/**thiết lập trigger */
export interface IPageTriggerConfig {
  /**thiết lập trigger chatbot */
  config?: IPageTriggerChatbotConfig
}
/**thiết lập chung > hội thoại */
export interface IPageGeneralConversationConfig {
  /**
   * chế độ hiển thị (sắp xếp) hội thoại
   * - NEWEST: hiện hội thoại mới nhất
   * - UNREAD: hiện hội thoại chưa đọc
   */
  sort_conversation?: 'NEWEST' | 'UNREAD'
  /**
   * chế độ hiển thị gắn nhãn
   * - ICON_TOOLTIP: Hiện chấm màu có chú giải
   * - ICON: Chỉ hiện chấm màu
   * - FULL: Hiện văn bản
   */
  display_label_type?: 'ICON_TOOLTIP' | 'ICON' | 'FULL'
  /**
   * hiện hội thoại theo nhân viên chỉ định
   * - true: chỉ hiện hội thoại của nhân viên đó
   * - false, undefined: hiện hội thoại của tất cả nhân viên
   */
  is_only_visible_client_of_staff?: boolean
  /**ẩn số điện thoại */
  is_hide_phone?: boolean
  /**ẩn email */
  is_hide_email?: boolean
}
/**thiết lập chung > thông báo, âm thanh */
export interface IPageGeneralAlertConfig {
  /**thông báo khi có tin nhắn mới hoặc bình luận mới */
  is_alert_new_message?: boolean
  /**phát âm thanh khi có thông báo mới */
  is_sound_new_message?: boolean
}
/**thiết lập của 1 mốc giờ */
export interface IBusinessHourTimeConfig {
  /**giờ */
  hour?: number
  /**phút */
  minute?: number
}
/**thiết lập chung > bình luận, tin nhắn */
export interface IPageGeneralMessageConfig {
  /**tự động ẩn toàn bộ bình luận */
  is_auto_hide_comment?: boolean
  /**gửi tin nhắn với tên và ảnh đại diện của nhân viên nhắn tin */
  is_use_persona_id?: boolean
  /**
   * @deprecated cảnh báo phảm hồi chậm khách hàng
   * - number: số phút
   */
  alert_slow_rep_time?: number
  /**cảnh báo phảm hồi chậm khách hàng */
  slow_reply_config?: {
    /**thời gian phản hồi chậm - phút */
    time?: number
    /**có kích hoạt không */
    is_active?: boolean
  }
}
/**thiết lập 1 ngày */
export interface IBusinessHourDayConfig {
  /**thời gian bắt đầu */
  start_time?: IBusinessHourTimeConfig
  /**thời gian kết thúc */
  end_time: IBusinessHourTimeConfig
  /**có phải ngày nghỉ không */
  is_disable?: boolean
}
/**thiết lập chung > khung chat */
export interface IPageGeneralChatConfig {
  /**
   * gửi tin nhắn nhanh bằng phím tắt
   * undefined:   enter: để gửi tin nhắn
   * ENTER:       enter: để gửi tin nhắn
   * SHIFT_ENTER  shift + enter: để gửi tin nhắn
   */
  hot_key_send_message?: 'ENTER' | 'SHIFT_ENTER'
}
/**thiết lập giờ làm việc */
export interface IBusinessHourConfig {
  /**
   * kiểu thiết lập
   * - CLOSE: đóng cửa
   * - EVERY_TIME: mở cửa cả ngày
   * - TIME_SLOT: mở cửa theo khung giờ
   */
  type?: 'CLOSE' | 'EVERY_TIME' | 'TIME_SLOT'
  /**dữ liệu của khung giờ */
  source?: {
    /**chủ nhật */
    '0'?: IBusinessHourDayConfig
    /**thứ 2 */
    '1'?: IBusinessHourDayConfig
    /**thứ 3 */
    '2'?: IBusinessHourDayConfig
    /**thứ 4 */
    '3'?: IBusinessHourDayConfig
    /**thứ 5 */
    '4'?: IBusinessHourDayConfig
    /**thứ 6 */
    '5'?: IBusinessHourDayConfig
    /**thứ 7 */
    '6'?: IBusinessHourDayConfig
  }
}
/**thiết lập chung > thời gian làm việc */
export interface IPageGeneralBusinessHourConfig {
  /**
   * múi giờ của trang
   * - sử dụng định dạng: IANA Time Zone
   * @example America/New_York, Asia/Ho_Chi_Minh
   * @default Asia/Ho_Chi_Minh
   */
  timezone?: string
  /**thời gian làm việc trong ngày */
  business_hour_config?: IBusinessHourConfig
}
/**địa chỉ */
export interface ILocation {
  /**thành phố */
  city?: string
  /**đất nước */
  country?: string
  /**lat */
  latitude?: number
  /**long */
  longitude?: number
  /**tên đường */
  street?: string
  /**mã bưu chính */
  zip?: string
}
/**thiết lập chung > thông tin trang */
export interface IPageGeneralInfoConfig {
  /**ngôn ngữ của trang */
  page_language?: string
  /**địa chỉ */
  location?: ILocation
}
/**
 * phạm vi áp dụng
 * - PAGE: chỉ áp dụng cho trang
 * - CLIENT: chỉ áp dụng cho khách hàng
 * - BOTH: áp dụng cho cả 2
 */
export type IAiApplyType = 'PAGE' | 'CLIENT' | 'BOTH'
/**thiết lập chuyển đổi media -> văn bản */
export interface IMediaToTextConfig {
  /**phạm vi áp dụng */
  apply?: IAiApplyType
  /**
   * hành động khi chuyển đổi media sang văn bản
   * - ONLY_TO_TEXT: chỉ chuyển đổi media sang văn bản
   * - TEXT_TO_AI: chuyển đổi media sang văn bản và thực hiện AI tiếp theo
   */
  action?: 'ONLY_TO_TEXT' | 'TEXT_TO_AI'
  /**có kích hoạt không */
  is_active?: boolean
}
/**thiết lập dịch văn bản */
export interface ITranslateConfig {
  /**ngôn ngữ nguồn */
  from?: string
  /**ngôn ngữ đích */
  to?: string
  /**có kích hoạt không */
  is_active?: boolean
}
/**số ký tự thực hiện AI */
export interface IActiveCharLengthConfig {
  /**số ký tự tối thiểu */
  min?: number
  /**số ký tự tối đa */
  max?: number
}
/**AI -> thiết lập chung */
export interface IPageAiGeneralConfig {
  /**số ký tự thực hiện AI */
  ai_active_char_length?: IActiveCharLengthConfig
  /**cảm xúc */
  is_detect_emotion?: boolean
  /**hình ảnh sang văn bản */
  is_image_to_text?: IMediaToTextConfig
  /**âm thanh sang văn bản */
  is_sound_to_text?: IMediaToTextConfig
  /**dịch ngôn ngữ */
  is_translate_text?: ITranslateConfig
  /**kiểm tra phản hồi chậm hợp lệ */
  is_alert_slow_rep_time?: boolean
  /**đọc văn bản */
  is_read_text?: boolean
}
/**thiết lập chung */
export interface IPageGeneralConfig
  extends IPageGeneralConversationConfig,
    IPageGeneralAlertConfig,
    IPageGeneralMessageConfig,
    IPageGeneralChatConfig,
    IPageGeneralBusinessHourConfig,
    IPageGeneralInfoConfig {}
/**thiết lập tuỳ biến prompt */
export interface IPromptCustom {
  /**tuỳ biến prompt */
  prompt?: string
  /**có kích hoạt không */
  is_active?: boolean
}
/**AI -> nâng cao */
export interface IPageAiAdvanceConfig {
  /**tuỳ biến prompt */
  ai_custom_prompt?: IPromptCustom
  /**chọn model */
  ai_custom_model?: string
}
/**thiết lập của 1 CTA cụ thể */
export interface IPageAiCtaActionConfig {
  /**phạm vi áp dụng */
  apply?: IAiApplyType
  /**id widet sẽ kích hoạt */
  widget_id?: string
  /**có kích hoạt không */
  is_active?: boolean
}
/**AI -> thiết lập nút kêu gọi hành động (CTA) */
export interface IPageAiCtaConfig {
  /**đơn hàng */
  ai_cta_place_order?: IPageAiCtaActionConfig
  /**địa chỉ */
  ai_cta_address?: IPageAiCtaActionConfig
  /**số điện thoại */
  ai_cta_phone?: IPageAiCtaActionConfig
  /**email */
  ai_cta_email?: IPageAiCtaActionConfig
  /**link web */
  ai_cta_link?: IPageAiCtaActionConfig
  /**nhắc lịch */
  ai_cta_schedule_appointment?: IPageAiCtaActionConfig
  /**phương tiện di chuyển */
  ai_cta_transportation?: IPageAiCtaActionConfig
  /**giao dịch thanh toán */
  ai_cta_payment_transaction?: IPageAiCtaActionConfig
  /**hoá đơn mua hàng */
  ai_cta_invoice?: IPageAiCtaActionConfig
  /**nhận dạng giấy tờ */
  ai_cta_identify_document?: IPageAiCtaActionConfig
  /**nhận dạng qr */
  ai_cta_identify_qr?: IPageAiCtaActionConfig
}
/**tin nhắn chào mừng */
export interface IPageWebsiteWelcomeMessageConfig {
  /**tin nhắn chào mừng xuất hiện sau xx giây */
  delay?: number
  /**có kích hoạt không */
  is_active?: boolean
  /**nội dung */
  message?: string
}
/**website -> thiết lập chung */
export interface IPageWebsiteGeneralConfig {
  /**
   * ngôn ngữ
   * - undefined: tự động
   */
  web_language?: 'AUTO' | 'DEFAULT'
  /**ngôn ngữ mặc định */
  default_language?: string
  /**tự động chuyển ngôn ngữ theo khu vực */
  auto_change_language_by_region?: boolean
  /**
   * tên miền được phép sử dụng
   * - undefined: không giới hạn
   */
  allow_domain?: string[]
  /**tin nhắn chào mừng */
  welcome_message?: IPageWebsiteWelcomeMessageConfig
}
/**thiết lập AI */
export interface IPageAiConfig
  extends IPageAiGeneralConfig,
    IPageAiCtaConfig,
    IPageAiAdvanceConfig {}
/**dữ liệu của 1 ngôn ngữ của form */
export interface IPageWebsiteLeadFormSourceConfig {
  /**tiêu đề */
  title?: string
  /**mô tả */
  description?: string
}
/**website -> thông tin biểu mẫu */
export interface IPageWebsiteLeadFormConfig {
  /**thiết lập cho biểu mẫu */
  web_form?: {
    source?: Record<string, IPageWebsiteLeadFormSourceConfig>
    /**có kích hoạt không */
    is_active?: boolean
  }
}
export interface IPageWebsiteSocialPlatformItemConfig {
  /**loại nền tảng */
  type?: string
  /**giá trị */
  value?: string
  /**có kích hoạt không */
  is_active?: boolean
}
/**website -> link kết nối */
export interface IPageWebsiteSocialPlatformConfig {
  /**thiết lập link kết nối */
  social_platform?: {
    /**có kích hoạt không */
    is_active?: boolean
    /**mô tả, đa ngôn ngữ */
    description?: Record<string, string>
    /**link */
    data?: IPageWebsiteSocialPlatformItemConfig[]
  }
}
/**dữ liệu riêng của các nền tảng */
export interface IPagePlatformConfig {
  igu_id?: string
  ig_id?: string
  followers_count?: number
  follows_count?: number
  ig_username?: string
  /**id tài khoản instagram liên kết với page này */
  instagram_id?: string
  media_count?: number
  whatsapp_phone_list?: []

  link_fb_page_id?: string
  this_user_token?: string
  /**id page fb được liên kết với tk insta này */
  page_id?: string
}
/**thiết lập cho phép page khác sao chép thiết lập của page này */
export interface IPageCopySetting {
  copy_setting?: {
    /**có cho phép sao chép không */
    is_active?: boolean
    /**mã code đại diện cho trang gốc thay cho id trang */
    code?: string
    /**tuỳ chọn chỉ sao chép 1 số tính năng */
    select?: string[]
  }
}
/**dữ liệu thiết lập cho CAPI */
export interface ICapi {
  /**token SU */
  access_token?: string
  /**id đẩy even cho page */
  dataset_id?: string
  /**token page thường */
  page_access_token?: string
  /**id tạm của dạng page thường */
  page_dataset_id?: string
}
/**thiết lập cũ */
export interface IPageDeprecatedConfig {
  /**@deprecated id gói */
  pricing_id?: string
  /**@deprecated gắn cờ đã khởi tạo tenant */
  is_init_tenant?: boolean
  /**@deprecated đánh dấu trang nội bộ được dùng vĩnh viễn */
  is_internal?: boolean
  /**@deprecated thời gian gói hết hạn */
  end_date_trial?: number
  /**@deprecated thời gian gói dùng thử hết hạn */
  end_date?: number
  /**@deprecated đánh dấu trang bị chặn */
  is_block?: boolean
  /**@deprecated dữ liệu của capi */
  capi?: ICapi
  /**@deprecated đánh dấu trang đã từng dùng thử */
  has_trial?: boolean
}
/**thiết lập trả lời nhanh */
export interface IPageQuickReplyConfig {
  quick_reply?: {
    /**dịch */
    translate?: {
      /**ngôn ngữ đích */
      to?: string
      /**có kích hoạt không */
      is_active?: boolean
    }
    /**hoàn thành câu */
    is_complete_sentence?: boolean
  }
}
/**thiết lập chat website */
export interface IPageWebsiteConfig
  extends IPageWebsiteGeneralConfig,
    IPageWebsiteLeadFormConfig {}
/**dữ liệu của 1 trang */
export interface IPage
  extends IPageInfo,
    IPageFlag,
    IPageAssignConfig,
    IPageTriggerConfig,
    IPageGeneralConfig,
    IPageAiConfig,
    IPageWebsiteConfig,
    IPageQuickReplyConfig,
    IPagePlatformConfig,
    IPageDeprecatedConfig,
    IPageCopySetting {}

export interface PageData {
  /**tạo data key cho vitual scroll */
  data_key?: string
  page?: IPage
  staff_list?: AllStaffList
  label_list?: Record<string, ILabel>
  current_staff?: StaffInfo
  widget_list: AppInstalledInfo[]
  /**id nhóm admin */
  group_admin_id?: string
  /**id nhóm tổng */
  group_all_id?: string
  /**token cho đối tác */
  partner_token?: string
}

export interface PageList {
  [index: string]: PageData
}

export interface PageWebsiteCreate {
  name: string
  avatar?: string
  description?: string
}

export interface TabPlatform {
  [index: string]: {
    /**tên nền tảng */
    title: string
    /**đếm tổng số item của tab này */
    count: number
  }
}

export interface SelectPageData extends PageData {
  /**page có được chọn mới hay không */
  is_select?: boolean
}

/**đầu vào api lấy danh sách nhóm nhân viên */
export interface GetPageGroupStaff {
  fb_page_id: string
  sort?: string
  limit?: number
  skip?: number
}

/**dữ liệu của một nhóm nhân viên */
export interface GroupStaffInfo {
  /**thêm field vào để chọn */
  is_select?: boolean
  _id: string
  fb_page_id: string
  name: string
  type?: 'SYSTEM' | string
  description: string
}

export interface GetFbPostInfo {
  fb_page_id: {
    $in: string[]
  }
  sort?: string
  search?: string
}
