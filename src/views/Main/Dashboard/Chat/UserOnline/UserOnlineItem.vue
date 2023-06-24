<template>
    <div @click="modal_staff_info_ref?.toggleModal()" class="relative w-[35px] cursor-pointer">
        <StaffAvatar class="rounded-full" :id="source?.fb_staff_id" size="30" />
        <span v-if="source?.is_online"
            class="absolute bg-green-500 w-[13px] h-[13px] rounded-full bottom-[-3px] right-[3px]" />
        <!-- <span v-else class="absolute left-[10px] bottom-[-6px] text-xs text-blue-400 bg-white px-1 rounded-full">2s</span> -->
        <Modal ref="modal_staff_info_ref">
            <template v-slot:body>
                <div class="flex flex-col items-center">
                    <StaffAvatar :class="source?.is_online ? 'border-green-500' : 'border-red-500'"
                        class="rounded-full border-[5px]" :id="source?.fb_staff_id" size="150" />
                    <div class="mt-2 font-bold text-2xl text-slate-500 flex">
                        {{ source?.name }}
                        <img class="ml-1" src="@/assets/icons/verify-check.svg">
                    </div>
                    <div class="text-lg font-bold">
                        <span v-if="source?.is_online" class="text-green-500">
                            {{ $t('v1.view.main.dashboard.chat.online_status.online') }}
                        </span>
                        <span v-else class="text-red-500">
                            {{ $t('v1.view.main.dashboard.chat.online_status.offline') }}
                        </span>
                    </div>
                </div>
            </template>
        </Modal>
    </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'

import Modal from '@/components/Modal.vue'
import StaffAvatar from '@/components/Avatar/StaffAvatar.vue'

import type { StaffInfo } from '@/service/interface/app/staff'
import type { ComponentRef } from '@/service/interface/vue'

withDefaults(defineProps<{
    source?: StaffInfo
}>(), {})

/**ref của modal thông tin cá nhân của 1 staff */
const modal_staff_info_ref = ref<ComponentRef>()
</script>