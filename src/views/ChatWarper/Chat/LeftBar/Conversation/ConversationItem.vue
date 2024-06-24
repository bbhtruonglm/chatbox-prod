<template>
  <button
    @click="clickConversation"
    :class="{
      'bg-slate-200': isSelectThisClient(),
    }"
    class="flex items-center hover:bg-slate-200 w-full group rounded-xl p-2 gap-3 mb-1"
  >
    <ClientAvatar :source="source" />
    <div class="flex flex-col gap-0.5 flex-grow min-w-0 relative">
      <ClientName :source="source" />
      <LastMessage :source="source" />
      <ClientSupport :source="source" />
      <hr
        v-if="!isSelectThisClient()"
        class="absolute w-full -bottom-3.5 group-hover:hidden"
      />
    </div>
  </button>
</template>
<script setup lang="ts">
import {
  usePageStore,
  useCommonStore,
  useConversationStore,
  useMessageStore,
  useExtensionStore,
} from '@/stores'
import { useRouter } from 'vue-router'
import { selectConversation, setParamChat } from '@/service/function'
import { getFbUserInfo } from '@/service/helper/ext'

import ClientAvatar from '@/views/ChatWarper/Chat/LeftBar/Conversation/ClientAvatar.vue'
import ClientName from '@/views/ChatWarper/Chat/LeftBar/Conversation/ClientName.vue'
import LastMessage from '@/views/ChatWarper/Chat/LeftBar/Conversation/LastMessage.vue'
import ClientSupport from '@/views/ChatWarper/Chat/LeftBar/Conversation/ClientSupport.vue'

import type { ConversationInfo } from '@/service/interface/app/conversation'

const $props = withDefaults(
  defineProps<{
    source?: ConversationInfo
  }>(),
  {}
)

const $router = useRouter()
const pageStore = usePageStore()
const commonStore = useCommonStore()
const conversationStore = useConversationStore()
const messageStore = useMessageStore()
const extensionStore = useExtensionStore()

/**click chuột vào 1 khách hàng */
function clickConversation() {
  // nếu không có key thì không cho click
  if (
    !$props.source?.fb_page_id ||
    !$props.source?.fb_client_id ||
    !$props.source?.data_key
  )
    return

  // ẩn mũi tên scroll bottom
  messageStore.is_show_to_bottom = false

  selectConversation($props.source)

  // đẩy id lên param
  setParamChat($router, $props.source?.fb_page_id, $props.source?.fb_client_id)

  // lấy uid và thông tin khách hàng
  triggerExtension()
}
/**gọi ext để lấy uid và thông tin khách hàng */
function triggerExtension() {
  // nếu không có key thì không cho click
  if (
    !$props.source?.fb_page_id ||
    !$props.source?.fb_client_id ||
    !$props.source?.data_key
  )
    return

  // tìm uid fb nếu chưa có và đang bật ext
  if (
    commonStore.extension_status === 'FOUND' &&
    (!$props.source?.client_bio?.fb_uid || !$props.source?.client_bio?.fb_info)
  ) {
    // nếu chưa có uid thì gắn cờ đang quét uid
    if (!$props.source?.client_bio?.fb_uid)
      extensionStore.is_find_uid[$props.source?.data_key] = true
    // nếu chưa có thông tin khách hàng thì gắn cờ đang quét thông tin khách hàng
    if (!$props.source?.client_bio?.fb_info)
      extensionStore.is_find_client_info[$props.source?.data_key] = true

    // quá 10s thì thôi không loading nữa
    setTimeout(() => {
      // tắt cờ đang quét uid
      extensionStore.is_find_uid[$props.source?.data_key!] = false
      // tắt cờ đang quét thông tin khách hàng
      extensionStore.is_find_client_info[$props.source?.data_key!] = false
    }, 10000)

    // gọi ext để lấy uid và thông tin khách hàng
    getFbUserInfo(
      $props.source?.platform_type,
      $props.source?.fb_page_id,
      $props.source?.fb_client_id,
      pageStore?.selected_page_list_info?.[$props.source?.fb_page_id]?.page
        ?.fb_page_token
    )
  }
}
/**kiểm tra xem có đang chọn khách này không */
function isSelectThisClient() {
  return (
    $props.source?.data_key === conversationStore.select_conversation?.data_key
  )
}
</script>
