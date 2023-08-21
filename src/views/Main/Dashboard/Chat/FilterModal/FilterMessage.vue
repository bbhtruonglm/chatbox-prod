<template>
    <ModalBottom ref="filter_modal_ref" :left="commonStore.conversation_filter_modal_left" :width="commonStore.conversation_filter_modal_width">
        <template v-slot:header>
            {{ $t('v1.view.main.dashboard.chat.filter.message.title') }}
        </template>
        <template v-slot:body>
            <FilterCheckbox value="true" v-model="conversationStore.option_filter_page_data.unread_message"
                :icon="filterMessageSvg" :title="$t('v1.view.main.dashboard.chat.filter.message.unread')" />
            <FilterCheckbox value="true" v-model="conversationStore.option_filter_page_data.not_response_client"
                :icon="notReplySvg" :title="$t('v1.view.main.dashboard.chat.filter.message.not_reply')" />
            <FilterCheckbox value="true" v-model="conversationStore.option_filter_page_data.not_exist_label"
                :icon="notTagSvg" :title="$t('v1.view.main.dashboard.chat.filter.message.not_tag')" />
            <FilterCheckbox value="YES" v-model="is_spam_fb" :icon="SpamSvg"
                :title="$t('v1.view.main.dashboard.chat.filter.message.spam')" />
        </template>
        <template v-slot:footer>
            <div class="grid grid-cols-2 gap-4">
                <FilterButton @click="clearThisFilter" type="text-slate-500 hover:text-white hover:bg-slate-500"
                    :title="$t('v1.view.main.dashboard.chat.filter.un_filter')" />
                <FilterButton @click="toggleModal"
                    type="border-orange-500 text-orange-500 hover:text-white hover:bg-orange-500"
                    :title="$t('v1.view.main.dashboard.chat.filter.title')" />
            </div>
        </template>
    </ModalBottom>
</template>
<script setup lang="ts">
import { computed, ref } from 'vue'
import { useConversationStore, useCommonStore } from '@/stores'

import ModalBottom from '@/components/ModalBottom.vue'
import FilterCheckbox from '@/views/Main/Dashboard/Chat/FilterModal/FilterCheckbox.vue'
import FilterButton from '@/views/Main/Dashboard/Chat/FilterModal/FilterButton.vue'

import filterMessageSvg from '@/assets/icons/filter_message.svg'
import notReplySvg from '@/assets/icons/not_reply.svg'
import notTagSvg from '@/assets/icons/not_tag.svg'
import SpamSvg from '@/assets/icons/spam.svg'

import type { ComponentRef } from '@/service/interface/vue'

const conversationStore = useConversationStore()
const commonStore = useCommonStore()

/**ref của modal */
const filter_modal_ref = ref<ComponentRef>()

/**biến tạm của spam */
const is_spam_fb = computed({
    // lấy dữ liệu từ store
    get() {
        return conversationStore.option_filter_page_data.is_spam_fb
    },
    // khi có thay đổi thì set lại data cho store
    set(val) {
        if (!val)
            conversationStore.option_filter_page_data.is_spam_fb = 'NO'
        else
            conversationStore.option_filter_page_data.is_spam_fb = 'YES'
    }
})

/**loại bỏ lọc */
function clearThisFilter() {
    delete conversationStore.option_filter_page_data.unread_message
    delete conversationStore.option_filter_page_data.not_response_client
    delete conversationStore.option_filter_page_data.not_exist_label
    conversationStore.option_filter_page_data.is_spam_fb = 'NO'

    toggleModal()
}
/**ẩn hiện modal */
function toggleModal() {
    filter_modal_ref.value?.toggleModal()
}

defineExpose({ toggleModal })
</script>