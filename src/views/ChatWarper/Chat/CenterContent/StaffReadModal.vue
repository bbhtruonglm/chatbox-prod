<template>
    <!-- Modal hiển thị thời gian đọc tin nhắn -->
    <Modal ref="staff_read_modal_ref">
        <template v-slot:header>
            {{ $t('v1.view.main.dashboard.chat.center_content.staff_read_time') }}
        </template>
        <template v-slot:body>
            <div class="flex justify-center">
                <div class="w-full md:w-[60%] xl:w-[50%]">
                    <template v-for="staff_id of messageStore.select_staff_read_id">
                        <div class="flex items-center mb-2">
                            <StaffAvatar :id="staff_id"  class="rounded-full w-9 h-9" />
                            <div class="ml-2 text-slate-600 w-[calc(100%_-_43px)]">
                                <span class="font-semibold">{{ getStaffName(conversationStore.select_conversation?.fb_page_id, staff_id) }}</span>
                                {{ $t('v1.view.main.dashboard.chat.center_content.staff_read') }}
                                {{ getStaffReadDate(staff_id) }}
                            </div>
                        </div>
                    </template>
                </div>
            </div>
        </template>
    </Modal>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { format as format_date } from 'date-fns'
import { useConversationStore, useMessageStore } from '@/stores'
import { getPageStaff,getStaffReadDate,  getStaffName } from '@/service/function'
import { useI18n } from 'vue-i18n'

import StaffAvatar from '@/components/Avatar/StaffAvatar.vue'
import Modal from '@/components/Modal.vue'

import type { ComponentRef } from '@/service/interface/vue'

const conversationStore = useConversationStore()
const messageStore = useMessageStore()
const $t = useI18n().t

/**ref của modal */
const staff_read_modal_ref = ref<ComponentRef>()

watch(
    () => messageStore.select_staff_read_id,
    () => staff_read_modal_ref.value.toggleModal()
)

/**format thời gian */
// function getStaffReadDate(staff_id: string) {
//     const TIME = conversationStore.select_conversation?.staff_read?.[staff_id] || 0

//     return format_date(new Date(TIME), 'HH:mm:ss, dd/MM/yyyy')
// }
</script>