<template>
  <div class="relative flex-shrink-0">
    <ClientAvatar
      :conversation="source"
      class="w-10 h-10"
    />
    <PageAvatar
      v-tooltip.bottom="getPageInfo(source?.fb_page_id)?.name"
      :page_info="getPageInfo(source?.fb_page_id)"
      :class="controlPageAvatarVisible()"
      class="w-5 h-5 absolute -bottom-1 -right-1"
    />
  </div>
</template>
<script setup lang="ts">
import { useChatbotUserStore } from '@/stores'
import { getPageInfo } from '@/service/function'

import ClientAvatar from '@/components/Avatar/ClientAvatar.vue'
import PageAvatar from '@/components/Avatar/PageAvatar.vue'

import type { ConversationInfo } from '@/service/interface/app/conversation'

const $props = withDefaults(
  defineProps<{
    source?: ConversationInfo
  }>(),
  {}
)

const chatbotUserStore = useChatbotUserStore()

/**kiểm soát việc page avatar được hiển thị như thế nào */
function controlPageAvatarVisible() {
  if (
    // nếu page đang thiết lập ẩn, thì luôn ẩn mà không cần quan tâm đến thiết lập của user
    getPageInfo($props.source?.fb_page_id)?.is_hide_page_avatar ||
    // nếu user đã thiết lập ẩn thì cũng ẩn luôn
    (
      // đang kích hoạt thiết lập cá nhân
      chatbotUserStore.is_enable_personal_setting &&
      // thiết lập cá nhân: thiết lập ẩn avatar page
      chatbotUserStore.personal_settings?.is_hide_page_avatar
    )
  )
    return 'hidden group-hover:block'

  // nếu không thì luôn hiện
}
</script>
