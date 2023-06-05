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
                        search_placeholder: 'Tìm kiếm trang hoặc ID trang',
                        all_platform: 'Tất cả',
                        fb_mess: 'Facebook',
                        website: 'Website',
                        fb_whatsapp: 'Whatsapp',
                        select_all_page: 'Chọn tất cả các trang',
                        munti_chat_page: 'Chat nhiều trang',
                        chat_now: 'Chat ngay',
                        inactive_page: {
                            title: 'Bạn có chắc chắn muốn ẩn trang này ?'
                        }
                    }
                }
            }
        }
    },
}

export default source