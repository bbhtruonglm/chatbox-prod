import type { StaffInfo } from '@/service/interface/app/staff'

export type PageType = 'FB_MESS' | 'ZALO' | 'WEBSITE' | 'FB_WHATSAPP'

export interface PageInfo {
    fb_page_id: string
    type: PageType
    name: string
    avatar?: string
    end_date_trial?: number
    end_date?: number
    pricing_id?: string
    is_priority?: boolean
    is_active?: boolean
}

export interface PageData {
    page?: PageInfo
    staff_list?: {
        [index: string]: StaffInfo
    }
}

export interface PageList {
    [index: string]: PageData
}

export interface PageWebsiteCreate {
    name: string
    avatar?: string
    description?: string
}