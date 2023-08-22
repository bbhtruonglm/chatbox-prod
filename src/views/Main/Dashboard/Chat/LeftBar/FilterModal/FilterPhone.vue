<template>
    <ModalBottom ref="filter_modal_ref" :left="commonStore.conversation_filter_modal_left" :width="commonStore.conversation_filter_modal_width">
        <template v-slot:header>
            {{ $t('v1.view.main.dashboard.chat.filter.interact.title') }}
        </template>
        <template v-slot:body>
            <FilterRadio value="YES" v-model="conversationStore.option_filter_page_data.have_phone" :icon="includePhoneSvg"
                :title="$t('v1.view.main.dashboard.chat.filter.phone.include_phone')" />
            <FilterRadio value="NO" v-model="conversationStore.option_filter_page_data.have_phone" :icon="excludePhoneSvg"
                :title="$t('v1.view.main.dashboard.chat.filter.phone.exclude_phone')" />
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

import includePhoneSvg from '@/assets/icons/include_phone.svg'
import excludePhoneSvg from '@/assets/icons/exclude_phone.svg'

import type { ComponentRef } from '@/service/interface/vue'

const conversationStore = useConversationStore()
const commonStore = useCommonStore()

/**ref của modal */
const filter_modal_ref = ref<ComponentRef>()

/**xoá lọc này */
function clearThisFilter() {
    delete conversationStore.option_filter_page_data.have_phone

    toggleModal()
}
/**ẩn hiện modal */
function toggleModal() {
    filter_modal_ref.value?.toggleModal()
}

defineExpose({ toggleModal })
</script>