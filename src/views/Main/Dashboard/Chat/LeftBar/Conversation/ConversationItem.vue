<template>
    <div @click="clickConversation" :class="{
        'bg-amber-50 !border-l-orange-500': source?.data_key === conversationStore.select_conversation?.data_key,
        'bg-slate-300': source?.unread_message_amount
    }" class="border-l-4 border-l-white border-b py-3 px-2 flex cursor-pointer hover:bg-slate-100 h-[84px] group">
        <div class="flex items-center">
            <div class="w-fit h-fit relative">
                <ClientAvatar :client_name="source?.client_name" :client_id="source?.fb_client_id"
                    :page_id="source?.fb_page_id" :staff_id="chatbotUserStore.chatbot_user?.fb_staff_id"
                    :platform_type="source?.platform_type" size="37" class="rounded-full" />
                <div class="w-fit h-fit absolute bottom-[-4px] right-[-4px] hidden group-hover:block">
                    <PageAvatar v-tooltip="pageStore.selected_page_list_info?.[source?.fb_page_id as string]?.page?.name"
                        :page_id="source?.fb_page_id"
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
                        <div v-tooltip.bottom="getLabelInfo(source?.fb_page_id, label_id)?.title"
                            v-if="getLabelInfo(source?.fb_page_id, label_id)"
                            :style="{ background: getLabelInfo(source?.fb_page_id, label_id)?.bg_color }"
                            class="text-white rounded-full text-[10px] px-1 mr-[2px] max-w-[58px] truncate">
                            {{ getLabelInfo(source?.fb_page_id, label_id)?.title }}
                        </div>
                    </template>
                    <div @mouseover="label_popover_ref?.mouseover" @mouseleave="label_popover_ref?.mouseleave"
                        v-if="Number(getLabelValid(source?.fb_page_id, source?.label_id)?.length) > 3"
                        class="text-slate-500 rounded-full text-[10px] px-1 truncate border">
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
                <div v-tooltip.bottom="source?.client_bio?.fb_uid" v-if="source?.client_bio?.fb_uid" class="ml-1">
                    <img src="@/assets/icons/facebook.svg" width="13" height="13">
                </div>
            </div>
        </div>
    </div>
    <template>
        <Popover ref="label_popover_ref" position="RIGHT" :is_fit="false" width="auto" height="auto">
            <div class="max-w-[300px] max-h-[200px] flex flex-wrap justify-center">
                <template v-for="label_id of getLabelValid(source?.fb_page_id, source?.label_id)?.slice(3)">
                    <div v-tooltip.bottom="getLabelInfo(source?.fb_page_id, label_id)?.title"
                        v-if="getLabelInfo(source?.fb_page_id, label_id)"
                        :style="{ background: getLabelInfo(source?.fb_page_id, label_id)?.bg_color }"
                        class="text-white rounded-full text-[10px] px-1 mr-[2px] mb-[2px] max-w-[58px] truncate cursor-pointer">
                        {{ getLabelInfo(source?.fb_page_id, label_id)?.title }}
                    </div>
                </template>
            </div>
        </Popover>
    </template>
</template>
<script setup lang="ts">
import {
    useChatbotUserStore, usePageStore, useCommonStore, useConversationStore
} from '@/stores'
import { format as format_date, isToday, isThisWeek, isThisYear } from 'date-fns'
import viLocale from 'date-fns/locale/vi'
import { useRouter } from 'vue-router'
import {
    isMobile, selectConversation, getLabelInfo, getLabelValid
} from '@/service/function'
import { getFbUserInfo } from '@/service/helper/ext'
import { ref } from 'vue'

import ClientAvatar from '@/components/Avatar/ClientAvatar.vue'
import StaffAvatar from '@/components/Avatar/StaffAvatar.vue'
import PageAvatar from '@/components/Avatar/PageAvatar.vue'
import Popover from '@/components/Popover.vue'

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

/**ref của popover */
const label_popover_ref = ref<ComponentRef>()

/**click chuột vào 1 khách hàng */
function clickConversation() {
    // nếu mess đang được show thì không cho click nữa
    if (isMobile() && commonStore.is_show_message_mobile) return

    if (!$props.source?.fb_page_id || !$props.source?.fb_client_id) return

    // hiện tin nhắn ở giao diện mobile
    commonStore.is_show_message_mobile = true

    selectConversation($props.source)

    // đẩy id lên param
    $router.replace({
        query: {
            page_id: $props.source?.fb_page_id,
            user_id: $props.source?.fb_client_id,
        }
    })

    // tìm uid fb nếu chưa có và đang bật ext
    if (
        commonStore.is_active_extension &&
        !$props.source?.client_bio?.fb_uid
    ) getFbUserInfo()
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