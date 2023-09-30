/**dữ liệu của một tin nhắn */
export interface MessageInfo {
    /**id bản ghi mongo */
    _id: string
    /**tin nhắn này thuộc loại gì */
    platform_type?: 'FB_MESS' | 'FB_POST'
    /**id trang */
    fb_page_id: string
    /**id khách hàng */
    fb_client_id: string
    /**tin nhắn được gửi từ đâu */
    message_type: 'page' | 'client' | 'system' | 'note'
    /**thời gian tin được gửi */
    time: string
    /**nội dung tin nhắn văn bản */
    message_text?: string
    /**nội dung tệp đính kèm */
    message_attachments?: AttachmentInfo[]
    /**id của tin nhắn ở hệ thống chính */
    message_mid?: string
    /**thông tin thêm của tin nhắn này */
    message_metadata?: string
    /** id quảng cáo */
    ad_id?:string
    /** id bài post fb */
    fb_post_id?: string
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

/**body khi gửi tin nhắn */
export interface SendMesageInput {
    /**id trang */
    page_id: string
    /**id khách hàng */
    client_id: string
    /**nội dung tin nhắn dạng văn bản */
    text?: string
    /**các dạng tin nhắn */
    type:
    'FACEBOOK_MESSAGE'      // tin nhắn dạng inbox
    | 'FACEBOOK_POST'       // tin nhắn dạng trả lời bài post
    // | 'WHATSAPP'         // tin nhắn nền tảng whatsapp
    // | 'INSTAGRAM'        // tin nhắn nền tảng instagram
    | 'INTERNAL_MESSAGE'    // tin nhắn dạng nội bộ, không gửi cho khách hàng
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
}

/**dữ liệu 1 file */
export interface AttachmentInfo {
    /**file là dạng gì */
    type?: 'image' | 'video' | 'audio' | 'template'
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
        elements?: ChatbotSlider[]
        /**dữ liệu của nút bấm */
        buttons?: ChatbotButton[]
    }
}
/**dữ liệu kiểu slider */
export interface ChatbotSlider {
    /**tiêu đề */
    title?: string
    /**chú thích */
    subtitle?: string
    /**link ảnh hiển thị */
    image_url?: string
    /**link của cả khối */
    item_url?: string
    /**dữ liệu của nút bấm */
    buttons?: ChatbotButton[]
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

/**dữ liệu dạng nút bấm */
export interface ChatbotButton {
    /**dạng của nút này */
    type?: 'postback'
    /**tiêu đề của nút */
    title?: string
    /**hành động của nút này */
    payload?: string
}

export interface QuickAnswerInfo {
    /** ID bản ghi */
    id: string
    /** Tiêu đề */
    title: string
    /** Nội dung */
    content: string
    /** ID page fb */
    fb_page_id: string
    /** Danh sách ảnh đính kèm */
    list_images: string[]
}