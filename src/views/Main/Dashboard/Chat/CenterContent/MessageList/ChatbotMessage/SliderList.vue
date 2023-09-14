<template>
    <div class="relative">
        <div
            class="cursor-pointer rounded-full bg-slate-200 w-[30px] h-[30px] flex items-center justify-center absolute z-[1] top-[50%] translate-y-[-50%] left-[-15px]">
            <img src="@/assets/icons/arrow-left.svg" class="w-[13px] h-[13px]" />
        </div>
        <div
            class="cursor-pointer rounded-full bg-slate-200 w-[30px] h-[30px] flex items-center justify-center absolute z-[1] top-[50%] translate-y-[-50%] right-[-15px]">
            <img src="@/assets/icons/arrow-right.svg" class="w-[13px] h-[13px]" />
        </div>
        <div class="relative w-[216px] h-[280px] overflow-hidden overflow-x-auto">
            <div class="absolute flex h-full">
                <div v-for="item of data" class="w-[216px] mr-2 bg-white rounded-b-xl rounded-t-xl overflow-hidden last:mr-0">
                    <div :style="{
                        'background-image': `url(${item?.image_url})`
                    }" class="w-full h-[100px] bg-no-repeat bg-center bg-cover" />
                    <div class="font-semibold truncate px-2">
                        {{ item?.title }}
                    </div>
                    <div class="text-slate-500 truncate px-2">
                        {{ item?.subtitle }}
                    </div>
                    <ButtonList :data="item?.buttons" />
                </div>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import type { ChatbotSlider } from '@/service/interface/app/message'

import ButtonList from '@/views/Main/Dashboard/Chat/CenterContent/MessageList/ChatbotMessage/ButtonList.vue'

const $props = withDefaults(defineProps<{
    data?: ChatbotSlider[]
}>(), {})
</script>