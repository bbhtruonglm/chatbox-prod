<template>
  <div
    id="center-content"
    class="h-full w-full"
  >
    <div
      v-show="conversationStore.select_conversation?.fb_client_id"
      class="h-full flex flex-col overflow-hidden"
    >
      <MessageList />
      <InputChat @toggle_bottom_widget="toggleBottomWidget" />
    </div>
    <div
      v-if="!conversationStore.select_conversation?.fb_client_id"
      class="flex justify-center items-center flex-col h-full"
    >
      <img
        src="@/assets/icons/empty-page.svg"
        width="250"
        class="mx-auto mt-5"
      />
      <span class="text-slate-400">{{
        $t('v1.view.main.dashboard.chat.empty_select_conversation')
      }}</span>
    </div>
  </div>
  <template>
    <BottomWidgetModal ref="bottom_widget_modal_ref" />
    <AttachmentViewModal />
    <StaffReadModal />
  </template>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { useConversationStore } from '@/stores'

import MessageList from '@/views/ChatWarper/Chat/CenterContent/MessageList.vue'
import InputChat from '@/views/ChatWarper/Chat/CenterContent/InputChat.vue'
import ChangeStaff from '@/views/ChatWarper/Chat/CenterContent/ChangeStaff/ChangeStaff.vue'

import BottomWidgetModal from '@/views/ChatWarper/Chat/CenterContent/BottomWidgetModal.vue'
import AttachmentViewModal from '@/views/ChatWarper/Chat/CenterContent/AttachmentViewModal.vue'
import StaffReadModal from '@/views/ChatWarper/Chat/CenterContent/StaffReadModal.vue'

import type { ComponentRef } from '@/service/interface/vue'

const conversationStore = useConversationStore()

const change_staff_ref = ref<ComponentRef>()

/**ref của modal widget bottom */
const bottom_widget_modal_ref = ref<ComponentRef>()

/**ẩn hiện modal */
function toggleChangeAssignStaff($event: MouseEvent) {
  change_staff_ref.value?.toggle($event)
}
/**ẩn hiện modal */
function toggleBottomWidget($event: MouseEvent) {
  bottom_widget_modal_ref.value?.toggleModal($event)
}
</script>
