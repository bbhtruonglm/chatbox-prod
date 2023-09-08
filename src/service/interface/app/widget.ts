/**các trạng thái của app được cài */
export type AppInstalledStatus = 'SUCCESS'
/**vị trí của app được cài */
export type AppInstalledPosition = 'RIGHT'
/**kích thước của app được cài */
export type AppInstalledSize = 'MEDIUM'

/**các quyền có thể tiếp cận được */
export interface AccessRoleInfo {
    /**quyền thông tin cơ bản */
    public_profile: boolean
    /**quyền tin nhắn */
    conversation_message: boolean
    /**quyền thông tin khách hàng */
    conversation_contact: boolean
    /**quyền nhãn */
    conversation_label: boolean
    /**quyền ghi chú */
    conversation_last_note: boolean
    /**quyền nhân viên được assign */
    conversation_staff: boolean
    /**quyền chatbot */
    conversation_chatbot: boolean
}

/**dữ liệu của 1 app */
export interface AppInfo {
    /**tổng số app được cài */
    install_number: number
    /**các quyền app này cần */
    access_role: AccessRoleInfo
    /**id app */
    _id: string
    /**tên app */
    name: string
    /**url của người tạo ra app này */
    website_offical: string
    /**tên người tạo */
    partner_name: string
    /**url hiển thị iframe */
    url_app: string
    /**chú thích */
    description: string
    /**tài liệu hướng dẫn */
    document: string
    /**url icon */
    icon: string
    /**url dùng để cài app */
    url_auth: string
    /**icon đặc biệt hiển thị ở bottom */
    mini_icon: string
}

/**dữ liệu của app được page cài đặt */
export interface AppInstalledInfo {
    /**gắn cờ có hiển thị widget này không */
    is_show?: boolean
    /**id app được cài */
    _id: string
    /**trạng thái cài */
    status: AppInstalledStatus
    /**? */
    active_widget: boolean
    /**vị trí hiển thị */
    position: AppInstalledPosition
    /**sắp xếp vị trí */
    index_position: number
    /**kích cỡ hiển thị */
    app_installed_size: AppInstalledSize
    /**hiển thị với staff có những nhóm quyền nào */
    access_group: string[]
    /**các quyền của app */
    access_role_select: AccessRoleInfo,
    /**ẩn ở màn hình pc */
    hide_pc: boolean
    /**id của app */
    app_id: string
    /**id của page được cài */
    fb_page_id: string
    /**dữ liệu của app */
    snap_app: AppInfo
}