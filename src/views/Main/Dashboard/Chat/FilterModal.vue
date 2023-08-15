<template>
    <ModalBottom ref="filter_modal_ref">
        <template v-slot:header>
            {{ $t('v1.view.main.dashboard.chat.filter.title') }}
        </template>
        <template v-slot:body>
            <FilterModalItem 
                @click="filter_interact?.toggleModal()" 
                :is_active="!!conversationStore.option_filter_page_data.display_style"
                :icon="filterInteractSvg"
                :title="$t('v1.view.main.dashboard.chat.filter.interact.title')" 
            />
            <FilterModalItem 
                @click="filter_message?.toggleModal()"
                :is_active="isActiveMessageFilter()" 
                :icon="filterMessageSvg" 
                :title="$t('v1.view.main.dashboard.chat.filter.message.title')" 
            />
            <FilterModalItem 
                @click="filter_phone?.toggleModal()" 
                :is_active="!!conversationStore.option_filter_page_data.have_phone"
                :icon="filterPhoneSvg"
                :title="$t('v1.view.main.dashboard.chat.filter.phone.title')" 
            />
            <FilterModalItem 
                @click="filter_date?.toggleModal()" 
                :is_active="!!conversationStore.option_filter_page_data.time_range"
                :icon="filterDateSvg"
                :title="$t('v1.view.main.dashboard.chat.filter.time.title')" 
            />
            <FilterModalItem
                @click="filter_tag?.toggleModal()"
                :is_active="!!conversationStore.option_filter_page_data.label_id"
                :icon="filterTagSvg"
                :title="$t('v1.view.main.dashboard.chat.filter.label.title')" 
            />
            <FilterModalItem
                @click="filter_not_tag?.toggleModal()"
                :is_active="!!conversationStore.option_filter_page_data.not_label_id"
                :icon="filterNotTagSvg"
                :title="$t('v1.view.main.dashboard.chat.filter.exclude_label.title')" 
            />
            <FilterModalItem
                @click="filter_staff?.toggleModal()"
                :is_active="!!conversationStore.option_filter_page_data.staff_id"
                :icon="filterStaffSvg" 
                :title="$t('v1.view.main.dashboard.chat.filter.staff.title')" 
            />
            <FilterModalItem 
                :icon="filterCommentSvg" 
                :title="$t('v1.view.main.dashboard.chat.filter.comment.title')" 
            />
        </template>
        <template 
            v-slot:footer
        >
            <div class="grid grid-cols-2 gap-4">
                <FilterButton @click="clearAllFilter" type="text-slate-500 hover:text-white hover:bg-slate-500"
                    :title="$t('v1.view.main.dashboard.chat.filter.un_filter')" 
                />
                <FilterButton @click="toggleModal"
                    type="border-orange-500 text-orange-500 hover:text-white hover:bg-orange-500"
                    :title="$t('v1.view.main.dashboard.chat.filter.title')" 
                />
            </div>
        </template>
    </ModalBottom>
    <template>
        <FilterInteract ref="filter_interact" />
        <FilterMessage ref="filter_message" />
        <FilterPhone ref="filter_phone" />
        <FilterDate ref="filter_date" />
        <FilterNotTag ref="filter_not_tag" />
        <FilterTag ref="filter_tag" />
        <FilterStaff ref="filter_staff" />
    </template>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { useConversationStore } from '@/stores'

import ModalBottom from '@/components/ModalBottom.vue'
import FilterModalItem from '@/views/Main/Dashboard/Chat/FilterModal/FilterModalItem.vue'
import FilterButton from '@/views/Main/Dashboard/Chat/FilterModal/FilterButton.vue'
import FilterInteract from '@/views/Main/Dashboard/Chat/FilterModal/FilterInteract.vue'
import FilterMessage from '@/views/Main/Dashboard/Chat/FilterModal/FilterMessage.vue'
import FilterPhone from '@/views/Main/Dashboard/Chat/FilterModal/FilterPhone.vue'
import FilterDate from '@/views/Main/Dashboard/Chat/FilterModal/FilterDate.vue'
import FilterNotTag from '@/views/Main/Dashboard/Chat/FilterModal/FilterNotTag.vue'
import FilterTag from '@/views/Main/Dashboard/Chat/FilterModal/FilterTag.vue'
import FilterStaff from '@/views/Main/Dashboard/Chat/FilterModal/FilterStaff.vue'

import filterInteractSvg from '@/assets/icons/filter_interact.svg'
import filterMessageSvg from '@/assets/icons/filter_message.svg'
import filterPhoneSvg from '@/assets/icons/filter_phone.svg'
import filterDateSvg from '@/assets/icons/filter_date.svg'
import filterTagSvg from '@/assets/icons/filter_tag.svg'
import filterNotTagSvg from '@/assets/icons/close-circle.svg'
import filterStaffSvg from '@/assets/icons/filter_staff.svg'
import filterCommentSvg from '@/assets/icons/filter_comment.svg'

import type { ComponentRef } from '@/service/interface/vue'

const conversationStore = useConversationStore()

/**ref của modal chính */
const filter_modal_ref = ref<ComponentRef>()
const filter_interact = ref<ComponentRef>()
const filter_message = ref<ComponentRef>()
const filter_phone = ref<ComponentRef>()
const filter_date = ref<ComponentRef>()
const filter_not_tag = ref<ComponentRef>()
const filter_tag = ref<ComponentRef>()
const filter_staff = ref<ComponentRef>()


/**kiểm tra xem có đang kích hoạt filter tin nhắn hay không */
function isActiveMessageFilter() {
    if (
        conversationStore.option_filter_page_data.unread_message ||
        conversationStore.option_filter_page_data.not_response_client ||
        conversationStore.option_filter_page_data.not_exist_label ||
        conversationStore.option_filter_page_data.is_spam_fb === 'YES'
    ) return true

    return false
}
/**loại bỏ toàn bộ lọc */
function clearAllFilter() {
    conversationStore.option_filter_page_data = { is_spam_fb: 'NO' }

    toggleModal()
}
/**ẩn hiện modal */
function toggleModal() {
    filter_modal_ref.value?.toggleModal()
}

defineExpose({ toggleModal })
</script>