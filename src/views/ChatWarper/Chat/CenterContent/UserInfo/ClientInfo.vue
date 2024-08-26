<template>
  <Modal
    ref="client_info_modal_ref"
    class_modal="w-[1100px] h-[710px]"
    class_body="py-2 flex gap-2"
  >
    <template v-slot:header>
      {{ $t('v1.view.main.dashboard.chat.client.title') }}
    </template>
    <template v-slot:body>
      <LeftBar />
      <RightBar />
    </template>
  </Modal>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import {
  useConversationStore,
  useChatbotUserStore,
  useExtensionStore,
  usePageStore,
} from '@/stores'
import { update_info_conversation } from '@/service/api/chatbox/n4-service'
import { flow } from '@/service/helper/async'
import { getFbUserInfo } from '@/service/helper/ext'
import { dateFormat } from '@/service/helper/format'
import { getLabelInfo } from '@/service/function'

import Modal from '@/components/Modal.vue'
import ClientAvatar from '@/components/Avatar/ClientAvatar.vue'
import LeftBar from '@/views/ChatWarper/Chat/CenterContent/UserInfo/ClientInfo/LeftBar.vue'
import RightBar from '@/views/ChatWarper/Chat/CenterContent/UserInfo/ClientInfo/RightBar.vue'
import Loading from '@/components/Loading.vue'

import GenderIcon from '@/components/Icons/Gender.vue'
import GlobalIcon from '@/components/Icons/Global.vue'
import LinkIcon from '@/components/Icons/Link.vue'
import DateWhiteIcon from '@/components/Icons/DateWhite.vue'
import ClockWhiteIcon from '@/components/Icons/ClockWhite.vue'
import UserSquareIcon from '@/components/Icons/UserSquare.vue'
import TagWhiteIcon from '@/components/Icons/TagWhite.vue'
import PauseWhiteIcon from '@/components/Icons/PauseWhite.vue'
import InfoIcon from '@/components/Icons/Info.vue'
import ReloadContentIcon from '@/components/Icons/ReloadContent.vue'

import type { ComponentRef } from '@/service/interface/vue'
import type { CbError } from '@/service/interface/function'

const conversationStore = useConversationStore()
const chatbotUserStore = useChatbotUserStore()
const extensionStore = useExtensionStore()
const pageStore = usePageStore()

/**ref của modal */
const client_info_modal_ref = ref<ComponentRef>()
/**div chứa sdt */
const client_phone_ref = ref<ComponentRef>()
/**div chứa email */
const client_email_ref = ref<ComponentRef>()
/**gắn cờ chỉnh sửa */
const is_edit = ref(false)

/**kiểm tra xem có đang tìm kiếm thông tin khách hàng hay không */
function isFindClientInfo() {
  // nếu chưa chọn cuộc trò chuyện nào thì không hiển thị
  if (!conversationStore.select_conversation?.data_key) return false

  // trả về trạng thái có đang tìm kiếm thông tin khách hàng hay không
  return extensionStore.is_find_client_info?.[
    conversationStore.select_conversation?.data_key
  ]
}
/**làm mới thông tin khách hàng */
function reloadClientInfo() {
  // nếu thiếu key thì không làm gì cả
  if (
    !conversationStore.select_conversation?.fb_page_id ||
    !conversationStore.select_conversation?.data_key
  )
    return

  // gắn cờ đang tìm kiếm thông tin khách hàng
  extensionStore.is_find_client_info[
    conversationStore.select_conversation?.data_key
  ] = true

  // quá 10s thì thôi không loading nữa
  setTimeout(() => {
    // tắt cờ đang quét thông tin khách hàng
    extensionStore.is_find_client_info[
      conversationStore.select_conversation?.data_key!
    ] = false
  }, 10000)

  // gọi ext để lấy uid và thông tin khách hàng
  getFbUserInfo(
    conversationStore.select_conversation?.platform_type,
    conversationStore.select_conversation?.fb_page_id,
    conversationStore.select_conversation?.fb_client_id,
    pageStore?.selected_page_list_info?.[
      conversationStore.select_conversation?.fb_page_id
    ]?.page?.fb_page_token
  )
}
/**huỷ thay đổi */
function cancelEdit() {
  // reset dữ liệu về như cũ
  client_phone_ref.value.innerText =
    conversationStore.select_conversation?.client_phone || ''
  client_email_ref.value.innerText =
    conversationStore.select_conversation?.client_email || ''

  is_edit.value = false
}
/**cập nhật thông tin của khách hàng */
function updateClientInfo() {
  const client_phone = client_phone_ref.value?.innerText?.trim()
  const client_email = client_email_ref.value?.innerText?.trim()

  if (!client_phone && !client_email) return

  flow(
    [
      (cb: CbError) =>
        update_info_conversation(
          {
            page_id: conversationStore.select_conversation
              ?.fb_page_id as string,
            client_id: conversationStore.select_conversation
              ?.fb_client_id as string,
            client_phone,
            client_email,
          },
          (e, r) => {
            if (e) return cb(e)

            is_edit.value = false

            // sửa lại giá trị của khách hàng đang được chọn
            if (conversationStore.select_conversation) {
              conversationStore.select_conversation.client_phone = client_phone
              conversationStore.select_conversation.client_email = client_email
            }

            // sửa lại giá trị trong danh sách khách hàng
            if (conversationStore.select_conversation?.data_key) {
              conversationStore.conversation_list[
                conversationStore.select_conversation?.data_key
              ].client_phone = client_phone
              conversationStore.conversation_list[
                conversationStore.select_conversation?.data_key
              ].client_email = client_email
            }

            cb()
          }
        ),
    ],
    undefined,
    true
  )
}
/**toggle modal */
function toggleModal() {
  client_info_modal_ref.value.toggleModal()
}

defineExpose({ toggleModal })
</script>
