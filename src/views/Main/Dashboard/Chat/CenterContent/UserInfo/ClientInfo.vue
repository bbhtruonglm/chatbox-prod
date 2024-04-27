<template>
    <Modal ref="client_info_modal_ref">
        <template v-slot:header>
            {{ $t('v1.view.main.dashboard.chat.client.title') }}
        </template>
        <template v-slot:body>
            <div class="flex flex-col items-center mt-5">
                <ClientAvatar :client_name="conversationStore.select_conversation?.client_name"
                    :client_id="conversationStore.select_conversation?.fb_client_id"
                    :page_id="conversationStore.select_conversation?.fb_page_id"
                    :staff_id="chatbotUserStore.chatbot_user?.fb_staff_id"
                    :platform_type="conversationStore.select_conversation?.platform_type" size="100"
                    :client_avatar="conversationStore.select_conversation?.client_avatar"
                    class="rounded-full cursor-pointer" />
                <div class="font-semibold text-slate-500 text-lg mt-2">
                    {{ conversationStore.select_conversation?.client_name }}
                </div>
                <div class="grid grid-cols-3 text-sm mt-5 gap-3">
                    <div class="text-slate-500 text-right">
                        {{ $t('v1.common.client_id') }}
                    </div>
                    <div class="col-span-2 font-bold">
                        {{ conversationStore.select_conversation?.fb_client_id }}
                    </div>
                    <div class="text-slate-500 text-right">
                        {{ $t('v1.common.uid') }}
                    </div>
                    <div class="col-span-2 font-bold">
                        {{ conversationStore.select_conversation?.client_bio?.fb_uid }}
                    </div>
                    <div class="text-slate-500 text-right">
                        {{ $t('v1.common.phone') }}
                    </div>
                    <div ref="client_phone_ref" class="col-span-2 font-bold text-green-500 focus:outline-none rounded"
                        :class="{ 'border-2 p-1': is_edit }" :contenteditable="is_edit">
                        {{ conversationStore.select_conversation?.client_phone }}
                    </div>
                    <div class="text-slate-500 text-right">
                        {{ $t('v1.common.email') }}
                    </div>
                    <div ref="client_email_ref" class="col-span-2 font-bold text-green-500 focus:outline-none rounded"
                        :class="{ 'border-2 p-1': is_edit }" :contenteditable="is_edit">
                        {{ conversationStore.select_conversation?.client_email }}
                    </div>
                </div>
            </div>
        </template>
        <template v-slot:footer>
            <div class="text-center my-2">
                <button v-if="!is_edit" @click="is_edit = true" class="bg-orange-500 text-white py-1 px-4 rounded-full">
                    {{ $t('v1.common.edit') }}
                </button>
                <template v-else>
                    <button @click="updateClientInfo" class="bg-green-500 text-white py-1 px-4 rounded-full mr-2">
                        {{ $t('v1.common.ok') }}
                    </button>
                    <button @click="cancelEdit" class="bg-red-500 text-white py-1 px-4 rounded-full">
                        {{ $t('v1.common.cancel') }}
                    </button>
                </template>
            </div>
        </template>
    </Modal>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { useConversationStore, useChatbotUserStore } from '@/stores'
import { update_info_conversation } from '@/service/api/chatbox/n4-service'

import Modal from '@/components/Modal.vue'
import ClientAvatar from '@/components/Avatar/ClientAvatar.vue'

import type { ComponentRef } from '@/service/interface/vue'
import { flow } from '@/service/helper/async'
import type { CbError } from '@/service/interface/function'

const conversationStore = useConversationStore()
const chatbotUserStore = useChatbotUserStore()

/**ref của modal */
const client_info_modal_ref = ref<ComponentRef>()
/**div chứa sdt */
const client_phone_ref = ref<ComponentRef>()
/**div chứa email */
const client_email_ref = ref<ComponentRef>()
/**gắn cờ chỉnh sửa */
const is_edit = ref(false)

/**huỷ thay đổi */
function cancelEdit() {
    // reset dữ liệu về như cũ
    client_phone_ref.value.innerText = conversationStore.select_conversation?.client_phone || ''
    client_email_ref.value.innerText = conversationStore.select_conversation?.client_email || ''

    is_edit.value = false
}
/**cập nhật thông tin của khách hàng */
function updateClientInfo() {
    const client_phone = client_phone_ref.value?.innerText?.trim()
    const client_email = client_email_ref.value?.innerText?.trim()

    if (!client_phone && !client_email) return

    flow([
        (cb: CbError) => update_info_conversation({
            page_id: conversationStore.select_conversation?.fb_page_id as string,
            client_id: conversationStore.select_conversation?.fb_client_id as string,
            client_phone,
            client_email
        }, (e, r) => {
            if (e) return cb(e)

            is_edit.value = false

            // sửa lại giá trị của khách hàng đang được chọn
            if (conversationStore.select_conversation) {
                conversationStore.select_conversation.client_phone = client_phone
                conversationStore.select_conversation.client_email = client_email
            }

            // sửa lại giá trị trong danh sách khách hàng
            if (conversationStore.select_conversation?.data_key) {
                conversationStore.conversation_list[
                    conversationStore.select_conversation?.data_key
                ].client_phone = client_phone
                conversationStore.conversation_list[
                    conversationStore.select_conversation?.data_key
                ].client_email = client_email
            }

            cb()
        })
    ], undefined, true)
}
/**toggle modal */
function toggleModal() {
    client_info_modal_ref.value.toggleModal()
}

defineExpose({ toggleModal })
</script>