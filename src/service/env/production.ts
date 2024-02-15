/**
 * .env.prod
 */

import type { Env } from '@/service/interface/env'

const ENV: Env = {
    local_storage: {
        prefix: 'chatbox_'
    },
    host: {
        n3_socket: 'wss://chatbox-socket.botbanhang.vn',
        n4_service_v1: 'https://chatbox-service.botbanhang.vn',
        n4_service_v2: 'https://chatbox-service-v3.botbanhang.vn',
        n5_app_v1: 'https://chatbox-app.botbanhang.vn',
        n5_app_v2: 'https://chatbox-app-v2.botbanhang.vn',
        n6_static: 'https://chatbox-static-v3.botbanhang.vn',
        n8_merge: 'https://chatbox-merge.botbanhang.vn',
        widget: 'https://chatbox-widget.botbanhang.vn',
        page_setting_view: 'https://setting-chatbox.botbanhang.vn',
        analytic_view: 'https://analytic-chatbox.botbanhang.vn/#/',
        chatbot_view: 'https://bot.botbanhang.vn/#/',
        download_client: 'https://chatbox-merge.botbanhang.vn/download'
    },
    facebook: {
        app_id: '303503746720418',
        permissions: [
            'public_profile',
            'pages_show_list',
            'pages_read_engagement',
            'pages_messaging',
            'email',
            'pages_read_user_content',
            'instagram_basic',
            'instagram_manage_comments',
            'instagram_manage_insights',
            'business_management',
            'ads_management',
            'read_insights',
            'pages_manage_metadata',
            'pages_manage_ads',
            'pages_manage_posts',
            'pages_manage_engagement',
            'page_events',
        ],
        login_option: {
            return_scopes: true,
            auth_type: 'rerequest',
            enable_profile_selector: true
        }
    },
    platform: ['FB_MESS', 'WEBSITE'],
    img_host: 'https://chatbox-static-v3.botbanhang.vn/app/facebook/avatar'
}

export default ENV