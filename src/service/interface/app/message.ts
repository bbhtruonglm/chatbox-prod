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