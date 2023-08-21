import type { PageType } from './page'

export interface FilterConversation {
    /**lọc hội thoại chưa đọc */
    unread_message?: boolean
    /**tìm kiếm hội thoại theo tên | sdt | email */
    search?: string
    /**lọc hội thoại có tên */
    have_client_name?: boolean
    /**hiển thị tất cả hội thoại | chỉ hiển thị tin nhắn | chỉ hiển thị bình luận */
    display_style?: 'ALL' | 'INBOX' | 'COMMENT'
    /**lọc hội thoại có | không có số điện thoại */
    have_phone?: 'YES' | 'NO'
    /**lọc hội thoại không có uid */
    not_have_fb_uid?: boolean
    /**lọc theo thời gian */
    time_range?: {
        /**thời gian bắt đầu */
        gte?: number
        /**thời gian kết thúc */
        lte?: number
    }
    /**lọc các hội thoại của 1 nhân viên */
    staff_id?: string
    /**lọc hội thoại bị gắn cờ spam */
    is_spam_fb?: 'YES' | 'NO'
    /**lọc hội thoại theo nhãn or */
    label_id?: string
    /**lọc hội thoại theo nhãn and */
    label_and?: boolean
    /**lọc hội thoại không có nhãn x */
    not_label_id?: string
    /**lọc hội thoại chưa trả lời */
    not_response_client?: boolean
    /**lọc hội thoại chưa gắn nhãn */
    not_exist_label?: boolean
    /**lọc hội thoại có email */
    have_email?: 'YES' | 'NO'
    /**lọc theo nền tảng */
    platform_type?: string
    /**lọc theo bài viết */
    post_id?: string
}

export interface QueryConversationInput extends FilterConversation {
    /**lọc theo danh sách page: "ID_1 ID_2 ID_3 ID_4" */
    page_id: string
    /**phân trang */
    skip?: number
    /**phân trang */
    limit?: number
    /**sắp xếp */
    sort?: string
    /**phân trang kiểu con trỏ */
    after?: number[]
}

/**dữ liệu của một khách hàng */
export interface ConversationInfo {
    /**key cho vitual scroll */
    data_key?: string
    /**id của trang */
    fb_page_id: string
    /**id của khách hàng */
    fb_client_id: string
    /**kiểu của hội thoại này */
    platform_type?: PageType
    /**id của nhân viên được assign cho khách này */
    fb_staff_id?: string
    /**tên khách hàng */
    client_name?: string
    /**tin nhắn cuối cùng */
    last_message?: string
    /**tin nhắn cuối cùng của ai */
    last_message_type: 'client' | 'page'
    /**danh sách id các nhãn được gắn */
    label_id?: string[]
    /**đếm tổng sổ các tin nhắn chưa đọc */
    unread_message_amount?: number
    /**thời gian tin nhắn cuối cùng được gửi */
    last_message_time?: number
    /**sdt của khách hàng */
    client_phone?: string
    /**thông tin thêm của khách hàng */
    client_bio?: {
        /**uid fb quét được */
        fb_uid?: string
    },
}

/**dữ liệu khách hàng dạng obj để dễ update */
export interface ConversationList {
    [index: string]: ConversationInfo
}

export interface QueryConversationResponse {
    conversation?: ConversationList
    count?: number
    after?: number[]
    result?: ConversationInfo[]
}