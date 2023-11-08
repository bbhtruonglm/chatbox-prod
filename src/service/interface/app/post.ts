/**dữ liệu của một bình luận */
export interface FacebookCommentPost {
    comment_id: string
    from?: {
        id?: string
        name?: string
    }
    message: string
    photo?: string
    /**gắn cờ đã load hết child comment */
    done_load_comment?: boolean
    /**phân trang */
    skip_comment?: number
    child_comments?: FacebookCommentPost[]

    // * Flag
    new_comment?: string
    sending_message?: boolean

    // * Time
    createdAt?: string
}