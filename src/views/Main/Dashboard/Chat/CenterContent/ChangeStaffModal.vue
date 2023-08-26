<template>
    <ModalBottom ref="change_staff_modal_ref" :left="commonStore.assign_staff_modal_left" :width="commonStore.assign_staff_modal_width">
        <template v-slot:header>
            {{ $t('v1.view.main.dashboard.chat.assign_staff.title') }}
        </template>
        <template v-slot:body>
            <div class="h-[400px] flex justify-center items-center p-10 border-2 border-dashed rounded-lg bg-slate-100">
                giao diện phân công nhân viên
            </div>
        </template>
    </ModalBottom>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { teleportModelAssignStaffOnPcScreen } from '@/service/function'
import { useCommonStore } from '@/stores'

import ModalBottom from '@/components/ModalBottom.vue'

import type { ComponentRef } from '@/service/interface/vue'

const commonStore = useCommonStore()

/**ref của modal chính */
const change_staff_modal_ref = ref<ComponentRef>()

onMounted(() => teleportModelAssignStaffOnPcScreen())

/**ẩn hiện modal */
function toggleModal() {
    change_staff_modal_ref.value?.toggleModal()
}

defineExpose({ toggleModal })
</script>