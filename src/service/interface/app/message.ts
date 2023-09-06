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
    message_attachments?: []
    /**id của tin nhắn ở hệ thống chính */
    message_mid?: string
    /**thông tin thêm của tin nhắn này */
    message_metadata?: string
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
}