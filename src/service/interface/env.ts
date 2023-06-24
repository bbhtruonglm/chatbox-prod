export interface Env {
    /**cài đặt cho local */
    local_storage: {
        /**prefix cho tên của local */
        prefix: string
    }
    /**danh sách các domain của api */
    host: {
        n3_socket: string
        n4_service: string
    }
    /**cài đặt cho riêng facebook */
    facebook: {
        /**id của app facebook */
        app_id: string
        /**các tuỳ chọn khi đăng nhập */
        login_option: {}
    }
    /**danh sách các nền tảng được kết nối với hệ thống chatobox */
    platform: string[]
}