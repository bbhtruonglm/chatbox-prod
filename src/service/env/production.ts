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
        n9_analytic_v2: 'https://chatbox-analytic-v2.botbanhang.vn',
        billing: 'https://chatbox-billing.botbanhang.vn',
        ai: 'https://chatbox-ai.botbanhang.vn',
        chatbot: 'https://chatbot-api.botbanhang.vn',
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
        },
        v2: {
            app_id: '1282108599314861',
            instagram: {
                redirect_uri: '',
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
        redirect_uri: 'https://chatv2.botbanhang.vn/dashboard/select-page?connect_page=ZALO_OA',
        // https://chat.botbanhang.vn/main/dashboard/select-platform?current_selected_tab=ZALO_OA
    },
    platform: ['FB_MESS', 'WEBSITE', 'ZALO_OA'],
    img_host: 'https://chatbox-static-v3.botbanhang.vn/app/facebook/avatar',
    ai: {
        widget: {
            place_order: '665e87f6ce7247b8ff8e9fd6',
            create_transaction: '665e87f6ce7247b8ff8e9fd6',
            schedule_appointment: '61630617b59a0601ba0a3862',
            // schedule_appointment: '665802268cc3519d90b389b7',
        }
    }
}

export default ENV