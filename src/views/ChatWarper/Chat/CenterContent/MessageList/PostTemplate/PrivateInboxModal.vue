<template>
    <Modal ref="modal_ref" >
        <template v-slot:header>
            Nhắn tin inbox {{ `<${$props.target_name}>` }}
        </template>
        <template v-slot:body>
            <div class="sm:w-[350px]">
                <div ref="input_inbox_ref" id="input-private-inbox"
                    class="
                        h-[100px]
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
        </template>
        <template v-slot:footer>
            <div class="text-sm flex justify-end items-center cursor-pointer mb-2">
                <p class="text-blue-500 hover:text-blue-600 mr-3" @click="toggleModal">
                    {{ $t('v1.view.main.dashboard.chat.post.cancel') }}
                </p>
                <button 
                    class="bg-blue-500 hover:bg-blue-600 text-white rounded-lg px-2 py-1 cursor-pointer"
                    @click="privateInbox"
                >
                    <p v-if="!loading">
                        {{ $t('v1.view.main.dashboard.chat.post.send_message') }}
                    </p>
                    <Loading class=" mx-5" v-if="loading" />
                </button>
            </div>
        </template>
    </Modal>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { get } from 'lodash';
import { useI18n } from 'vue-i18n'

// * Components
import Modal from '@/components/Modal.vue';
import Loading from '@/components/Loading.vue';

// * Interface
import type { ComponentRef } from '@/service/interface/vue';

// * Helper
import { toast } from '@/service/helper/alert';

import { 
    private_inbox
} from '@/service/api/chatbox/n4-service';

// * Props
const $props = withDefaults(defineProps<{
    page_id?: string,
    target_id?: string
    target_name?: string
    client_id?: string
}>(), {})

// * Use i18n
const { t: $t } = useI18n()

/** Ref của modal */
const modal_ref = ref<ComponentRef>()
const loading = ref<boolean>(false)


/** Dùng để bật tắt modal */
function toggleModal() {
    modal_ref.value?.toggleModal()
}
/** Gửi tin nhắn private */
function privateInbox() {
    if(loading.value) return
    loading.value = true

    let text: string = ''
    let input = document.getElementById('input-private-inbox')
    if(input) text = input.innerText

    if(!text) return toast('error', '')

    private_inbox(
        { 
            page_id: $props.page_id,
            client_id: $props.client_id,
            target_id: $props.target_id,
            text
        },
        (e, r) => {
            
            loading.value = false

            if(get(r, 'error.message')) {
                toggleModal()
                return toast('error', get(r, 'error.message'))
            }

            toggleModal()
            toast(
                'success',
                $t('v1.view.main.dashboard.chat.post.send_message_success')
            )
        }
    )
}

defineExpose({ toggleModal })
</script>

<style scoped lang="scss">
[contenteditable=true]:empty:before{
  content: attr(placeholder);
  pointer-events: none;
  display: block; /* For Firefox */
  color: rgba(128, 128, 128, 0.672);
  font-size: 14px;
}
</style>