<template>

    <!-- Hiển thị nhân viên đã đọc tin nhắn -->
    <div class="flex justify-end cursor-pointer" @click="toggleModal">
        <template v-for="(staff_read_time, staff_id) of conversationStore.select_conversation?.staff_read">
            <StaffAvatar v-if="isStaffLastReadThisMessage(staff_id as string, staff_read_time)" :id="(staff_id as string)" size="20"
                :class="`message-staff-read-${staff_id}`"
                class="rounded-full ml-[-5px] hidden my-1" />
        </template>
    </div>

    <!-- Modal hiển thị thời gian đọc tin nhắn -->
    <Modal ref="moda_staff_read">
        <template v-slot:header>
            {{ $t('v1.view.main.dashboard.chat.center_content.staff_read_time') }}
        </template>
        <template v-slot:body>
            <div 
                v-for="(staff_read_time, staff_id) of conversationStore.select_conversation?.staff_read"
                class="flex items-center justify-center"
                v-show="isStaffLastReadThisMessage2(staff_id as string, staff_read_time)"
            >
                <StaffAvatar
                    :id="(staff_id as string)" size="25"
                    :class="`message-staff-read-${staff_id}`"
                    class="rounded-full ml-[-5px] my-1"
                />
                <p class="ml-3">{{ staffs[staff_id].name }}</p>
                <p class="ml-3">{{ format_date(new Date(staff_read_time), 'hh:mm:ss, dd/MM/yyyy') }}</p>
            </div>
        </template>
    </Modal>

</template>
<script setup lang="ts">
import StaffAvatar from '@/components/Avatar/StaffAvatar.vue'
import { useConversationStore, useCommonStore, usePageStore } from '@/stores'
import { ref, onMounted } from 'vue'
import { map } from 'lodash'
import { format as format_date } from 'date-fns'

import Modal from '@/components/Modal.vue'
import type { ComponentRef } from '@/service/interface/vue'
import type { StaffInfo } from '@/service/interface/app/staff'

const $emit = defineEmits(['change_last_read_message'])

const $props = withDefaults(defineProps<{
    /**thời gian của tin nhắn */
    time?: string
}>(), {})


const conversationStore = useConversationStore()
const commonStore = useCommonStore()
const pageStore = usePageStore()

/**ref của modal */
const moda_staff_read = ref<ComponentRef>()

/** Danh sách nhân viên */
const staffs = ref<{ [index: string]: StaffInfo }>({})

/** Ẩn hiện modal */
function toggleModal() {
    moda_staff_read.value?.toggleModal()
}

/** Lấy danh sách nhân viên */
function getStaffs() {
    map(pageStore.selected_page_list_info, item => {
        staffs.value = { ...staffs.value, ...item.staff_list }
    })
    console.log("staffs.value", staffs.value)
}

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

/**kiểm tra xem nhân viên có đọc đến tin nhắn này hay không */
function isStaffLastReadThisMessage2(staff_id?: string, staff_read_time?: number) {
    if (!staff_read_time || !$props.time) return false

    /**thời gian tin nhắn này được tạo */
    const CURRENT_MESSAGE_DATE = new Date($props.time).getTime()

    // chỉ render icon ngoài khoảng thời gian
    if (CURRENT_MESSAGE_DATE > staff_read_time) return false

    return true
}

onMounted(() => {
    getStaffs()
})

defineExpose({ toggleModal })
</script>