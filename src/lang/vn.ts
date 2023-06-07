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
            upcoming_feature: 'Tính năng sắp được ra mắt!'
        },
        view: {
            oauth: {
                login: {
                    login: 'Đăng nhập',
                    btn_text: 'Tiếp tục với Facebook'
                }
            },
            main: {
                dashboard: {
                    nav: {
                        noti: 'Thông báo',
                        toggle: 'Thu nhỏ',
                        select_page: 'Chọn trang',
                        select_platform: 'Kết nối nền tảng',
                        upgrade: 'Quản lý nâng cấp'
                    },
                    select_page: {
                        all_platform: 'Tất cả',
                        fb_mess: 'Facebook',
                        website: 'Website',
                        fb_whatsapp: 'Whatsapp',
                        select_all_page: 'Chọn tất cả các trang',
                        munti_chat_page: 'Chat nhiều trang',
                        chat_now: 'Chat ngay',
                        inactive_page: {
                            title: 'Bạn có chắc chắn muốn ẩn trang này ?'
                        },
                        empty_page: {
                            title: 'Không có trang nào được chọn',
                            description: 'Hãy chọn kết nối nền tảng để chọn kênh chat!'
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
                    }
                }
            }
        }
    },
}

export default source