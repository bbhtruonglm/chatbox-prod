<template>
    <div class="w-full md:h-[180px] h-[230px] my-3 flex justify-end">
        <div class="w-[95%] bg-white rounded-lg p-3">
            <div class="flex text-xs justify-between items-center text-slate-600">  
                <p class="md:w-full w-[50%]" >Đăng bởi <span class="font-bold">Phạm Thành</span> - 09/10/2022 lúc 11:27</p>
                <div class=" rounded-3xl p-1 bg-orange-200 text-orange-500 font-bold whitespace-nowrap cursor-pointer">
                    123232....(Copy)
                </div>
            </div>
            <div class="flex items-center mt-2">
                <img 
                    class="w-[60px] h-[60px] mr-3"
                    src="https://merchant-dev-static.s3.ap-southeast-1.amazonaws.com/files/business_642655457c339f9194288da9/1695532605955.jpeg" alt=""
                >
                <p class="text-sm text-slate-700 font-normal">
                    Donec pharetra enim vitae orci fringilla dignissim. Suspendisse potenti. Ut quis eros eget nunc lacinia vehicula. Vivamus euismod mollis ips.. 
                    <span class="font-bold cursor-pointer">Xem thêm</span>
                </p>
            </div>
            <div class="flex mt-2 bg-slate-100 py-1 px-2 rounded-md justify-between">
                <p class="text-sm font-semibold">Inbox để nhận free</p>
                <div class="flex">
                    <button 
                        @click="toggleModal"
                        class="bg-blue-600 p-1 rounded-md text-xs text-white mr-1 font-medium"
                    >
                        Xem tin nhắn
                    </button>
                    <img :src="NoteIcon" alt="">
                </div>
            </div>
            <div class="flex justify-end mt-2">
                <p class="text-slate-700 text-xs underline">Mở trên Facebook</p>
            </div>
        </div>
    </div>
    <FacebookCommentModal ref="fb_cmt_ref" />
</template>

<script setup lang="ts">
import { ref } from 'vue';

import { isMobile } from '@/service/function';

import type { ComponentRef } from '@/service/interface/vue';

import FacebookCommentModal from '@/components/Main/Dashboard/FacebookCommentModal.vue';

import NoteIcon from "@/assets/icons/note.svg"

const $props = withDefaults(defineProps<{
    fb_post_id?: string
}>(), {})


/** ref của modal */
const fb_cmt_ref = ref<ComponentRef>()

/** Dùng để bật tắt modal */
function toggleModal() {
    fb_cmt_ref.value?.toggleModal()
}


</script>