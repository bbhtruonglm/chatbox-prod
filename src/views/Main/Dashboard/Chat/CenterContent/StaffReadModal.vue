<template>
    <!-- Modal hiển thị thời gian đọc tin nhắn -->
    <Modal ref="moda_staff_read">
        <template v-slot:header>
            {{ $t('v1.view.main.dashboard.chat.center_content.staff_read_time') }}
        </template>
        <template v-slot:body>
            <div v-for="(staff_read_time, staff_id) of conversationStore.select_conversation?.staff_read"
                class="flex items-center justify-center"
                v-show="isStaffLastReadThisMessage(staff_read_time)">
                <StaffAvatar :id="(staff_id as string)" size="25" :class="`message-staff-read-${staff_id}`"
                    class="rounded-full ml-[-5px] my-1" />
                <p class="ml-3">{{ staffs[staff_id]?.name }}</p>
                <p class="ml-3">{{ format_date(new Date(staff_read_time), 'hh:mm:ss, dd/MM/yyyy') }}</p>
            </div>
        </template>
    </Modal>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { map } from 'lodash'
import { format as format_date } from 'date-fns'
import { useConversationStore, usePageStore, useMessageStore } from '@/stores'

import StaffAvatar from '@/components/Avatar/StaffAvatar.vue'
import Modal from '@/components/Modal.vue'

import type { StaffInfo } from '@/service/interface/app/staff'
import type { ComponentRef } from '@/service/interface/vue'


const $props = withDefaults(defineProps<{
    /**thời gian của tin nhắn */
    time?: string
}>(), {})

const conversationStore = useConversationStore()
const pageStore = usePageStore()
const messageStore = useMessageStore()

/**ref của modal */
const moda_staff_read = ref<ComponentRef>()
/** Danh sách nhân viên */
const staffs = ref<{ [index: string]: StaffInfo }>({})

watch(
    () => messageStore.staff_read.show,
    () => moda_staff_read.value.toggleModal()
)

/**kiểm tra xem nhân viên có đọc đến tin nhắn này hay không */
function isStaffLastReadThisMessage(staff_read_time?: number) {
    if (!staff_read_time || !messageStore.staff_read.message_time) return false

    /**thời gian tin nhắn này được tạo */
    const CURRENT_MESSAGE_DATE = new Date(messageStore.staff_read.message_time).getTime()

    // chỉ render icon ngoài khoảng thời gian
    if (CURRENT_MESSAGE_DATE > staff_read_time) return false

    return true
}

/** Lấy danh sách nhân viên */
function getStaffs() {
    map(pageStore.selected_page_list_info, item => {
        staffs.value = { ...staffs.value, ...item.staff_list }
    })
}

onMounted(() => {
    getStaffs()
})

</script>