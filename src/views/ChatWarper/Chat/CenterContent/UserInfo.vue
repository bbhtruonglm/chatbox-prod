<template>
  <div
    v-if="conversationStore.select_conversation"
    class="bg-white rounded-lg flex-shrink-0 py-2 px-3 flex justify-between gap-3"
  >
    <div class="flex items-center gap-2.5 flex-grow min-w-0">
      <ClientAvatar
        @click="client_menu_ref?.openClientInfo()"
        :conversation="conversationStore.select_conversation"
        class="w-10 h-10 flex-shrink-0 cursor-pointer"
      />
      <div class="min-w-0">
        <div
          @click="
            copyToClipboard(
              conversationStore.select_conversation?.client_name || ''
            )
          "
          class="text-sm font-medium truncate cursor-copy"
        >
          {{ conversationStore.select_conversation?.client_name }}
        </div>
        <div class="flex items-center gap-2">
          <button
            v-tooltip.bottom="
              $t('v1.view.main.dashboard.chat.assign_staff.title')
            "
            :tooltip-disabled="!is_admin"
            @click="openAssignStaff"
            :class="is_admin ? '' : 'cursor-not-allowed'"
            class="text-xs text-slate-500 flex items-center gap-1 min-w-0"
          >
            <div
              v-if="conversationStore.select_conversation?.fb_staff_id"
              class="truncate"
            >
              {{
                getStaffInfo(
                  conversationStore.select_conversation?.fb_page_id,
                  conversationStore.select_conversation?.fb_staff_id
                )?.name
              }}
            </div>
            <div v-else>
              {{ $t('v1.view.main.dashboard.chat.assign_staff.title') }}
            </div>
            <ArrowDownIcon
              v-if="is_admin"
              class="w-2.5 h-2.5 flex-shrink-0"
            />
          </button>
          <IconInfo />
        </div>
      </div>
    </div>
    <div class="flex items-center flex-shrink-0 gap-3.5">
      <button
        @click="unreadConversation"
        v-tooltip.left="$t('v1.view.main.dashboard.chat.action.mark_unread')"
        class="text-slate-500 border border-slate-500 p-1.5 rounded hover:bg-slate-100"
      >
        <Loading
          v-if="is_loading_unread_conversation"
          :size="14"
        />
        <MailOpenIcon
          v-else
          class="w-3.5 h-3.5"
        />
      </button>
      <button
        v-tooltip.bottom="$t('v1.common.more')"
        @click="client_menu_ref?.toggle"
        class="text-slate-500 border border-slate-500 p-1.5 rounded hover:bg-slate-100"
      >
        <DotIcon class="w-3.5 h-3.5" />
      </button>
    </div>
  </div>
  <Menu ref="client_menu_ref" />
  <ChangeStaff ref="change_staff_ref" />
</template>
<script setup lang="ts">
import { useConversationStore } from '@/stores'
import { reset_read_conversation } from '@/service/api/chatbox/n4-service'
import { ref, computed } from 'vue'
import { flow } from '@/service/helper/async'
import { getStaffInfo, isCurrentStaffIsPageAdmin } from '@/service/function'
import { copyToClipboard } from '@/service/helper/copyWithAlert'

import ClientAvatar from '@/components/Avatar/ClientAvatar.vue'
import Loading from '@/components/Loading.vue'
import Menu from '@/views/ChatWarper/Chat/CenterContent/UserInfo/Menu.vue'
import ChangeStaff from '@/views/ChatWarper/Chat/CenterContent/ChangeStaff/ChangeStaff.vue'
import IconInfo from '@/views/ChatWarper/Chat/CenterContent/UserInfo/IconInfo.vue'

import ArrowDownIcon from '@/components/Icons/ArrowDown.vue'
import DotIcon from '@/components/Icons/Dot.vue'
import MailOpenIcon from '@/components/Icons/MailOpen.vue'

import type { CbError } from '@/service/interface/function'

const $emit = defineEmits(['toggle_change_assign_staff'])

const conversationStore = useConversationStore()

/**ref của dropdown menu của khách hàng */
const client_menu_ref = ref<InstanceType<typeof Menu>>()
/**modal assign nhân viên */
const change_staff_ref = ref<InstanceType<typeof ChangeStaff>>()
/**bật loading khi gọi api đánh dấu hội thoại chưa đọc */
const is_loading_unread_conversation = ref(false)

/** trạng thái của tài khoản hiện tại có phải là admin hay ko? */
const is_admin = computed(() =>
  isCurrentStaffIsPageAdmin(
    conversationStore.select_conversation?.fb_page_id as string
  )
)

/**mở modal thay đổi assign nhân viên */
function openAssignStaff($event: MouseEvent) {
  /** Nếu tài khoản hiện tại không phải admin thì ko cho assign nhân viên */
  if (!is_admin.value) return

  /** Mở modal */
  change_staff_ref.value?.toggle($event)
}
/**đánh dấu hội thoại này là chưa đọc */
function unreadConversation() {
  // api đang chạy thì không cho gọi nữa
  if (is_loading_unread_conversation.value) return

  flow(
    [
      // * bật loading
      (cb: CbError) => {
        is_loading_unread_conversation.value = true

        cb()
      },
      // * gắn cờ hội thoại chưa đọc, để không bị conflig vào code hiện thị
      (cb: CbError) => {
        // nếu không có hội thoại nào đang chọn thì thoát
        if (!conversationStore.select_conversation) return cb()

        // gắn cờ hội thoại chưa đọc
        conversationStore.select_conversation.is_force_unread = true

        cb()
      },
      // * gọi api
      (cb: CbError) =>
        reset_read_conversation(
          {
            page_id: conversationStore.select_conversation
              ?.fb_page_id as string,
            client_id: conversationStore.select_conversation
              ?.fb_client_id as string,
            unread_message_amount: 1,
          },
          (e, r) => {
            if (e) return cb(e)

            cb()
          }
        ),
    ],
    e => {
      // tắt loading
      is_loading_unread_conversation.value = false
    }
  )
}
</script>
