export interface PricingInfo {
    /**id db của gói */
    _id: string
    /**trạng thái thanh toán */
    payment_status: 'CREATED' | 'APPROVED' | 'CANCELLED'
    /**trạng thái của gói */
    pricing_status: 'CREATED' | 'ACTIVED' | 'EXPIRED' | 'CANCELLED'
    /**danh sách trang được kích hoạt */
    list_pages: string[]
    /**danh sách nhân viên được kích hoạt */
    list_staffs: string[]
    /**id db của chatbot user */
    user_id: string
    /**thông tin của gói này */
    package: {
        /**số trang */
        selected_page: number | 'UNLIMITED'
        /**số tháng */
        selected_month: number
        /**số nhân viên */
        selected_staff: number | 'UNLIMITED'
        /**đơn vị tiền tệ */
        currency: 'VND'
        /**giá gốc */
        price: number
        /**chi phí nhân viên them */
        cost_staff: number
        /**giảm giá */
        discount: number
        /**thành tiền */
        payment: number
    },
    /**phương thức thanh toán */
    payment_method: 'MANUAL'
    /**id hoá đơn */
    invoice_id: string
    /**ngày bắt đầu */
    end_date?: string
    /**ngày kết thúc */
    start_date?: string
    createdAt: string
}