<template>
    <div v-if="get_post_success && !loading" class="w-full sm:h-[180px] h-[190px] my-3 flex justify-end">
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
                <div class="text-sm text-slate-700 font-normal h-[60px] overflow-scroll">
                    <span>Donec pharetra enim vitae orci fringilla dignissim. Suspendisse potenti. Ut quis eros eget nunc lacinia vehicula. Vivamus euismod mollis ips.. </span>
                </div>
            </div>
            <div class="flex mt-2 bg-slate-100 py-1 px-2 rounded-md justify-between">
                <p class="text-sm font-semibold truncate w-[70%]">
                    Inbox để nhận free
                </p>
                <div class="flex">
                    <button 
                        @click="toggleModal"
                        class="bg-blue-600 p-1 rounded-md text-xs text-white mr-1 font-medium whitespace-nowrap"
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
    <div 
        class="w-full sm:h-[180px] h-[190px] justify-end my-3 flex" 
        v-if="!get_post_success"
    >
        <div class="w-[95%] h-full text-white bg-slate-400 rounded-lg flex items-center justify-center">
            <p>Không lấy được dữ liệu bài viết...</p>
        </div>
    </div>
    <div 
        class="w-full sm:h-[180px] h-[190px] justify-end my-3 flex" 
        v-if="loading"
    >
        <div class="w-[95%] h-full text-white bg-slate-400 rounded-lg flex items-center justify-center">
            <Loading type="FULL" />
        </div>

    </div>
    <FacebookCommentModal ref="fb_cmt_ref" />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

import type { ComponentRef } from '@/service/interface/vue';

import Loading from '@/components/Loading.vue';
import FacebookCommentModal from '@/components/Main/Dashboard/FacebookCommentModal.vue';

import NoteIcon from "@/assets/icons/note.svg"

const $props = withDefaults(defineProps<{
    fb_post_id?: string
}>(), {})


/** ref của modal */
const fb_cmt_ref = ref<ComponentRef>()
/** trạng thái lấy bài post có thành công hay ko */
const get_post_success = ref<boolean>(true)
/** trạng loading bài post */
const loading = ref<boolean>(true)


onMounted(() => {
    setTimeout(function() { loading.value = false }, 3000)
})

/** Dùng để bật tắt modal */
function toggleModal() {
    fb_cmt_ref.value?.toggleModal()
}
</script>