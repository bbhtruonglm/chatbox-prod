import type { Language } from '@/service/interface/language'

const source: Language = {
    name: 'Tiếng Việt',
    v1: {
        common: {
            title: 'Chatbox Bot Bán Hàng',
            loading: 'Đang tải dữ liệu ...',
            cancel: 'Huỷ',
            ok: 'Xác nhận',
            search: 'Tìm kiếm',
            success: 'Thành công',
            page: 'Trang',
            setting: 'Cài đặt',
            page_search_placeholder: 'Tìm kiếm trang hoặc ID trang',
            upcoming_feature: 'Tính năng sắp được ra mắt!',
            all: 'Tất cả',
            fb_mess: 'Facebook',
            website: 'Website',
            fb_whatsapp: 'Whatsapp',
            status: 'Trạng thái',
            staff: 'Nhân viên',
            month: 'Tháng',
            type: 'Loại',
            select_all: 'Chọn tất cả',
            active: 'Kích hoạt',
            chatbox: 'Chatbox',
            unsupport_message: 'Nội dung tin nhắn này hiện tại chưa thể hiển thị được, vui lòng liên hệ với quản trị viên hệ thống',
            close: 'Đóng'
        },
        view: {
            network: {
                disconnect: 'Mất kết nối mạng...',
                connected: 'Đã kết nối mạng!'
            },
            adblocker: {
                title: 'Hãy tắt các tiện ích chặn quảng cáo bạn đang sử dụng đối với trang này, để không làm ảnh hưởng đến các tính năng của chatbox',
            },
            datepicker: {
                minute: 'Phút',
                hour: 'Giờ',
                month: 'Tháng',
                year: 'Năm',
                day: {
                    1: 'Th2',
                    2: 'Th3',
                    3: 'Th4',
                    4: 'Th5',
                    5: 'Th6',
                    6: 'Th7',
                    0: 'CN',
                }
            },
            oauth: {
                login: {
                    login: 'Đăng nhập',
                    btn_text: 'Tiếp tục với Facebook'
                }
            },
            main: {
                dashboard: {
                    nav: {
                        chat: 'Chat',
                        noti: 'Thông báo',
                        toggle: 'Thu nhỏ',
                        select_page: 'Chọn trang',
                        select_platform: 'Kết nối nền tảng',
                        upgrade: 'Quản lý nâng cấp',
                        widget: 'Chợ ứng dụng'
                    },
                    select_page: {
                        select_all_page: 'Chọn tất cả các trang',
                        munti_chat_page: 'Chat nhiều trang',
                        chat_now: 'Chat ngay',
                        inactive_page: {
                            title: 'Bạn có chắc chắn muốn ẩn trang này ?'
                        },
                        empty_page: {
                            title: 'Không có trang nào được chọn',
                            description: 'Hãy chọn kết nối nền tảng để chọn kênh chat!'
                        },
                        expire: {
                            title: 'Có lỗi xảy ra',
                            description: 'Không tìm thấy gói cước nào đã được kích hoạt cho người dùng, các trang hoặc cài đặt đã bị thay đổi. Đi đến trang nâng cấp gói để sửa cài đặt.',
                            go_pricing: 'Đi đến trang quản lý nâng cấp',
                            actived: 'Đã kích hoạt',
                            inactive: 'Chưa kích hoạt'
                        }
                    },
                    select_platform: {
                        empty_page: 'Không tìm thấy trang của bạn?',
                        add_page: 'Thêm trang',
                        click_add_page: 'Bấm thêm trang để bắt đầu!',
                        active: 'Kích hoạt',
                        create_website: {
                            title: 'Thêm kết nối Website',
                            description: 'Mô tả',
                            enter_description: 'Nhập mô tả',
                            link_website: 'Link Website',
                            enter_link_website: 'website.com',
                            link_icon: 'Đường dẫn icon',
                            enter_link_icon: 'Nhập đường dẫn icon',
                            success: 'Tạo kết nối Website thành công'
                        },
                        success: 'Kích hoạt các trang thành công'
                    },
                    pricing: {
                        help: {
                            you_need_help: 'Bạn cần hỗ trợ,',
                            connect_us: 'kết nối với chúng tôi'
                        },
                        pricing_detail: 'Chi tiết giao dịch',
                        create_pricing: 'Tạo gói nâng cấp',
                        empty_pricing: 'Bạn chưa có gói, bấm "Tạo gói nâng cấp" để bắt đầu',
                        type: {
                            actived: 'Thành công',
                            created: 'Đang chờ',
                            expired: 'Hết hạn',
                            cancelled: 'Đã huỷ',
                        },
                        detail: {
                            title: 'Chi tiết hoá đơn',
                            invoice_id: 'Mã hoá đơn',
                            created_at: 'Ngày khởi tạo',
                            payment: 'Thành tiền',
                            price: 'Giá gốc',
                            selected_page: 'Số trang',
                            selected_month: 'Số tháng',
                            selected_staff: 'Số nhân viên',
                            payment_method: 'Phương thức thanh toán',
                            payment_method_detail: {
                                manual: 'Chuyển khoản'
                            },
                            unlimited: 'Không giới hạn',
                            discount: 'Ưu đãi',
                            cost_staff: 'Chi phí nhân viên',
                        },
                        type_info: {
                            actived: 'Kích hoạt thành công',
                            created: 'Đã khởi tạo',
                            expired: 'Đã hết hạn',
                            cancelled: 'Đã huỷ giao dịch',
                        },
                        action: {
                            upgrade: 'Mua thêm',
                            disconnect: 'Ngắt kết nối'
                        },
                        create: {
                            package: 'Gói',
                            package_description: 'Chọn gói',
                            page: 'Số trang',
                            month: 'Số tháng',
                            staff: 'Số nhân viên',
                            page_description: 'Chọn số trang',
                            month_description: 'Chọn số tháng',
                            staff_description: 'Chọn số nhân viên',
                            code: {
                                UNLIMITED_12_UNLIMITED: 'Không giới hạn một năm',
                                UNLIMITED_12_30: 'Không giới hạn trang và 30 nhân viên một năm',
                                UNLIMITED_12_60: 'Không giới hạn trang và 60 nhân viên một năm',
                                CUSTOM: 'Gói tự chọn',
                            },
                            success: 'Khởi tạo gói thành công'
                        },
                        upgrade: {
                            title: 'Nâng cấp gói',
                            page: 'Mua thêm trang',
                            staff: 'Mua thêm nhân viên',
                            page_price: 'Chi phí mua thêm trang',
                            staff_price: 'Chi phí mua thêm nhân viên',
                            month: 'Số tháng còn lại',
                            success: 'Đã khởi tạo lệnh nâng cấp gói'
                        },
                        cancel: {
                            title: 'Bạn có chắc chắn muốn huỷ thanh toán'
                        },
                        setting: {
                            title: 'Cài đặt gói',
                            page_not_found: 'Không tìm thấy trang',
                            staff_not_found: 'Không tìm nhân viên'
                        },
                        disconnect: {
                            title: 'Bạn có chắn chắn muốn ngắt kết nối gói này?'
                        }
                    },
                    chat: {
                        filter: {
                            title: 'Lọc tin nhắn',
                            interact: {
                                title: 'Lọc tương tác',
                                message: 'Tương tác từ nhắn tin',
                                comment: 'Tương tác từ bình luận'
                            },
                            message: {
                                title: 'Lọc trạng thái tin nhắn',
                                unread: 'Tin nhắn chưa đọc',
                                not_reply: 'Tin nhắn chưa phản hồi',
                                not_tag: 'Tin nhắn chưa gắn nhãn',
                                spam: 'Tin nhắn spam',
                            },
                            phone: {
                                title: 'Lọc số điện thoại',
                                include_phone: 'Có số điện thoại',
                                exclude_phone: 'Không có số điện thoại'
                            },
                            time: {
                                title: 'Lọc theo thời gian',
                                today: 'Hôm nay',
                                yesterday: 'Hôm qua',
                                day_ago_7: '7 ngày trước',
                                day_ago_30: '30 ngày trước',
                                day_ago_90: '90 ngày trước',
                                custom: 'Tuỳ chỉnh thời gian',
                                from: 'Từ ngày',
                                to: 'Đến ngày'
                            },
                            label: {
                                title: 'Gắn nhãn',
                                filteration_condition: 'Điều kiện lọc:',
                                and: 'Và',
                                or: 'Hoặc',
                                find_tag : 'Tìm kiếm nhãn'
                            },
                            exclude_label: {
                                title: 'Loại trừ nhãn'
                            },
                            staff: {
                                title: 'Lọc theo nhân viên',
                                find_staff: 'Tìm kiếm nhân viên'
                            },
                            comment: {
                                title: 'Lọc bình luận'
                            },
                            un_filter: 'Xoá lọc',
                        },
                        search: 'Tìm kiếm hội thoại',
                        error: {
                            get_page_info: 'Không tìm thấy dữ liệu trang'
                        },
                        online_status: {
                            online: 'Đang trực tuyến',
                            offline: 'Đã ngoại tuyến'
                        },
                        you: 'Bạn:',
                        empty_conversation: 'Không tìm thấy hội thoại!',
                        empty_select_conversation: 'Chọn một khách hàng để bắt đầu!',
                        assign_staff: {
                            title: 'Phân công nhân viên'
                        },
                        input: {
                            add_tag: 'Gắn thẻ',
                        }
                    }
                }
            }
        }
    },
}

export default source