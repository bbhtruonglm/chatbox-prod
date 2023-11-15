import type { FileTypeInfo } from '@/service/interface/app/message'

/**dữ liệu đánh đấu file thuộc về trang nào và thư mục nào */
export interface FromFile {
    /**id trang */
    page_id: string
    /**lấy từ thư mục */
    folder_id?: string
}
/**đầu vào api đọc danh sách tập tin */
export interface GetFileInput extends FromFile {
    /**phân trang */
    skip?: number
    /**phân trang */
    limit?: number
}
/**dữ liệu của một tập tin */
export interface FileInfo {
    /**id bản ghi */
    _id: string
    /**kiểu của tập tin */
    mimetype: string
    /**tên gốc */
    original_name: string
    /**đường dẫn đến tập tin */
    url: string
    /**danh sach id ảnh được tạo sẵn dành cho gửi ảnh quả ext */
    fb_image_id: string[]
    /**gắn thêm cờ đã chọn */
    is_select?: boolean
}
/**dữ liệu file khi được upload */
export interface UploadFile {
    /**dữ liệu gốc của file */
    source?: File
    /**kiểu fb của file */
    type: FileTypeInfo
    /**gắn cờ đã gửi xong */
    is_done?: boolean
    /**có hiển thị loading không */
    is_loading?: boolean
    /**dùng để hiển thị hình ảnh */
    preview?: any
    /**link hình ảnh đã có sẵn từ album */
    url?: string
    /**id tải trước của fb dành cho gửi ảnh qua ext */
    fb_image_id?: string
}
/**đầu vào api cập nhật, xoá file */
export interface UpdateFileInfo {
    /**id trang */
    page_id: string
    /**id tập tin */
    file_id: string
}
/**đầu vào api đọc danh sách thư mục */
export interface GetFolderInput {
    /**id trang */
    page_id: string
    /**phân trang */
    skip?: number
    /**phân trang */
    limit?: number
}
/**dữ liệu của 1 thư mục */
export interface FolderInfo {
    /**id bản ghi */
    _id: string
    /**tên thư mục */
    title: string
}
/**cập nhật dữ liệu thư mục */
export interface UpdateFolderInput {
    /**id trang */
    page_id: string
    /**lấy từ thư mục */
    folder_id?: string
    /**tên mới */
    title: string
}
/**đầu vào api tạo mới thư mục */
export interface CreateFolderInput {
    /**id trang */
    page_id: string
    /**tên mới */
    title: string
}