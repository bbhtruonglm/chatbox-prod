<template>
    <ModalBottom ref="filter_modal_ref">
        <template v-slot:header>
            {{ $t('v1.view.main.dashboard.chat.filter.title') }}
        </template>
        <template v-slot:body>
            <FilterModalItem @click="filter_interact?.toggleModal()" :icon="filterInteractSvg"
                :title="$t('v1.view.main.dashboard.chat.filter.interact.title')" />
            <FilterModalItem @click="filter_message?.toggleModal()" :icon="filterMessageSvg"
                :title="$t('v1.view.main.dashboard.chat.filter.message.title')" />
            <FilterModalItem @click="filter_phone?.toggleModal()" :icon="filterPhoneSvg"
                :title="$t('v1.view.main.dashboard.chat.filter.phone.title')" />
            <FilterModalItem :icon="filterDateSvg"
                :title="$t('v1.view.main.dashboard.chat.filter.time.title')" />
            <FilterModalItem :icon="filterTagSvg"
                :title="$t('v1.view.main.dashboard.chat.filter.label.title')" />
            <FilterModalItem :icon="filterStaffSvg"
                :title="$t('v1.view.main.dashboard.chat.filter.staff.title')" />
            <FilterModalItem :icon="filterCommentSvg"
                :title="$t('v1.view.main.dashboard.chat.filter.comment.title')" />
        </template>
        <template v-slot:footer>
            <div class="grid grid-cols-2 gap-4">
                <FilterButton @click="toggleModal" type="text-slate-500 hover:text-white hover:bg-slate-500"
                    :title="$t('v1.view.main.dashboard.chat.filter.un_filter')" />
                <FilterButton @click="toggleModal" type="border-orange-500 text-orange-500 hover:text-white hover:bg-orange-500"
                    :title="$t('v1.view.main.dashboard.chat.filter.title')" />
            </div>
        </template>
    </ModalBottom>
    <template>
        <FilterInteract ref="filter_interact" />
        <FilterMessage ref="filter_message" />
        <FilterPhone ref="filter_phone" />
    </template>
</template>
<script setup lang="ts">
import { ref } from 'vue'

import ModalBottom from '@/components/ModalBottom.vue'
import FilterModalItem from '@/views/Main/Dashboard/Chat/FilterModal/FilterModalItem.vue'
import FilterButton from '@/views/Main/Dashboard/Chat/FilterModal/FilterButton.vue'
import FilterInteract from '@/views/Main/Dashboard/Chat/FilterModal/FilterInteract.vue'
import FilterMessage from '@/views/Main/Dashboard/Chat/FilterModal/FilterMessage.vue'
import FilterPhone from '@/views/Main/Dashboard/Chat/FilterModal/FilterPhone.vue'

import filterInteractSvg from '@/assets/icons/filter_interact.svg'
import filterMessageSvg from '@/assets/icons/filter_message.svg'
import filterPhoneSvg from '@/assets/icons/filter_phone.svg'
import filterDateSvg from '@/assets/icons/filter_date.svg'
import filterTagSvg from '@/assets/icons/filter_tag.svg'
import filterStaffSvg from '@/assets/icons/filter_staff.svg'
import filterCommentSvg from '@/assets/icons/filter_comment.svg'

import type { ComponentRef } from '@/service/interface/vue'

/**ref của modal chính */
const filter_modal_ref = ref<ComponentRef>()
const filter_interact = ref<ComponentRef>()
const filter_message = ref<ComponentRef>()
const filter_phone = ref<ComponentRef>()

/**ẩn hiện modal */
function toggleModal() {
    filter_modal_ref.value?.toggleModal()
}

defineExpose({ toggleModal })
</script>