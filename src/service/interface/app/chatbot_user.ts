export interface ChatbotUserInfo {
    /**id của bản ghi */
    _id: string
    /**id của fb */
    fb_staff_id: string
    /**tên */
    full_name: string
    /**id gói */
    pricing_id?: string
    /**ngày gói hết hạn */
    end_date?: string
    /**dữ liệu tải về */
    download?: {
        /**thời gian tải cuối cùng */
        active_time?: number
        /**trạng thái tạo tệp */
        status?: 'DONE' | 'ON_PROGESS'
        /**tổng số dữ liệu đã tạo */
        current?: number
        /**tổng số toàn bộ dữ liệu */
        total?: number
    }
}

export interface PersonalSettings {
    [index: string] : boolean | string
}