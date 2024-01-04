/**các cài đặt cho một môi trường */
export interface Env {
    /**cài đặt cho local */
    local_storage: {
        /**prefix cho tên của local */
        prefix: string
    }
    /**danh sách các domain của api */
    host: {
        n3_socket: string
        n4_service_v1: string
        n4_service_v2: string
        n5_app_v1: string
        n5_app_v2: string
        n6_static: string
        n8_merge: string
        widget: string
        page_setting_view: string
        analytic_view: string
        chatbot_view: string
        download_client: string
    }
    /**cài đặt cho riêng facebook */
    facebook: {
        /**id của app facebook */
        app_id: string
        permissions: string[]
        /**các tuỳ chọn khi đăng nhập */
        login_option: {
            return_scopes?: boolean
            auth_type?: string
            enable_profile_selector?: boolean
        }
    }
    /**danh sách các nền tảng được kết nối với hệ thống chatobox */
    platform: string[]
    /**host của url link ảnh */
    img_host: string
}