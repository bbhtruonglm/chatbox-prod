<template>
    <div id="center-content"
        class="md:translate-x-0 duration-200 pt-[58px] pb-[30px] md:pt-0 md:pb-0 top-0 absolute md:static md:w-[calc(100%_-_650px)] xl:w-[calc(100%_-_750px)] h-full w-full bg-white">
        <div v-show="conversationStore.select_conversation?.fb_client_id" class="h-full">
            <UserInfo @toggle_change_assign_staff="toggleChangeAssignStaff" />
            <MessageList />
            <InputChat @toggle_bottom_widget="toggleBottomWidget" />
        </div>
        <div v-if="!conversationStore.select_conversation?.fb_client_id"
            class="flex justify-center items-center flex-col h-full">
            <img src="@/assets/icons/empty-page.svg" width="250" class="mx-auto mt-5">
            <span class="text-slate-400">{{ $t('v1.view.main.dashboard.chat.empty_select_conversation') }}</span>
        </div>
    </div>
    <template>
        <ChangeStaff ref="change_staff_ref" />
        <BottomWidgetModal ref="bottom_widget_modal_ref" />
        <AttachmentViewModal />
        <StaffReadModal />
    </template>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { useConversationStore } from '@/stores'

import UserInfo from '@/views/Main/Dashboard/Chat/CenterContent/UserInfo.vue'
import MessageList from '@/views/Main/Dashboard/Chat/CenterContent/MessageList.vue'
import InputChat from '@/views/Main/Dashboard/Chat/CenterContent/InputChat.vue'
import ChangeStaff from '@/views/Main/Dashboard/Chat/CenterContent/ChangeStaff/ChangeStaff.vue'

import BottomWidgetModal from '@/views/Main/Dashboard/Chat/CenterContent/BottomWidgetModal.vue'
import AttachmentViewModal from '@/views/Main/Dashboard/Chat/CenterContent/AttachmentViewModal.vue'
import StaffReadModal from '@/views/Main/Dashboard/Chat/CenterContent/StaffReadModal.vue'

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