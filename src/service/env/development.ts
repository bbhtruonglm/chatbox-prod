/**
 * .env.dev
 */

import type { Env } from '@/service/interface/env'

const ENV: Env = {
    local_storage: {
        prefix: 'chatbox_'
    },
    host: {
        n4_service: 'https://dev.sellingpage.net/v1/n4_service'
    },
    facebook: {
        app_id: '303503746720418',
        login_option: {
            scope: [
                'public_profile',
                'pages_show_list',
                'pages_read_engagement',
                'pages_messaging',
                'email',
                'pages_read_user_content',
                'pages_messaging_subscriptions',
                'instagram_basic',
                'instagram_manage_comments',
                'instagram_manage_insights',
                'business_management',
                'ads_management',
                'read_page_mailboxes',
                'read_insights',
                'manage_pages',
                'publish_pages',
                'pages_manage_metadata',
                'pages_manage_ads',
                'pages_manage_posts',
                'pages_manage_engagement',
                'page_events',
            ].join(),
            return_scopes: true,
            auth_type: 'rerequest',
            enable_profile_selector: true
        }
    },
    platform: ['facebook', 'web', 'whatsapp']
}

export default ENV