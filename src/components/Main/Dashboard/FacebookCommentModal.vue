<template>
    <Modal ref="modal_ref" :fit_content="true" >
        <template v-slot:header>
            Tiêu đề của bài viết
        </template>
        <template v-slot:body>
            <div class="sm:w-[888px] h-[75vh] overflow-y-auto">
                <div class="flex justify-between mb-3" v-for="i of 3">
                    <img src="https://merchant-dev-static.s3.ap-southeast-1.amazonaws.com/files/business_642655457c339f9194288da9/1695532605955.jpeg" alt="" class="w-[40px] h-[40px] rounded-full">
                    <div class="ml-3 w-full">

                        <div class="rounded-lg bg-slate-100 p-2 text-sm w-fit">
                            <p class="font-bold">Tên khách hàng</p>
                            <p>Nội dung tin nhắn</p>
                        </div>

                        <div class="flex text-xs text-slate-400 mt-1.5">
                            <p class="font-bold mr-3 cursor-pointer">Trả lời bình luận</p>
                            <p @click="openPrivateInbox" class="font-bold mr-3 cursor-pointer">Nhắn tin inbox</p>
                            <p>33 phút</p>
                        </div>

                        <div class="flex mt-3">
                            <img src="https://merchant-dev-static.s3.ap-southeast-1.amazonaws.com/files/business_642655457c339f9194288da9/1695532605955.jpeg" alt="" class="w-[40px] h-[40px] rounded-full">
                            <div class="ml-3">
                                <div class="rounded-lg bg-slate-100 p-2 text-sm w-fit">
                                    <p class="font-bold">Tên trang</p>
                                    <p>Nội dung tin nhắn</p>
                                </div>

                                <div class="flex text-xs text-slate-400 mt-1.5">
                                    <p class="font-bold mr-3 cursor-pointer">Trả lời bình luận</p>
                                    <p @click="openPrivateInbox" class="font-bold mr-3 cursor-pointer">Nhắn tin inbox</p>
                                    <p>33 phút</p>
                                </div>

                            </div>
                        </div>

                        <div class="flex mt-3">
                            <img src="https://merchant-dev-static.s3.ap-southeast-1.amazonaws.com/files/business_642655457c339f9194288da9/1695532605955.jpeg" alt="" class="w-[40px] h-[40px] rounded-full">
                            <div class="ml-3">
                                <div class="rounded-lg bg-slate-100 p-2 text-sm w-fit">
                                    <p class="font-bold">Tên trang</p>
                                    <p>Nội dung tin nhắn Nội dung tin nhắn Nội dung tin nhắn Nội dung tin nhắn Nội dung tin nhắn</p>
                                    <img class="w-[60px] mt-3" src="https://merchant-dev-static.s3.ap-southeast-1.amazonaws.com/files/business_642655457c339f9194288da9/1695532605955.jpeg" alt="">
                                </div>
                                <div class="flex text-xs text-slate-400 mt-1.5">
                                    <p class="font-bold mr-3 cursor-pointer">Trả lời bình luận</p>
                                    <p @click="openPrivateInbox" class="font-bold mr-3 cursor-pointer">Nhắn tin inbox</p>
                                    <p>33 phút</p>
                                </div>
                            </div>
                        </div>

                        <p class="text-sm font-bold cursor-pointer mt-3">Xem thêm phản hồi...</p>

                        <div class="flex mt-3 w-full">
                            <img src="https://merchant-dev-static.s3.ap-southeast-1.amazonaws.com/files/business_642655457c339f9194288da9/1695532605955.jpeg" alt="" class="w-[40px] h-[40px] rounded-full">
                            <div class="ml-3 w-full flex relative">
                                <input 
                                    class="w-full px-4 py-1.5 bg-slate-100 rounded-2xl text-sm focus:outline-none"
                                    type="text" 
                                    placeholder="Bình luận với vai trò <Tên trang>"
                                >
                                <img class=" absolute right-3 top-3" :src="SendMessageIcon" alt="">
                            </div>
                        </div>

                    </div>
                </div>
                <p class="text-sm font-bold cursor-pointer mt-3">Xem thêm phản hồi...</p>
            </div>
        </template>
    </Modal>
    <PrivateInboxModal ref="private_inbox_ref" />
</template>

<script setup lang="ts">
import { ref } from 'vue';

import Modal from '@/components/Modal.vue';
import PrivateInboxModal from './PrivateInboxModal.vue';

import type { ComponentRef } from '@/service/interface/vue';

import SendMessageIcon from "@/assets/icons/send.svg"

/** Ref của modal */
const modal_ref = ref<ComponentRef>()
/** Ref của modal private inbox */
const private_inbox_ref = ref<ComponentRef>()

/** Dùng để bật tắt modal */
function toggleModal() {
    modal_ref.value?.toggleModal()
}

/** Dùng để bật tắt modal private inbox */
function openPrivateInbox() {
    private_inbox_ref.value?.toggleModal()
}

defineExpose({ toggleModal })
</script>