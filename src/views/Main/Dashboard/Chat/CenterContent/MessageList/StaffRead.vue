<template>
    <div class="flex justify-end">
        <template v-for="(staff_read_time, staff_id) of conversationStore.select_conversation?.staff_read">
            <StaffAvatar v-if="isStaffLastReadThisMessage(staff_id as string, staff_read_time)" :id="(staff_id as string)" size="20"
                :class="`message-staff-read-${staff_id}`"
                class="rounded-full ml-[-5px] hidden my-1" />
        </template>
    </div>
</template>
<script setup lang="ts">
import StaffAvatar from '@/components/Avatar/StaffAvatar.vue'
import { useConversationStore } from '@/stores'

const $emit = defineEmits(['change_last_read_message'])

const $props = withDefaults(defineProps<{
    /**thời gian của tin nhắn */
    time?: string
}>(), {})

const conversationStore = useConversationStore()

/**kiểm tra xem nhân viên có đọc đến tin nhắn này hay không */
function isStaffLastReadThisMessage(staff_id?: string, staff_read_time?: number) {
    if (!staff_read_time || !$props.time) return false

    /**thời gian tin nhắn này được tạo */
    const CURRENT_MESSAGE_DATE = new Date($props.time).getTime()

    // chỉ render icon ngoài khoảng thời gian
    if (CURRENT_MESSAGE_DATE > staff_read_time) return false

    // gửi sự kiện ra bên ngoài để hiển thị icon cuối cùng, các icon còn lại sẽ ẩn
    $emit('change_last_read_message', staff_id)

    return true
}
</script>