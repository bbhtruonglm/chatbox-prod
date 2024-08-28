<template>
  <Modal
    @open_modal="getClientChatbotInfo"
    @close_modal="onCloseModal"
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
import { computed, onMounted, ref, watch } from 'vue'
import {
  useConversationStore,
  useChatbotUserStore,
} from '@/stores'
import { update_info_conversation } from '@/service/api/chatbox/n4-service'
import { flow } from '@/service/helper/async'

import { dateFormat } from '@/service/helper/format'
import { getLabelInfo } from '@/service/function'

import Modal from '@/components/Modal.vue'
import ClientAvatar from '@/components/Avatar/ClientAvatar.vue'
import LeftBar from '@/views/ChatWarper/Chat/CenterContent/UserInfo/ClientInfo/LeftBar.vue'
import RightBar from '@/views/ChatWarper/Chat/CenterContent/UserInfo/ClientInfo/RightBar.vue'


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
import { toastError } from '@/service/helper/alert'
import { ChatbotAppClient } from '@/utils/api/Chatbot'

const conversationStore = useConversationStore()
const chatbotUserStore = useChatbotUserStore()



/**ref của modal */
const client_info_modal_ref = ref<InstanceType<typeof Modal>>()
/**div chứa sdt */
const client_phone_ref = ref<ComponentRef>()
/**div chứa email */
const client_email_ref = ref<ComponentRef>()
/**gắn cờ chỉnh sửa */
const is_edit = ref(false)

/**id của trang */
const page_id = computed(
  () => conversationStore.select_conversation?.fb_page_id
)
/**id của khách hàng */
const client_id = computed(
  () => conversationStore.select_conversation?.fb_client_id
)

/**lấy thông tin của khách hàng chatbot */
async function getClientChatbotInfo() {
  try {
    // nếu chưa có id của trang hoặc id của khách hàng thì không làm gì cả
    if (!page_id.value || !client_id.value) return

    // lấy thông tin khách hàng
    conversationStore.chatbot_client = await new ChatbotAppClient(
      page_id.value,
      client_id.value
    ).readClient()
  } catch (e) {
    // hiển thị lỗi
    toastError(e)
  }
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
  client_info_modal_ref.value?.toggleModal()
}
/**xử lý khi tắt modal */
function onCloseModal() {
  // reset lại cờ chỉnh sửa
  conversationStore.is_edit_info = false

  // reset toàn bộ các cờ chỉnh sửa
  conversationStore.is_edit_client = {
    contact_create: {},
    contact_remove: {},
    contact_update: {},
  }
}

defineExpose({ toggleModal })
</script>
