<template>
    <ModalBottom ref="filter_modal_ref" :left="commonStore.conversation_filter_modal_left" :width="commonStore.conversation_filter_modal_width">
        <template v-slot:header>
            {{ $t('v1.view.main.dashboard.chat.filter.interact.title') }}
        </template>
        <template v-slot:body>
            <div class="h-[calc(100vh_-_239px)]">
                <FilterRadio v-model="conversationStore.option_filter_page_data.display_style" value="INBOX"
                    :icon="filterMessageSvg" :title="$t('v1.view.main.dashboard.chat.filter.interact.message')" />
                <FilterRadio v-model="conversationStore.option_filter_page_data.display_style" value="COMMENT"
                    :icon="filterCommentSvg" :title="$t('v1.view.main.dashboard.chat.filter.interact.comment')" />
            </div>
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
import { ref } from 'vue'
import { useConversationStore, useCommonStore } from '@/stores'

import ModalBottom from '@/components/ModalBottom.vue'
import FilterRadio from '@/views/Main/Dashboard/Chat/LeftBar/FilterModal/FilterRadio.vue'
import FilterButton from '@/views/Main/Dashboard/Chat/LeftBar/FilterModal/FilterButton.vue'

import filterMessageSvg from '@/assets/icons/filter_message.svg'
import filterCommentSvg from '@/assets/icons/filter_comment.svg'

import type { ComponentRef } from '@/service/interface/vue'

const conversationStore = useConversationStore()
const commonStore = useCommonStore()

/**ref của modal */
const filter_modal_ref = ref<ComponentRef>()

/**xoá lọc */
function clearThisFilter() {
    delete conversationStore.option_filter_page_data.display_style

    immediatelyHide()
}
/**ẩn hiện modal */
function toggleModal() {
    filter_modal_ref.value?.toggleModal()
}
/**tắt ngay lập tức */
function immediatelyHide(){
    filter_modal_ref.value?.immediatelyHide()
}

defineExpose({ toggleModal, filter_modal_ref, clearThisFilter })
</script>