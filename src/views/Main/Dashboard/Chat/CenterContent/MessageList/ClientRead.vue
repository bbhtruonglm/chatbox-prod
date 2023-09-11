<template>
    <ClientAvatar v-if="isClientLastReadThisMessage()" :client_name="conversationStore.select_conversation?.client_name"
        :client_id="conversationStore.select_conversation?.fb_client_id"
        :page_id="conversationStore.select_conversation?.fb_page_id" :staff_id="chatbotUserStore.chatbot_user?.fb_staff_id"
        :platform_type="conversationStore.select_conversation?.platform_type" size="15"
        class="mesage-client-read rounded-full absolute right-0 bottom-[50%] hidden" />
</template>
<script setup lang="ts">
import { useConversationStore, useChatbotUserStore } from '@/stores'

import ClientAvatar from '@/components/Avatar/ClientAvatar.vue'

const $emit = defineEmits(['change_last_read_message'])

const $props = withDefaults(defineProps<{
    /**thời gian của tin nhắn */
    time?: string
}>(), {})

const conversationStore = useConversationStore()
const chatbotUserStore = useChatbotUserStore()

/**
 * kiểm tra xem có cho phép hiển thị avatar của khách hàng, thể hiện khách hàng
 * đã đọc đến tin nhắn này hay không
 */
function isClientLastReadThisMessage() {
    if (!conversationStore.select_conversation?.last_read_message || !$props.time) return false

    /**thời gian tin nhắn này được tạo */
    const CURRENT_MESSAGE_DATE = new Date($props.time).getTime()
    /**thời gian cuối cùng khách hàng đọc tin nhắn */
    const CLIENT_LAST_READ_DATE = Number(conversationStore.select_conversation?.last_read_message)

    // chỉ render icon ngoài khoảng thời gian
    if (CURRENT_MESSAGE_DATE < CLIENT_LAST_READ_DATE) return false

    // gửi sự kiện ra bên ngoài để hiển thị icon đầu tiên, các icon còn lại sẽ ẩn
    $emit('change_last_read_message')

    return true
}
</script>