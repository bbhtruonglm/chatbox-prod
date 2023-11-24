/**
 * .env.dev
 */

import type { Env } from '@/service/interface/env'

const ENV: Env = {
    local_storage: {
        prefix: 'chatbox_'
    },
    host: {
        n3_socket: 'wss://socket.sellingpage.net',
        n4_service: 'https://dev.sellingpage.net/v1/n4_service',
        n5_app: 'https://dev.sellingpage.net/v1/n5_app',
        n6_static: 'https://dev.sellingpage.net/v1/n6_static',
        n8_merge: 'https://merge.sellingpage.net',
        widget: 'https://chatbox-widget.botbanhang.vn',
        page_setting_view: 'https://sellingpage.net/setting/#/page',
        analytic_view: 'https://sellingpage.net/analytic/#/',
        download_client: 'https://sellingpage.net/download/'
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
    platform: ['FB_MESS', 'WEBSITE', 'FB_WHATSAPP'],
    img_host: 'https://dev.sellingpage.net/v1/n6_static/app/facebook/avatar'
}

export default ENV