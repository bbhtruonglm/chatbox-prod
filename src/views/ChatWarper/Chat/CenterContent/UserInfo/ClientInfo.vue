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
      <div
        class="w-[263px] bg-white rounded-md flex flex-col p-2 gap-2 overflow-y-auto"
      >
        <div class="py-2 px-5">
          <ClientAvatar
            :conversation="conversationStore.select_conversation"
            class="rounded-lg w-52 h-52"
          />
        </div>
        <div class="flex flex-col gap-2">
          <div class="pl-5 flex items-center">
            <div class="w-5 flex-shrink-0">
              <GenderIcon class="h-3.5" />
            </div>
            <div class="text-sm font-medium">
              {{ $t('v1.view.main.dashboard.chat.client.unknown') }}
            </div>
          </div>
          <div class="pl-5 flex items-center">
            <div class="w-5 flex-shrink-0">
              <GlobalIcon class="h-3.5" />
            </div>
            <div class="text-sm font-medium">
              {{ $t('v1.common.vn') }}
            </div>
          </div>
          <div class="pl-5 flex items-center">
            <div class="w-5 flex-shrink-0">
              <LinkIcon class="h-3.5" />
            </div>
            <div class="text-sm font-medium">
              {{
                $t(
                  `v1.common.${conversationStore.select_conversation?.platform_type?.toLowerCase()}`
                )
              }}
            </div>
          </div>
          <div class="pl-5 flex items-center">
            <div class="w-5 flex-shrink-0">
              <DateWhiteIcon class="h-3.5" />
            </div>
            <div class="text-sm font-medium">
              {{ $t('v1.view.main.dashboard.chat.client.created_at') }}:
              {{
                dateFormat(
                  conversationStore.select_conversation?.createdAt,
                  'dd/MM/yyyy'
                )
              }}
            </div>
          </div>
          <div class="pl-5 flex items-center">
            <div class="w-5 flex-shrink-0">
              <ClockWhiteIcon class="h-3.5" />
            </div>
            <div class="text-sm font-medium">
              {{ $t('v1.view.main.dashboard.chat.client.updated_at') }}:
              {{
                dateFormat(
                  conversationStore.select_conversation?.createdAt,
                  'hh:mm - dd/MM/yyyy'
                )
              }}
            </div>
          </div>
          <div class="pl-5 flex items-center">
            <div class="w-5 flex-shrink-0">
              <UserSquareIcon class="h-3.5" />
            </div>
            <div class="text-sm font-medium">
              {{ conversationStore.select_conversation?.fb_client_id }}
              ({{ $t('v1.view.main.dashboard.chat.client.psid') }})
            </div>
          </div>
          <div class="pl-5 flex items-start">
            <div class="w-5 flex-shrink-0">
              <TagWhiteIcon class="h-3.5" />
            </div>
            <div class="flex gap-1 min-w-0 flex-wrap">
              <div
                v-for="label_id of conversationStore.select_conversation
                  ?.label_id"
                :style="{
                  background: getLabelInfo(
                    conversationStore.select_conversation?.fb_page_id,
                    label_id
                  )?.bg_color,
                }"
                class="text-xs px-1 text-white rounded"
              >
                {{
                  getLabelInfo(
                    conversationStore.select_conversation?.fb_page_id,
                    label_id
                  )?.title
                }}
              </div>
            </div>
          </div>
        </div>
        <button
          class="text-blue-700 bg-blue-100 rounded-md text-sm py-2 px-4 gap-2 flex items-center justify-center hover:brightness-90"
        >
          <PauseWhiteIcon class="w-4 h-4" />
          {{ $t('v1.view.main.dashboard.chat.client.stop_bot') }}
        </button>
      </div>
      <div
        class="flex-grow min-w-0 bg-white rounded-md flex flex-col p-2 gap-2 overflow-y-auto"
      >
        <div
          class="flex justify-between items-center border-b p-2 flex-shrink-0"
        >
          <div class="font-semibold">
            {{ conversationStore.select_conversation?.client_name }}
          </div>
          <button
            class="text-blue-700 bg-blue-100 rounded-md text-sm py-2 px-4 gap-2 flex items-center justify-center hover:brightness-90"
          >
            {{ $t('v1.view.main.dashboard.chat.client.edit') }}
          </button>
        </div>
        <div
          class="p-2 flex flex-col gap-2.5 flex-grow min-h-0 overflow-y-auto"
        >
          <div
            class="p-1 bg-gray-100 rounded-md w-fit flex items-center flex-shrink-0"
          >
            <button
              class="py-1 px-3 rounded text-sm font-medium shadow-sm bg-white w-fit hover:brightness-90"
            >
              {{ $t('v1.view.main.dashboard.chat.client.info') }}
            </button>
            <button
              class="py-1 px-3 rounded text-sm font-medium w-fit text-gray-500 hover:brightness-90"
            >
              {{ $t('v1.view.main.dashboard.chat.client.attribute') }}
            </button>
            <button
              class="py-1 px-3 rounded text-sm font-medium w-fit text-gray-500 hover:brightness-90"
            >
              {{ $t('v1.view.main.dashboard.chat.client.ai_detect') }}
            </button>
          </div>
          <div class="flex-grow min-h-0 overflow-y-auto flex flex-col gap-2.5">
            <div class="flex-grow min-h-0 overflow-y-auto flex flex-col gap-2.5">
              <div
                v-for="(value, key) of conversationStore.select_conversation
                  ?.client_bio?.fb_info"
                class="flex items-center text-sm"
              >
                <div class="w-28 font-semibold">
                  {{ key }}
                </div>
                <div>
                  {{ value }}
                </div>
              </div>
            </div>
            <div class="flex-shrink-0 flex items-center gap-2.5">
              <button
                class="flex items-center text-slate-700 bg-slate-100 rounded-md text-sm py-2 px-4 gap-2 justify-center w-fit hover:brightness-90"
              >
                <ReloadContentIcon class="text-slate-700 w-4 h-4" />
                {{ $t('v1.view.main.dashboard.chat.client.reload_info') }}
              </button>
              <InfoIcon
                v-tooltip="$t('v1.view.main.dashboard.chat.client.require_ext')"
                class="w-4 h-4 text-slate-500 cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>
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
