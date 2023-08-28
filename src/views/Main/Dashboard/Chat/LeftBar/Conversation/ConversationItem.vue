<template>
    <div @click="clickConversation" :class="{
        'bg-amber-50 !border-l-orange-500': source?.data_key === conversationStore.select_conversation?.data_key
    }" class="border-l-4 border-l-white border-b py-1 px-2 flex h-full">
        <div class="w-fit h-fit relative">
            <ClientAvatar :client_name="source?.client_name" :client_id="source?.fb_client_id" :page_id="source?.fb_page_id"
                :staff_id="chatbotUserStore.chatbot_user?.fb_staff_id" :platform_type="source?.platform_type" size="37"
                class="rounded-full" />
            <div class="w-fit h-fit absolute bottom-[-4px] right-[-4px]">
                <PageAvatar :page_id="source?.fb_page_id"
                    :page_type="pageStore.selected_page_list_info?.[source?.fb_page_id as string]?.page?.type"
                    :page_avatar="pageStore.selected_page_list_info?.[source?.fb_page_id as string]?.page?.avatar" size="20"
                    class="rounded-full border-2 border-white" />
            </div>
        </div>
        <div class="w-[calc(100%_-_86px)] pl-2">
            <div class="flex items-center">
                <div v-if="source?.fb_staff_id" class="flex items-center">
                    <StaffAvatar @click="openStaffInfo" :id="source?.fb_staff_id" size="20" class="rounded-full" />
                    <div class="mx-1">
                        <img src="@/assets/icons/arrow-right.svg" width="8" height="8">
                    </div>
                </div>
                <div class="w-[calc(100%_-_33px)] truncate text-sm">
                    {{ source?.client_name }}
                </div>
            </div>
            <div class="text-slate-400 text-xs truncate mt-1">
                <span v-if="source?.last_message_type === 'page'">
                    {{ $t('v1.view.main.dashboard.chat.you') }}
                </span>
                {{ source?.last_message }}
            </div>
            <div class="flex items-center mt-1">
                <div v-if="source?.last_message_type === 'page'" class="mr-1">
                    <img src="@/assets/icons/reply.svg">
                </div>
                <div class="label-list w-[calc(100vw_-_128px)] overflow-hidden overflow-x-auto">
                    <template v-for="label_id of source?.label_id">
                        <div v-if="pageStore.selected_page_list_info?.[source?.fb_page_id as
                            string]?.label_list?.[label_id]"
                            :style="{ background: pageStore.selected_page_list_info?.[source?.fb_page_id as string]?.label_list?.[label_id]?.bg_color }"
                            class="text-white rounded-full text-xs px-2 mr-1">
                            {{ pageStore.selected_page_list_info?.[source?.fb_page_id as
                                string]?.label_list?.[label_id]?.title
                            }}
                        </div>
                    </template>
                </div>
                <!-- <div class="text-xs rounded border-2 text-slate-500">
                    +10
                </div> -->
            </div>
        </div>
        <div class="w-[49px] flex flex-col items-end">
            <div class="h-[24px]">
                <span v-if="source?.unread_message_amount" class="text-xs text-white bg-red-500 px-1 rounded-full">
                    {{ source?.unread_message_amount }}
                </span>
            </div>
            <div class="text-slate-400 text-xs">
                {{ formatLastMessageTime(source?.last_message_time) }}
            </div>
            <div class="flex items-center">
                <div v-if="source?.client_bio?.fb_uid">
                    <img src="@/assets/icons/facebook.svg" width="13" height="13">
                </div>
                <div v-if="source?.client_phone" class="ml-1">
                    <img src="@/assets/icons/phone.svg" width="13" height="13">
                </div>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import {
    useChatbotUserStore, usePageStore, useCommonStore, useStaffStore,
    useConversationStore,
} from '@/stores'
import { format as format_date, isToday, isThisWeek, isThisYear } from 'date-fns'
import viLocale from 'date-fns/locale/vi'
import { useRouter } from 'vue-router'
import { reset_read_conversation } from '@/service/api/chatbox/n4-service'
import { toastError } from '@/service/helper/alert'

import ClientAvatar from '@/components/Avatar/ClientAvatar.vue'
import StaffAvatar from '@/components/Avatar/StaffAvatar.vue'
import PageAvatar from '@/components/Avatar/PageAvatar.vue'

import type { ConversationInfo } from '@/service/interface/app/conversation'

const $props = withDefaults(defineProps<{
    source?: ConversationInfo
}>(), {})

const $router = useRouter()
const chatbotUserStore = useChatbotUserStore()
const pageStore = usePageStore()
const staffStore = useStaffStore()
const commonStore = useCommonStore()
const conversationStore = useConversationStore()

/**click chuột vào 1 khách hàng */
function clickConversation() {
    if (!$props.source?.fb_page_id || !$props.source?.fb_client_id) return

    // hiện tin nhắn ở giao diện mobile
    commonStore.is_show_message_mobile = true

    // chọn khách hàng này, lưu dữ liệu vào store
    if ($props.source) conversationStore.select_conversation = $props.source

    // đẩy id lên param
    $router.replace({
        query: {
            page_id: $props.source?.fb_page_id,
            client_id: $props.source?.fb_client_id,
        }
    })

    // đánh dấu tin nhắn là đã đọc
    reset_read_conversation({
        page_id: $props.source?.fb_page_id,
        client_id: $props.source?.fb_client_id,
    }, (e, r) => {
        if (e) return toastError(e)
    })
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

/**mở modal staff info */
function openStaffInfo() {
    if (!$props.source?.fb_staff_id) return

    staffStore.view_staff_info = staffStore
        .staff_list_of_active_page
        ?.[$props.source?.fb_staff_id]
}
</script>
<style scoped lang="scss">
.label-list {
    display: -webkit-box;

    &::-webkit-scrollbar {
        height: 0px;
    }
}
</style>