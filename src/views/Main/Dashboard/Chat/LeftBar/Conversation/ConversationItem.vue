<template>
    <div @click="clickConversation" class="h-[84px] pb-[3px]">
        <div :class="{
        'bg-amber-50 !border-l-orange-500': source?.data_key === conversationStore.select_conversation?.data_key,
        'bg-slate-300 !border-l-slate-300': source?.unread_message_amount
    }" class="border-l-4 border-l-white border-b py-3 px-2 flex cursor-pointer hover:bg-slate-100 hover:border-l-slate-100 h-full w-full group">

            <div class="flex items-center">
                <div class="w-fit h-fit relative">
                    <ClientAvatar :client_name="source?.client_name" :client_id="source?.fb_client_id"
                        :page_id="source?.fb_page_id" :staff_id="chatbotUserStore.chatbot_user?.fb_staff_id"
                        :platform_type="source?.platform_type" :client_avatar="source?.client_avatar" size="37"
                        class="rounded-full" />
                    <div :class="{
        'hidden group-hover:block': chatbotUserStore.enable_personal_setting ? {
            ...getPageInfo(source?.fb_page_id), ...chatbotUserStore.personal_settings
        }['is_hide_page_avatar'] : getPageInfo(source?.fb_page_id)?.is_hide_page_avatar
    }" class="w-fit h-fit absolute bottom-[-4px] right-[-4px] ">
                        <PageAvatar v-tooltip.bottom="getPageInfo(source?.fb_page_id)?.name"
                            :page_id="source?.fb_page_id"
                            :page_info="pageStore.selected_page_list_info?.[source?.fb_page_id as string]?.page"
                            :page_type="pageStore.selected_page_list_info?.[source?.fb_page_id as string]?.page?.type"
                            :page_avatar="pageStore.selected_page_list_info?.[source?.fb_page_id as string]?.page?.avatar"
                            size="20" class="rounded-full border-2 border-white" />
                    </div>
                </div>
            </div>
            <div class="w-[calc(100%_-_86px)] pl-2 flex flex-col justify-between">
                <div class="flex items-center h-[16px]">
                    <div v-if="source?.fb_staff_id" class="flex items-center">
                        <StaffAvatar
                            v-tooltip="pageStore.selected_page_list_info?.[source?.fb_page_id]?.staff_list?.[source?.fb_staff_id]?.name"
                            :id="source?.fb_staff_id" size="16" class="rounded-full" />
                        <div class="mx-1">
                            <img src="@/assets/icons/arrow-right.svg" width="4" height="4">
                        </div>
                    </div>
                    <div class="w-[calc(100%_-_33px)] truncate text-sm font-medium">
                        {{ source?.client_name }}
                    </div>
                </div>
                <div class="text-xs truncate h-[16px]">
                    <span v-if="source?.last_message_type === 'page'">
                        {{ $t('v1.view.main.dashboard.chat.you') }}
                    </span>
                    {{ source?.last_message }}
                </div>
                <div class="flex items-center h-[16px]">
                    <div v-tooltip="$t('v1.view.main.dashboard.chat.action.has_reply')"
                        v-if="source?.last_message_type === 'page'" class="w-[16px] h-[16px] mr-1">
                        <img src="@/assets/icons/reply.svg" class="w-full h-full">
                    </div>
                    <div class="label-list w-[calc(100%_-_16px)] overflow-hidden scrollbar-horizontal overflow-x-auto">
                        <template v-for="label_id of getLabelValid(source?.fb_page_id, source?.label_id)?.slice(0, 3)">
                            <Label :page_id="source?.fb_page_id" :label_id="label_id" />
                        </template>
                        <div @mouseover="label_popover_ref?.mouseover" @mouseleave="label_popover_ref?.mouseleave"
                            v-if="Number(getLabelValid(source?.fb_page_id, source?.label_id)?.length) > 3"
                            class="text-slate-500 rounded-full text-[10px] px-1 truncate border h-[15px]">
                            +
                            {{ Number(getLabelValid(source?.fb_page_id, source?.label_id)?.length) - 3 }}
                        </div>
                    </div>
                </div>
            </div>
            <div class="w-[49px] flex flex-col items-end justify-between">
                <div class="h-[16px]">
                    <span v-if="source?.unread_message_amount" class="text-xs text-white bg-red-500 px-1 rounded-full">
                        {{ source?.unread_message_amount }}
                    </span>
                </div>
                <div class="text-slate-500 text-xs h-[16px]">
                    {{ formatLastMessageTime(source?.last_message_time) }}
                </div>
                <div class="flex items-center h-[16px]">
                    <div v-tooltip.bottom="source?.client_phone" v-if="source?.client_phone">
                        <img src="@/assets/icons/phone.svg" width="13" height="13">
                    </div>
                    <div v-tooltip.bottom="`Uid: ${source?.client_bio?.fb_uid}`" v-if="source?.client_bio?.fb_uid"
                        class="ml-1">
                        <img src="@/assets/icons/id.svg" width="13" height="13">
                    </div>
                    <div v-tooltip.bottom="$t('v1.common.' + getPageInfo(source?.fb_page_id)?.type?.toLowerCase() as string)"
                        class="ml-1">
                        <img v-if="source?.platform_type === 'FB_MESS'" src="@/assets/icons/facebook.svg" width="13"
                            height="13">
                        <img v-if="source?.platform_type === 'WEBSITE'" src="@/assets/icons/website-2.svg" width="13"
                            height="13">
                        <img v-if="source?.platform_type === 'ZALO_OA'" src="@/assets/icons/zalo.svg" width="13"
                            height="13">
                    </div>
                </div>
            </div>
        </div>
    </div>
    <template>
        <Popover ref="label_popover_ref" position="RIGHT" :is_fit="false" width="auto" height="auto">
            <div class="max-w-[300px] max-h-[200px] flex flex-wrap justify-center">
                <template v-for="label_id of getLabelValid(source?.fb_page_id, source?.label_id)?.slice(3)">
                    <Label :page_id="source?.fb_page_id" :label_id="label_id" />
                </template>
            </div>
        </Popover>
    </template>
