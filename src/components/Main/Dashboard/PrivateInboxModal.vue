<template>
    <Modal ref="modal_ref" :fit_content="true">
        <template v-slot:header>
            Nhắn tin inbox AAA
        </template>
        <template v-slot:body>
            <div class="sm:w-[350px]">
                <div ref="input_inbox_ref" id="chat-text-input-message"
                    class="
                        h-[100px] 
                        overflow-hidden 
                        overflow-y-auto 
                        relative pl-2 
                        w-full px-3 py-1 
                        focus:outline-none 
                        bg-slate-100 rounded-lg
                    "
                    contenteditable="true"
                    placeholder="Viết tin nhắn với vai trò trên trang"
                />
            </div>
            <div class="text-sm flex justify-end items-center mt-3 cursor-pointer">
                <p class="text-blue-500 mr-3" @click="toggleModal">
                    Hủy
                </p>
                <button 
                    class="bg-blue-500 text-white rounded-lg px-2 py-1 cursor-pointer"
                >
                    Gửi tin nhắn
                </button>
            </div>
        </template>
    </Modal>
</template>

<script setup lang="ts">
import { ref } from 'vue';

import Modal from '@/components/Modal.vue';

import type { ComponentRef } from '@/service/interface/vue';

/** Ref của modal */
const modal_ref = ref<ComponentRef>()

/** Dùng để bật tắt modal */
function toggleModal() {
    modal_ref.value?.toggleModal()
}

defineExpose({ toggleModal })
</script>

<style>
[contenteditable=true]:empty:before{
  content: attr(placeholder);
  pointer-events: none;
  display: block; /* For Firefox */
  color: rgba(128, 128, 128, 0.672);
  font-size: 14px;
}
</style>