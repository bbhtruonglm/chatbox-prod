<template>
  <ZaloPeronalCore :message />
</template>

<script setup lang="ts">
import type { MessageInfo } from '@/service/interface/app/message'
import ZaloPeronalCore from '@/views/ChatWarper/Chat/CenterContent/MessageList/MessageItem/PhoneAction/ZaloPeronalCore.vue'

const message: MessageInfo = {
  _id: '6847bc5acb593b5459124523',
  fb_page_id: '414786618395170',
  fb_client_id: '9459754374055328',
  platform_type: 'FB_MESS',
  message_type: 'client',
  time: '2025-06-10T05:02:18.302Z',
  reply_comments: [],
  message_mid:
    'm_nk2R93Xi9i0pwn9YLJf260fnkKji4xjABl3yiOTM_CZ9t8U3GO0tGWy2Jwod7KJnrlneuX-AmsN4dSUUD7ZgjA',
  message_attachments: [
    {
      payload: {
        elements: [
          {
            buttons: [
              {
                type: 'bbh_phone',
              },
              {
                type: 'bbh_place_order',
              },
            ],
          },
        ],
      },
    },
  ],
  message_text: '***6915',
  attachment_size: [],
  createdAt: '2025-06-10T05:02:18.888Z',
  client_phone: '***6915',
  is_ai_slow_reply: true,
  is_system_slow_reply: true,
}
</script>
