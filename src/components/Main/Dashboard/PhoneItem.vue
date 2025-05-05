<template>
    <div class="flex items-center justify-between p-2 gap-3 hover:bg-gray-100 rounded-md">
        <!-- Icon thông tin -->
        <div class="flex  items-center flex-1 overflow-hidden gap-3">
            <button class="p-1.5 flex items-center justify-center rounded-full bg-gray-100">
                <InformationCircleIcon class="text-black w-5 h-5"></InformationCircleIcon>
            </button>
            <!-- Thông tin số điện thoại và thời gian -->
            <div class="flex flex-1 flex-col overflow-hidden flex-shrink-0">
                <div class="flex items-center overflow-hidden justify-between">
                    <span class="font-medium text-sm text-black">{{ phone_number }}</span>
                    <span class="text-xs  text-slate-500">Tạo {{ created_at }}</span>
                </div>
                <span class="text-sm text-black">Gọi lần cuối: {{ last_call }}</span>
            </div>
        </div>
        <!-- Các nút hành động -->
        <div class="flex flex-shrink-0 items-center py-1.5 gap-2.5">
            <!--  -->
            <button class="w-7 h-7 flex justify-center items-center rounded-full border border-green-600 bg-green-100">
                <PhoneIcon class="w-3 h-3 text-green-600"></PhoneIcon>
            </button>
            <button class="w-7 h-7 flex justify-center items-center rounded-full border border-blue-700 bg-blue-100">
                <Zalo class="w-3 h-3"></Zalo>
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">

/**icon*/
import { InformationCircleIcon, PhoneIcon } from '@heroicons/vue/24/solid'
import Zalo from '@/components/Icons/Zalo.vue'

/*Prod truyền vào từ cha**/
defineProps<{
    phone_number: string
    created_at: string
    last_call: string
}>()


</script>