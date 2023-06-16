export interface StaffInfo {
    _id: string
    fb_page_id: string
    fb_staff_id: string
    name: string
    group_staff: string[]
}

export interface AllStaffList {
    [index: string]: StaffInfo
}

export interface SelectStaffData extends StaffInfo {
    is_select?: boolean
    pricing_id?: string
}