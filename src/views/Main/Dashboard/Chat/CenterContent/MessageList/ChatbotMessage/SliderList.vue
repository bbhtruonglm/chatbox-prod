<template>
    <div class="relative">
        <div @click="moveSlider('LEFT')"
            class="cursor-pointer rounded-full bg-slate-200 w-[30px] h-[30px] flex items-center justify-center absolute z-[1] top-[50%] translate-y-[-50%] left-[-15px]">
            <img src="@/assets/icons/arrow-left.svg" class="w-[13px] h-[13px]" />
        </div>
        <div @click="moveSlider('RIGHT')"
            class="cursor-pointer rounded-full bg-slate-200 w-[30px] h-[30px] flex items-center justify-center absolute z-[1] top-[50%] translate-y-[-50%] right-[-15px]">
            <img src="@/assets/icons/arrow-right.svg" class="w-[13px] h-[13px]" />
        </div>
        <div ref="slider_warper_ref" class="relative w-[216px] h-[280px] overflow-hidden overflow-x-auto scroll-smooth">
            <div class="absolute flex h-full">
                <div v-for="item of data"
                    class="w-[216px] mr-[8px] bg-white rounded-b-xl rounded-t-xl overflow-hidden last:mr-0">
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
import { ref } from 'vue'

import ButtonList from '@/views/Main/Dashboard/Chat/CenterContent/MessageList/ChatbotMessage/ButtonList.vue'

import type { ChatbotSlider } from '@/service/interface/app/message'
import type { ComponentRef } from '@/service/interface/vue';

const $props = withDefaults(defineProps<{
    data?: ChatbotSlider[]
}>(), {})

/**ref của slider */
const slider_warper_ref = ref<ComponentRef>()

/**di chuyển các item bên trong slider */
function moveSlider(direction: 'LEFT' | 'RIGHT') {
    /**độ rộng của 1 slider */
    const WIDTH = 224

    // qua trái
    if (direction === 'LEFT') slider_warper_ref.value.scrollLeft -= WIDTH

    // qua phải
    if (direction === 'RIGHT') slider_warper_ref.value.scrollLeft += WIDTH
}
</script>