<template>
    <div v-tooltip="source?.name" @click="openStaffInfo" class="relative w-[35px] cursor-pointer">
        <StaffAvatar class="rounded-full" :id="source?.fb_staff_id" size="30" />
        <span v-if="staffStore.staff_list_of_active_page?.[source?.fb_staff_id as string]?.is_online"
            class="absolute bg-green-500 w-[13px] h-[13px] rounded-full bottom-[-3px] right-[3px]" />
        <!-- <span v-else class="absolute left-[10px] bottom-[-6px] text-xs text-blue-400 bg-white px-1 rounded-full">2s</span> -->
    </div>
</template>
<script setup lang="ts">
import { useStaffStore } from '@/stores'
import { size } from 'lodash'

import StaffAvatar from '@/components/Avatar/StaffAvatar.vue'

import type { StaffInfo } from '@/service/interface/app/staff'

const $props = withDefaults(defineProps<{
    source?: StaffInfo
}>(), {})

const staffStore = useStaffStore()

/**truyền dữ liệu vào để mở modal staff info */
function openStaffInfo() {
    if (!size($props.source)) return

    staffStore.view_staff_info = $props.source
}
</script>