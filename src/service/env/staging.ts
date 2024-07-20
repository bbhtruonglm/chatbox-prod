/**
 * .env.dev
 */

import type { Env } from '@/service/interface/env'

const ENV: Env = {
    local_storage: {
        prefix: 'chatbox_'
    },
    host: {
        n3_socket: 'wss://dev-api.botbanhang.vn/socket',
        n4_service_v2: 'https://dev-api.botbanhang.vn/v1/n4_service',
        n5_app_v2: 'https://dev-api.botbanhang.vn/v1/n5_app',
        n6_static: 'https://dev-api.botbanhang.vn/v1/n6_static',
        billing: 'https://dev-api.botbanhang.vn/v1/billing',
        ai: 'https://dev-api.botbanhang.vn/v1/ai',

        n4_service_v1: 'https://service.sellingpage.net',
        n5_app_v1: 'https://app.sellingpage.net',
        n8_merge: 'https://merge.sellingpage.net',
        widget: 'https://chatbox-widget.botbanhang.vn',
        
        page_setting_view: 'https://sellingpage.net/setting/#/page',
        analytic_view: 'https://sellingpage.net/analytic/#/',
        chatbot_view: 'https://chatbot.sellingpage.net/#/',
        download_client: 'https://sellingpage.net/download/'
    },
    facebook: {
        app_id: '1282108599314861',
        // app_id: '303503746720418',
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
        },
        v2: {
            app_id: '1282108599314861',
            instagram: {
                redirect_uri: 'https://chat.sellingpage.net/dashboard/select-platform?current_selected_tab=FB_INSTAGRAM',
                scoped: [
                    'public_profile',
                    'email',
                    'pages_manage_metadata',
                    'pages_read_engagement',
                    'pages_show_list',
                    'pages_read_user_content',
                    'pages_manage_posts',
                    'pages_manage_engagement',
                    'pages_messaging',
                    'ads_read',
                    'ads_management',
                    'page_events',
                    'instagram_basic',
                    'instagram_manage_messages',
                    'instagram_manage_comments',
                    'pages_manage_ads',
                    'catalog_management',
                    'leads_retrieval',
                    'business_management',
                    'read_page_mailboxes',
                ]
            }
        }
    },
    zalo_oa: {
        redirect_uri: 'https://localhost:8000/dashboard/select-page?connect_page=ZALO_OA',
    },
    platform: ['FB_MESS', 'WEBSITE', 'FB_WHATSAPP', 'FB_INSTAGRAM', 'ZALO_OA'],
    img_host: 'https://dev-api.botbanhang.vn/v1/n6_static/app/facebook/avatar'
}

export default ENV