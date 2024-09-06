import type { FacebookCommentPost } from '@/service/interface/app/post'

/**dữ liệu của một tin nhắn */
export interface MessageInfo {
  /**AI đánh dấu là tin bị rep chậm */
  is_ai_slow_reply?: true
  /**hệ thống đánh dấu tin bị rep chậm */
  is_system_slow_reply?: true
  /**id bản ghi mongo */
  _id: string
  /**tin nhắn này thuộc loại gì */
  platform_type?: 'FB_MESS' | 'FB_POST'
  /**id trang */
  fb_page_id: string
  /**id khách hàng */
  fb_client_id: string
  /**tin nhắn được gửi từ đâu */
  message_type: 'page' | 'client' | 'system' | 'note' | 'activity'
  /**thời gian tin được gửi */
  time: string
  /**nội dung tin nhắn văn bản */
  message_text?: string
  /**nội dung tin nhắn dạng postback - người dùng click vào button */
  postback_title?: string
  /**nội dung tệp đính kèm */
  message_attachments?: AttachmentInfo[]
  /**id của tin nhắn ở hệ thống chính */
  message_mid?: string
  /**thông tin thêm của tin nhắn này */
  message_metadata?: string
  /** id quảng cáo */
  ad_id?: string
  /** id bài post fb */
  fb_post_id?: string
  /**dữ liệu khi comment */
  comment?: FacebookCommentPost
  /**thời gian tạo bản ghi của server */
  createdAt: string
  /**mid của tin được reply nếu có */
  replay_mid?: string
  /**nội dung tin nhắn trước đó được reply nếu có */
  snap_replay_message?: MessageInfo
  /**dữ liệu của AI */
  ai?: MessageAiData[]
}

/**dữ liệu AI của một phần tử */
export interface MessageAiData {
  /**sdt */
  phone?: string
  /**email */
  email?: string
  /**địa chỉ */
  address?: string
  /**cảm xúc */
  emotion?: string
  /**dữ liệu được orc từ media -> text */
  ocr?: string
  /**dữ liệu được chuyển từ text -> CTA */
  cta?: string
  /**id mongo tự tạo */
  _id?: string
  /**tóm tắt orc */
  summary?: string
}

/**dữ liệu của một mẫu tin nhắn */
export interface MessageTemplateInput {
  /**hình ảnh */
  image?: {
    /**đường dẫn hình ảnh */
    url?: string
  }
  /**video */
  video?: {
    /**đường dẫn video */
    url?: string
  }
  /**audio */
  audio?: {
    /**đường dẫn audio */
    url?: string
  }
  /**tập tin khác */
  file?: {
    /**đường dẫn tập tin */
    url?: string
  }
  /**tiêu đề */
  title?: string
  /**nội dung */
  content?: string
  /**danh sáchnút */
  list_button?: MessageTemplateButton[]
  /**có xử lý AI thành công */
  is_ai?: boolean
  /**dữ liệu AI nếu có */
  ai?: MessageAiData
}
/**dữ liệu của một nút bấm của mẫu tin nhắn */
export interface MessageTemplateButton {
  /**kiểu của nút này */
  type?: ButtonType
  /**tiêu đề nút */
  title?: string
  /**đường dẫn của nút */
  url?: string
}

/**đầu vào của api */
export interface QueryMessage {
  /**id trang */
  page_id?: string
  /**id khách hàng */
  client_id?: string
  /**phân trang */
  skip?: number
  /**phân trang */
  limit?: number
}

/**các loại tệp fb cho phép gửi */
export type FileTypeInfo = 'audio' | 'file' | 'image' | 'template' | 'video'

/**body khi gửi tin nhắn */
export interface SendMesageInput {
  /**id trang */
  page_id: string
  /**id khách hàng */
  client_id: string
  /**nội dung tin nhắn dạng văn bản */
  text?: string
  attachment?: {
    /**link của file muốn gửi */
    url: string
    /**file muốn gửi là loại gì */
    type: FileTypeInfo
  }
  /**các dạng tin nhắn */
  type:
    | 'FACEBOOK_MESSAGE' // tin nhắn dạng inbox
    | 'FACEBOOK_POST' // tin nhắn dạng trả lời bài post
    // | 'WHATSAPP'         // tin nhắn nền tảng whatsapp
    // | 'INSTAGRAM'        // tin nhắn nền tảng instagram
    | 'INTERNAL_MESSAGE' // tin nhắn dạng nội bộ, không gửi cho khách hàng
}

/**nội dung của tin nhắn tạm vừa được gửi */
export interface TempSendMessage {
  /**id của tin nhắn */
  message_id?: string
  /**nội dung tin nhắn đã gửi */
  text: string
  /**thời gian gửi tin nhắn */
  time: string
  /**lỗi khi gửi tin nhắn */
  error?: boolean
  /**id tạm dưới client */
  temp_id: string
}

/**dữ liệu 1 file */
export interface AttachmentInfo {
  /**thêm index để mapping */
  index?: number
  /**file là dạng gì */
  type?: 'image' | 'video' | 'audio' | 'file' | 'template' | 'fallback'
  /**tiêu đề */
  title?: string
  /**đường link */
  url?: string
  /**nội dung dữ liệu */
  payload?: {
    /**đường dẫn của file */
    url?: string
    /**kiểu của tin nhắn này */
    template_type?: 'button' | 'generic' | 'media'
    /**dữ liệu tin nhắn dạng carousel */
    elements?: AttachmentPayload[]
    /**dữ liệu của nút bấm */
    buttons?: ChatbotButton[]
    /**tiêu đề trang */
    title?: string
  }
}
/**dữ liệu kiểu slider */
export interface AttachmentPayload {
  /**tiêu đề */
  title?: string
  /**chú thích */
  subtitle?: string
  /**link ảnh hiển thị */
  image_url?: string
  /**link của video - tạo thêm */
  video_url?: string
  /**link của audio - tạo thêm */
  audio_url?: string
  /**link của file - tạo thêm */
  file_url?: string
  /**link của cả khối */
  item_url?: string
  /**dữ liệu của nút bấm */
  buttons?: ChatbotButton[]

  /**kiểu của file */
  media_type?: 'image' | 'video'
  /**đường link của file */
  url?: string
}
/**dữ liệu file được cache */
export interface AttachmentCacheList {
  [index: string]: AttachmentInfo[]
}

/**đầu vào api đọc nội dung file */
export interface InputGetUrlAttachment {
  /**id của đối tượng mục tiêu */
  target_id: string
  /**kiểu của đối tượng */
  type: 'MESSAGE' | 'POST' | 'COMMENT'
  /**id trang */
  page_id: string
}

/**kiểu của nút */
export type ButtonType =
  | 'postback'
  | 'web_url'
  | 'phone_number'
  | 'bbh_place_order'
  | 'bbh_create_transaction'
  | 'bbh_schedule_appointment'

/**dữ liệu dạng nút bấm */
export interface ChatbotButton {
  /**dạng của nút này */
  type?: ButtonType
  /**tiêu đề của nút */
  title?: string
  /**hành động của nút này */
  payload?: string
  /**link của nút */
  url?: string
}

/**dữ liệu của trả lời nhanh */
export interface QuickAnswerInfo {
  /** ID bản ghi */
  id?: string
  /** Tiêu đề */
  title?: string
  /** Nội dung */
  content?: string
  /** ID page fb */
  fb_page_id?: string
  /** Danh sách ảnh đính kèm */
  list_images?: string[]
  /**dánh dấu là tính năng của AI đính kèm */
  is_ai?: boolean
}
