/**dữ liệu của một nhãn */
export interface LabelInfo {
    type: 'custom'
    text_color: string
    bg_color: string
    _id: string
    fb_page_id: string
    title: string
    /**dánh dấu thêm, nhãn có được chọn hay không */
    is_selected?: boolean
    /** trạng thái hiển thị khi lọc theo page */
    show_label?: boolean
}