<template>
    <div id="center-content" :class="{
        'translate-x-[100vw]': !commonStore.is_show_message_mobile
    }"
        class="md:translate-x-0 duration-200 pt-[58px] pb-[30px] md:pt-0 md:pb-0 top-0 absolute md:static md:w-[calc(100%_-_710px)] xl:w-[calc(100%_-_810px)] h-full w-full bg-white">
        <div v-show="conversationStore.select_conversation?.fb_client_id" class="h-full">
            <UserInfo @toggle_change_assign_staff="toggleChangeAssignStaff" />
            <MessageList />
            <InputChat @toggle_quick_answer="toggleQuickAnswer" @toggle_bottom_widget="toggleBottomWidget" />
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
        <QuickAnswerModal ref="quick_anser_modal_ref" />
        <AttachmentViewModal />
        <StaffReadModal />
    </template>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useCommonStore, useConversationStore } from '@/stores'
import { teleportCenterModelOnPcScreen } from '@/service/function'
import { swipe_left } from '@/service/helper/touchGesture'

import UserInfo from '@/views/Main/Dashboard/Chat/CenterContent/UserInfo.vue'
import MessageList from '@/views/Main/Dashboard/Chat/CenterContent/MessageList.vue'
import InputChat from '@/views/Main/Dashboard/Chat/CenterContent/InputChat.vue'
import ChangeStaff from '@/views/Main/Dashboard/Chat/CenterContent/ChangeStaff/ChangeStaff.vue'

import BottomWidgetModal from '@/views/Main/Dashboard/Chat/CenterContent/BottomWidgetModal.vue'
import QuickAnswerModal from '@/views/Main/Dashboard/Chat/CenterContent/QuickAnswerModal.vue'
import AttachmentViewModal from '@/views/Main/Dashboard/Chat/CenterContent/AttachmentViewModal.vue'
import StaffReadModal from '@/views/Main/Dashboard/Chat/CenterContent/StaffReadModal.vue'

import type { ComponentRef } from '@/service/interface/vue'

const commonStore = useCommonStore()
const conversationStore = useConversationStore()

const change_staff_ref = ref<ComponentRef>()

/**ref của modal widget bottom */
const bottom_widget_modal_ref = ref<ComponentRef>()
/**ref của câu trả lời nhanh */
const quick_anser_modal_ref = ref<ComponentRef>()

onMounted(() => allowMobileSwipeClose())

/**cho phép mobile dùng hành động vuốt để đóng message */
function allowMobileSwipeClose() {
    swipe_left(
        'center-content',
        (e, r) => commonStore.is_show_message_mobile = false
    )
}
/**ẩn hiện modal */
function toggleChangeAssignStaff($event: MouseEvent) {
    teleportCenterModelOnPcScreen()

    change_staff_ref.value?.toggle($event)
}
/**ẩn hiện modal */
function toggleBottomWidget() {
    teleportCenterModelOnPcScreen()

    bottom_widget_modal_ref.value?.toggleModal()
}
/**ẩn hiện modal */
function toggleQuickAnswer() {
    teleportCenterModelOnPcScreen()

    quick_anser_modal_ref.value?.toggleModal()
}
</script>