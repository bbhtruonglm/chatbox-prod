import type { AllStaffList, StaffInfo } from '@/service/interface/app/staff'
import type { LabelInfo } from './label'
import type { AppInstalledInfo } from './widget'

export type PageType = 'FB_MESS' | 'ZALO' | 'WEBSITE' | 'FB_WHATSAPP'

export interface PageInfo {
    fb_page_id: string
    type: PageType
    name: string
    avatar?: string
    /**thời gian hết hạn gói dùng thử */
    end_date_trial?: number
    /**thời gian hết hạn gói hiện tại */
    end_date?: number
    /**id của gói hiện tại */
    pricing_id?: string
    is_priority?: boolean
    is_active?: boolean
    /**page này là page nội bộ được sử dụng vĩnh viễn */
    is_internal?: boolean
    /**page này bị hệ thống chặn */
    is_block?: boolean
}

export interface PageData {
    /**tạo data key cho vitual scroll */
    data_key?: string
    page?: PageInfo
    staff_list?: AllStaffList
    label_list?: {
        [index: string]: LabelInfo
    }
    current_staff?: StaffInfo
    widget_list: AppInstalledInfo[]
    /**id nhóm admin */
    group_admin_id?: string
    /**id nhóm tổng */
    group_all_id?: string
}

export interface PageList {
    [index: string]: PageData
}

export interface PageWebsiteCreate {
    name: string
    avatar?: string
    description?: string
}

export interface TabPlatform {
    [index: string]: {
        /**tên nền tảng */
        title: string,
        /**đếm tổng số item của tab này */
        count: number
    }
}

export interface SelectPageData extends PageData {
    /**page có được chọn mới hay không */
    is_select?: boolean
}