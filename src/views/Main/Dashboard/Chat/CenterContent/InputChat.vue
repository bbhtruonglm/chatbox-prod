<template>
    <div class="w-full min-h-[50px] relative border-t flex items-center">
        <div
            class="min-w-[100px] h-[25px] rounded-t-md cursor-pointer absolute top-[-25px] left-[50%] translate-x-[-50%] overflow-hidden z-10">
            <div class="flex items-center justify-center h-full w-full bg-slate-200">
                <div v-for="i of 5" class="bg-red-600 w-[10px] h-[10px] rounded-full mx-1" />
            </div>
            <!-- <div class="bg-slate-600 text-white text-xs py-1 text-center">
                {{ $t('v1.common.close') }}
            </div> -->
            <!-- <div class="text-slate-600 bg-slate-200 text-xs font-bold py-1 text-center">
                {{ $t('v1.view.main.dashboard.chat.input.add_tag') }}
            </div> -->
        </div>
        <!-- <div class="absolute w-full h-[150px] border-t top-[-150px] lef-0 bg-white overflow-hidden overflow-y-auto pt-2 pb-7 px-2 flex flex-wrap justify-center">
            <div v-for="i of 100" class="bg-green-100 text-green-700 text-sm w-fit px-2 py-[2px] rounded-full mr-2 mb-2 cursor-pointer">
                {{ random_word() }}
            </div>
        </div> -->
        <div class="w-[30px] h-[30px] cursor-pointer flex justify-center items-center">
            <img src="@/assets/icons/clip.svg" width="17" height="17" />
        </div>
        <div class="w-[30px] h-[30px] cursor-pointer flex justify-center items-center">
            <img src="@/assets/icons/slash.svg" width="20" height="20" />
        </div>
        <div class="w-[calc(100%_-_90px)] h-full">
            <div @keydown.enter="test" id="input-chat" class="max-h-[150px] overflow-hidden overflow-y-auto relative pl-2 w-full h-full focus:outline-none" contenteditable="true" />
        </div>
        <div class="w-[30px] h-[30px] cursor-pointer flex justify-center items-center">
            <img src="@/assets/icons/send.svg" width="25" height="25" />
        </div>
    </div>
    <div class="w-full flex items-center h-[50px] border-t relative">
        <div class="w-[30px] h-[30px] cursor-pointer flex justify-center items-center">
            <img src="@/assets/icons/smile.svg" width="20" height="20" />
        </div>
        <div class="w-[30px] h-[30px] cursor-pointer flex justify-center items-center">
            <img src="@/assets/icons/picture.svg" width="20" height="20" />
        </div>
        <div class="w-[calc(100%_-_60px)] absolute left-[60px] overflow-hidden overflow-x-auto flex">
            <div v-for="i of 100"
                class="w-[30px] h-[30px] cursor-pointer flex justify-center items-center text-slate-600 font-extrabold mr-2">
                W
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { random_word } from '@/service/helper/random'

function test($event: KeyboardEvent) {
    if ($event.shiftKey) return

    $event.preventDefault()

    console.log('heyey', $event)
}
</script>