<template>
    <div id="center-content" :class="{
        'translate-x-[100vw]': !commonStore.is_show_message_mobile
    }"  class="md:translate-x-0 duration-200 pt-[58px] pb-[30px] md:pt-0 md:pb-0 top-0 absolute md:static md:w-[calc(100%_-_650px)] xl:w-[calc(100%_-_750px)] h-full w-full bg-white">
    <template v-if="conversationStore.select_conversation">
        <UserInfo @toggle_change_assign_staff="toggleChangeAssignStaff"  />
        <MessageList />
        <InputChat />
    </template>
    <div v-else class="flex justify-center items-center flex-col h-full">
        <img src="@/assets/icons/empty-page.svg" width="250" class="mx-auto mt-5">
        <span class="text-slate-400">{{ $t('v1.view.main.dashboard.chat.empty_select_conversation')  }}</span>
    </div>
    </div>
    <template>
        <ChangeStaffModal ref="change_staff_modal_ref" />
    </template>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { useCommonStore, useConversationStore } from '@/stores'
import { teleportModelAssignStaffOnPcScreen } from '@/service/function'

import UserInfo from '@/views/Main/Dashboard/Chat/CenterContent/UserInfo.vue'
import MessageList from '@/views/Main/Dashboard/Chat/CenterContent/MessageList.vue'
import InputChat from '@/views/Main/Dashboard/Chat/CenterContent/InputChat.vue'
import ChangeStaffModal from '@/views/Main/Dashboard/Chat/CenterContent/ChangeStaffModal.vue'

import type { ComponentRef } from '@/service/interface/vue'

const commonStore = useCommonStore()
const conversationStore = useConversationStore()

/**ref của modal thay đổi assign của nhân viên */
const change_staff_modal_ref = ref<ComponentRef>()

/**ẩn hiện modal */
function toggleChangeAssignStaff() {
    teleportModelAssignStaffOnPcScreen()
    
    change_staff_modal_ref.value?.toggleModal()
}
</script>