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

export interface FacebookPost {
    _id: string
    id: string
    content: {
        admin_creator: {
            name: string,
            id: string
        },
        attachments: {
            data: [
                {
                    media: {
                        image: {
                            height: number
                            src: string
                            width: number
                        },
                        source: string
                    },
                    target: {
                        id: string
                        url: string
                    },
                    type: string
                    url: string
                }
            ]
        },
        message: string
        created_time: string
        permalink_url: string
        updated_time: string
        from: {
            name: string,
            id: string
        },
        id: string
    }
    attachments: {
        data: [
            {
                media: {
                    image: {
                        height: number,
                        src: string,
                        width: number
                    },
                    source: string
                },
                target: {
                    id: string,
                    url: string
                },
                type: string,
                url: string
            }
        ]
    }
    createdAt: string
    created_time: string
    creator_name: string
    fb_page_id: string
    fb_post_id: string
    message: string
    permalink_url: string
    updatedAt: string
    updated_time: string
    is_selected?: boolean
}