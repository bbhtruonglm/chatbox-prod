<template>
    <ModalBottom ref="filter_modal_ref" :left="commonStore.conversation_filter_modal_left"
        :width="commonStore.conversation_filter_modal_width">
        <template v-slot:header>
            {{ $t('v1.view.main.dashboard.chat.filter.phone.title') }}
        </template>
        <template v-slot:body>
            <FilterRadio value="YES" v-model="conversationStore.option_filter_page_data.have_phone" :icon="includePhoneSvg"
                :title="$t('v1.view.main.dashboard.chat.filter.phone.include_phone')" class="border-b" />
            <FilterRadio value="NO" v-model="conversationStore.option_filter_page_data.have_phone" :icon="excludePhoneSvg"
                :title="$t('v1.view.main.dashboard.chat.filter.phone.exclude_phone')" class="border-b" />
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
    <Popover ref="filter_popover_ref" position="RIGHT" :is_fit="false" width="300px" height="auto">
        <button v-tooltip="$t('v1.view.main.dashboard.chat.filter.un_filter')"
            v-if="!!conversationStore.option_filter_page_data.have_phone" @click="clearThisFilter"
            class="absolute top-[8px] right-[14px]">
            <img src="@/assets/icons/close-red.svg">
        </button>
        <div class="border-b font-semibold pb-1">
            {{ $t('v1.view.main.dashboard.chat.filter.phone.title') }}
        </div>
        <FilterRadio value="YES" v-model="conversationStore.option_filter_page_data.have_phone" :icon="includePhoneSvg"
            :title="$t('v1.view.main.dashboard.chat.filter.phone.include_phone')" />
        <FilterRadio value="NO" v-model="conversationStore.option_filter_page_data.have_phone" :icon="excludePhoneSvg"
            :title="$t('v1.view.main.dashboard.chat.filter.phone.exclude_phone')" />
    </Popover>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { useConversationStore, useCommonStore } from '@/stores'

import ModalBottom from '@/components/ModalBottom.vue'
import Popover from '@/components/Popover.vue'
import FilterRadio from '@/views/Main/Dashboard/Chat/LeftBar/FilterModal/FilterRadio.vue'
import FilterButton from '@/views/Main/Dashboard/Chat/LeftBar/FilterModal/FilterButton.vue'

import includePhoneSvg from '@/assets/icons/include_phone.svg'
import excludePhoneSvg from '@/assets/icons/exclude_phone.svg'

import type { ComponentRef } from '@/service/interface/vue'

const conversationStore = useConversationStore()
const commonStore = useCommonStore()

/**ref của modal */
const filter_modal_ref = ref<ComponentRef>()
/**ref của popover */
const filter_popover_ref = ref<ComponentRef>()

/**xoá lọc này */
function clearThisFilter() {
    delete conversationStore.option_filter_page_data.have_phone

    immediatelyHide()
}
/**ẩn hiện modal */
function toggleModal() {
    filter_modal_ref.value?.toggleModal()
}
/**tắt ngay lập tức */
function immediatelyHide() {
    filter_modal_ref.value?.immediatelyHide()
}

defineExpose({ toggleModal, filter_modal_ref, filter_popover_ref, clearThisFilter })
</script>