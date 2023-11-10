import type { FileTypeInfo } from '@/service/interface/app/message'

/**các kiểu tệp fb cho phép khi upload */
export const FB_VALID_FILE_TYPE = ['audio', 'file', 'image', 'video']

/**phân tích file type của FB từ minetype */
export const getFbFileType = (mine_type: string): FileTypeInfo => {
    /**kiểu của file phân tích được */
    let type = mine_type?.split('/')?.[0]

    /**kết quả */
    let result: FileTypeInfo

    // nếu không tìm thấy kiểu phù hợp thì fix kiểu mặc định
    if (!FB_VALID_FILE_TYPE.includes(type)) result = 'file'
    else result = type as FileTypeInfo

    return result
}