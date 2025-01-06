<template>
  <div
    v-if="conversationStore.select_conversation"
    id="chat__user-info"
    class="bg-white rounded-t-lg flex-shrink-0 py-2 px-3 flex justify-between gap-3"
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
            $clipboard.copy(
              conversationStore.select_conversation?.client_name || ''
            )
          "
          class="text-sm font-medium truncate cursor-copy"
        >
          {{ conversationStore.select_conversation?.client_name || 'No name' }}
        </div>
        <div
          v-if="
            conversationStore.select_conversation?.conversation_type === 'POST'
          "
          class="text-xs text-slate-500"
        >
          {{ $t('ID:') }}
          {{ conversationStore.select_conversation?.fb_client_id }}
        </div>
        <div
          v-else
          class="flex items-center gap-2"
        >
          <button
            v-tooltip.bottom="
              $t('v1.view.main.dashboard.chat.assign_staff.title')
            "
            :tooltip-disabled="!is_admin"
            @click="$main.openAssignStaff"
            :class="is_admin ? '' : 'cursor-not-allowed'"
            class="text-xs text-slate-500 flex items-center gap-1 min-w-0"
          >
            <div
              v-if="conversationStore.select_conversation?.fb_staff_id"
              class="truncate"
            >
              {{ conversationStore.getAssignStaff()?.name }}
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
    <div
      v-if="conversationStore.select_conversation?.conversation_type !== 'POST'"
      class="flex items-center flex-shrink-0 gap-3.5"
    >
      <button
        @click="$main.unreadConversation"
        v-tooltip.left="$t('v1.view.main.dashboard.chat.action.mark_unread')"
        class="text-slate-500 border border-slate-500 p-1.5 rounded-lg hover:bg-slate-100"
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
        class="text-slate-500 border border-slate-500 p-1.5 rounded-lg hover:bg-slate-100"
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
import { ref, computed } from 'vue'
import { container } from 'tsyringe'
import { Clipboard } from '@/utils/helper/Clipboard'
import { Toast } from '@/utils/helper/Alert/Toast'
import { N4SerivceAppOneConversation } from '@/utils/api/N4Service/Conversation'

import ClientAvatar from '@/components/Avatar/ClientAvatar.vue'
import Loading from '@/components/Loading.vue'
import Menu from '@/views/ChatWarper/Chat/CenterContent/UserInfo/Menu.vue'
import ChangeStaff from '@/views/ChatWarper/Chat/CenterContent/ChangeStaff/ChangeStaff.vue'
import IconInfo from '@/views/ChatWarper/Chat/CenterContent/UserInfo/IconInfo.vue'

import ArrowDownIcon from '@/components/Icons/ArrowDown.vue'
import DotIcon from '@/components/Icons/Dot.vue'
import MailOpenIcon from '@/components/Icons/MailOpen.vue'
import { loading } from '@/utils/decorator/Loading'
import { error } from '@/utils/decorator/Error'

const $emit = defineEmits(['toggle_change_assign_staff'])

const conversationStore = useConversationStore()
const $clipboard = container.resolve(Clipboard)
const $toast = container.resolve(Toast)

/**ref của dropdown menu của khách hàng */
const client_menu_ref = ref<InstanceType<typeof Menu>>()
/**modal assign nhân viên */
const change_staff_ref = ref<InstanceType<typeof ChangeStaff>>()
/**bật loading khi gọi api đánh dấu hội thoại chưa đọc */
const is_loading_unread_conversation = ref(false)
/** trạng thái của tài khoản hiện tại có phải là admin hay ko? */
const is_admin = computed(() => conversationStore.isCurrentStaffAdmin())

/**class chính */
class Main {
  /**mở modal thay đổi assign nhân viên */
  openAssignStaff($event: MouseEvent) {
    /** Nếu tài khoản hiện tại không phải admin thì ko cho assign nhân viên */
    if (!is_admin.value) return

    /** Mở modal */
    change_staff_ref.value?.toggle($event)
  }

  @loading(is_loading_unread_conversation)
  @error($toast)
  /**đánh dấu hội thoại này là chưa đọc */
  async unreadConversation() {
    // nếu không có hội thoại nào đang chọn thì thoát
    if (!conversationStore.select_conversation) return

    // * gắn cờ hội thoại chưa đọc, để không bị conflig vào code hiện thị
    conversationStore.select_conversation.is_force_unread = true

    // gọi api đánh dấu hội thoại chưa đọc
    await new N4SerivceAppOneConversation(
      conversationStore.select_conversation.fb_page_id,
      conversationStore.select_conversation.fb_client_id
    ).resetRead(1)
  }
}
const $main = new Main()
</script>
