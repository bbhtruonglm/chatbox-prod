export interface StaffInfo {
    _id: string
    fb_page_id: string
    fb_staff_id: string
    name: string
    group_staff: string[]
    /**key cho vitual scroll */
    data_key?: string
    /**trạng thái trực tuyến của user */
    is_online?: boolean
    /**thời gian cuối cùng user ngoại tuyến */
    offline_time?: string
}

export interface AllStaffList {
    [index: string]: StaffInfo
}

export interface SelectStaffData extends StaffInfo {
    is_select?: boolean
    pricing_id?: string
}

export interface StaffSocket {
    fb_staff_id: string
    online_status: boolean
}