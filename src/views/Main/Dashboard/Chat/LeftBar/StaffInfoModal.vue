<template>
    <Modal ref="modal_staff_info_ref" @close_modal="onCloseModal">
        <template v-slot:body>
            <div class="flex flex-col items-center">
                <StaffAvatar :class="staffStore.view_staff_info?.is_online ? 'border-green-500' : 'border-red-500'"
                    class="rounded-full border-[5px]" :id="staffStore.view_staff_info?.fb_staff_id" size="150" />
                <div class="mt-2 font-bold text-2xl text-slate-500 flex">
                    {{ staffStore.view_staff_info?.name }}
                    <img class="ml-1" src="@/assets/icons/verify-check.svg">
                </div>
                <div class="text-lg font-bold">
                    <span v-if="staffStore.view_staff_info?.is_online" class="text-green-500">
                        {{ $t('v1.view.main.dashboard.chat.online_status.online') }}
                    </span>
                    <span v-else class="text-red-500">
                        {{ $t('v1.view.main.dashboard.chat.online_status.offline') }}
                    </span>
                </div>
            </div>
        </template>
    </Modal>
</template>
<script setup lang="ts">
import { ref, watch } from 'vue'
import { useStaffStore } from '@/stores'
import { size } from 'lodash'

import Modal from '@/components/Modal.vue'
import StaffAvatar from '@/components/Avatar/StaffAvatar.vue'

import type { ComponentRef } from '@/service/interface/vue'

const staffStore = useStaffStore()

/**ref của modal thông tin cá nhân của 1 staff */
const modal_staff_info_ref = ref<ComponentRef>()

// khi biến có dữ liệu, thì trigger để mở modal
watch(() => staffStore.view_staff_info, val => {
    // nếu modal tắt thì không xử lý
    if (!size(val)) return

    // mở modal
    modal_staff_info_ref.value?.toggleModal()
})

/**khi tắt modal thì xoá dữ liệu */
function onCloseModal() {
    staffStore.view_staff_info = undefined
}
</script>