</template>
<script setup lang="ts">
import {
    useChatbotUserStore, usePageStore, useCommonStore, useConversationStore,
    useMessageStore,
} from '@/stores'
import { format as format_date, isToday, isThisWeek, isThisYear } from 'date-fns'
import viLocale from 'date-fns/locale/vi'
import { useRouter } from 'vue-router'
import {
    isMobile, selectConversation, getLabelInfo, getLabelValid, getPageInfo, setParamChat
} from '@/service/function'
import { getFbUserInfo } from '@/service/helper/ext'
import { ref } from 'vue'

import ClientAvatar from '@/components/Avatar/ClientAvatar.vue'
import StaffAvatar from '@/components/Avatar/StaffAvatar.vue'
import PageAvatar from '@/components/Avatar/PageAvatar.vue'
import Popover from '@/components/Popover.vue'
import Label from '@/views/Main/Dashboard/Chat/LeftBar/Conversation/Label.vue'

import type { ConversationInfo } from '@/service/interface/app/conversation'
import type { ComponentRef } from '@/service/interface/vue'

const $props = withDefaults(defineProps<{
    source?: ConversationInfo
}>(), {})

const $router = useRouter()
const chatbotUserStore = useChatbotUserStore()
const pageStore = usePageStore()
const commonStore = useCommonStore()
const conversationStore = useConversationStore()
const messageStore = useMessageStore()

/**ref của popover */
const label_popover_ref = ref<ComponentRef>()

/**click chuột vào 1 khách hàng */
function clickConversation() {
    // nếu mess đang được show thì không cho click nữa
    if (isMobile() && commonStore.is_show_message_mobile) return

    if (!$props.source?.fb_page_id || !$props.source?.fb_client_id) return

    // hiện tin nhắn ở giao diện mobile
    commonStore.is_show_message_mobile = true

    // ẩn mũi tên scroll bottom
    messageStore.is_show_to_bottom = false

    selectConversation($props.source)

    // đẩy id lên param
    setParamChat($router, $props.source?.fb_page_id, $props.source?.fb_client_id)

    // tìm uid fb nếu chưa có và đang bật ext
    if (
        commonStore.is_active_extension &&
        (
            !$props.source?.client_bio?.fb_uid ||
            !$props.source?.client_bio?.fb_info
        )
    ) getFbUserInfo(
        $props.source?.platform_type,
        $props.source?.fb_page_id,
        $props.source?.fb_client_id,
        pageStore?.selected_page_list_info?.[$props.source?.fb_page_id]?.page?.fb_page_token
    )
}
/**format lại thời gian trước khi hiển thị */
function formatLastMessageTime(timestamp?: number) {
    if (!timestamp) return ''

    // nếu thời gian trong ngày thì chỉ hiện giờ
    if (isToday(timestamp)) return format_date(timestamp, 'HH:mm')

    // nếu trong tuần thì hiện thứ
    if (isThisWeek(timestamp)) return format_date(timestamp, 'EEEEEE', { locale: viLocale })

    // nếu trong năm thì hiện ngày tháng
    if (isThisYear(timestamp)) return format_date(timestamp, 'dd/MM')

    // hiện full
    return format_date(timestamp, 'dd/MM/yy')
}
</script>
<style scoped lang="scss">
.label-list {
    display: -webkit-box;
}
</style>