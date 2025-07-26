/**thiết lập của môi trường này */
const ENV: IEnv = {
  local_storage: {
    prefix: 'chatbox_',
  },
  session_storage: {
    prefix: 'chatbox_',
  },
  host: {
    n3_socket: 'wss://dev-api.botbanhang.vn/socket',
    n4_service_v2: 'https://dev-api.botbanhang.vn/v1/n4_service',
    n5_app_v2: 'https://dev-api.botbanhang.vn/v1/n5_app',
    n6_static: 'https://dev-api.botbanhang.vn/v1/n6_static',
    n9_analytic_v2: 'https://dev-api.botbanhang.vn/v1/n9_analytic_v2',
    billing: 'https://dev-api.botbanhang.vn/v1/billing',
    ai: 'https://dev-api.botbanhang.vn/v1/ai',
    chatbot: 'https://dev-api.botbanhang.vn/v1/chatbot/n3_service',
    n4_service_v1: 'https://dev-api.botbanhang.vn/service',
    n5_app_v1: 'http://rgwkwkosk008occgww84k044.34.143.225.69.sslip.io',
    n8_merge: 'https://merge.sellingpage.net',
    widget: 'https://chatbox-widget.botbanhang.vn',
    n8_merge_v2: 'https://dev-api.botbanhang.vn/v1/n8_merge',
    media_cdn: 'https://dev-api.botbanhang.vn/v1/n6_static/cdn',
    n13_zalo_personal: 'https://dev-api.botbanhang.vn/v1/n13_zalo_personal',
    n13_zalo_personal_socket: 'wss://dev-api.botbanhang.vn/zalo-personal-qr',
    agent_config: 'https://bbh-setting-dev.vercel.app/embed/virtual-assistant',
    merchant: {
      contact: 'https://api-contact.merchant.vn'
    }
  },
  external_link: {
    setting: 'https://bbh-setting-dev.vercel.app',
    analytic: 'https://bbh-chart-nu.vercel.app',
    chatbot: 'https://chatbot-dashboard-nine.vercel.app/#',
    chatbox: 'https://chat-dev.botbanhang.vn',
    download: 'https://sellingpage.net/download',
    merchant: 'https://merchant.vn',
    admin: 'https://dashboard-dev-ten.vercel.app',
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
      // 'instagram_basic',
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
      enable_profile_selector: true,
    },
  },
  zalo_oa: {
    portal: 'https://chatbox-service-v3.botbanhang.vn/public/callback',
  },
  instagram: {
    redirect_uri: 'https://localhost:8000/instagram-redirect-uri',
    app_id: '1112081206912962',
    scope: [
      'instagram_business_basic',
      'instagram_business_manage_messages',
      'instagram_business_manage_comments',
      'instagram_business_content_publish,instagram_business_manage_insights',
    ],
  },
  platform: [
    'FB_MESS',
    'WEBSITE',
    'FB_WHATSAPP',
    'FB_INSTAGRAM',
    'ZALO',
    // 'ZALO_OA',
    // 'ZALO_PERSONAL',
  ],
  img_host: 'https://dev-api.botbanhang.vn/v1/n6_static/app/facebook/avatar',
  is_show_payment: true
}

export default ENV
