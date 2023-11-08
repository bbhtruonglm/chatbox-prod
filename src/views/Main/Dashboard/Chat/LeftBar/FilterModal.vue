<template>
    <ModalBottom @open_modal="countTotalConversationValid" ref="filter_modal_ref" :left="commonStore.conversation_filter_modal_left"
        :width="commonStore.conversation_filter_modal_width">
        <template v-slot:header>
            {{ $t('v1.view.main.dashboard.chat.filter.title') }}
            <span v-if="total_conversation" class="font-normal">
                ({{ total_conversation }})
            </span>
        </template>
        <template v-slot:body>
            <FilterModalItem @click="filter_interact?.toggleModal()"
                :is_active="!!conversationStore.option_filter_page_data.display_style" :icon="filterInteractSvg"
                :title="$t('v1.view.main.dashboard.chat.filter.interact.title')" />
            <FilterModalItem @click="filter_message?.toggleModal()" :is_active="isActiveMessageFilter()"
                :icon="filterMessageSvg" :title="$t('v1.view.main.dashboard.chat.filter.message.title')" />
            <FilterModalItem @click="filter_phone?.toggleModal()"
                :is_active="!!conversationStore.option_filter_page_data.have_phone" :icon="filterPhoneSvg"
                :title="$t('v1.view.main.dashboard.chat.filter.phone.title')" />
            <FilterModalItem @click="filter_date?.toggleModal()"
                :is_active="!!conversationStore.option_filter_page_data.time_range" :icon="filterDateSvg"
                :title="$t('v1.view.main.dashboard.chat.filter.time.title')" />
            <FilterModalItem @click="filter_tag?.toggleModal()"
                :is_active="!!conversationStore.option_filter_page_data.label_id" :icon="filterTagSvg"
                :title="$t('v1.view.main.dashboard.chat.filter.label.title')" />
            <FilterModalItem @click="filter_not_tag?.toggleModal()"
                :is_active="!!conversationStore.option_filter_page_data.not_label_id" :icon="filterNotTagSvg"
                :title="$t('v1.view.main.dashboard.chat.filter.exclude_label.title')" />
            <FilterModalItem @click="filter_staff?.toggleModal()"
                :is_active="!!conversationStore.option_filter_page_data.staff_id" :icon="filterStaffSvg"
                :title="$t('v1.view.main.dashboard.chat.filter.staff.title')" />
            <FilterModalItem class="opacity-40" :icon="filterCommentSvg"
                :title="$t('v1.view.main.dashboard.chat.filter.comment.title')" />
        </template>
        <template v-slot:footer>
            <div class="grid grid-cols-2 gap-4">
                <FilterButton @click="clearAllFilter" type="text-slate-500 hover:text-white hover:bg-slate-500"
                    :title="$t('v1.view.main.dashboard.chat.filter.un_filter')" />
                <FilterButton @click="toggleModal"
                    type="border-orange-500 text-orange-500 hover:text-white hover:bg-orange-500"
                    :title="$t('v1.view.main.dashboard.chat.filter.title')" />
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
import { onMounted, ref } from 'vue'
import { useConversationStore, useCommonStore, usePageStore } from '@/stores'
import { resetConversationFilter } from '@/service/function'
import { teleportModelFilterOnPcScreen } from '@/service/function'
import { count_conversation } from '@/service/api/chatbox/n4-service'

import ModalBottom from '@/components/ModalBottom.vue'
import FilterModalItem from '@/views/Main/Dashboard/Chat/LeftBar/FilterModal/FilterModalItem.vue'
import FilterButton from '@/views/Main/Dashboard/Chat/LeftBar/FilterModal/FilterButton.vue'
import FilterInteract from '@/views/Main/Dashboard/Chat/LeftBar/FilterModal/FilterInteract.vue'
import FilterMessage from '@/views/Main/Dashboard/Chat/LeftBar/FilterModal/FilterMessage.vue'
import FilterPhone from '@/views/Main/Dashboard/Chat/LeftBar/FilterModal/FilterPhone.vue'
import FilterDate from '@/views/Main/Dashboard/Chat/LeftBar/FilterModal/FilterDate.vue'
import FilterNotTag from '@/views/Main/Dashboard/Chat/LeftBar/FilterModal/FilterNotTag.vue'
import FilterTag from '@/views/Main/Dashboard/Chat/LeftBar/FilterModal/FilterTag.vue'
import FilterStaff from '@/views/Main/Dashboard/Chat/LeftBar/FilterModal/FilterStaff.vue'

import filterInteractSvg from '@/assets/icons/filter_interact.svg'
import filterMessageSvg from '@/assets/icons/filter_message.svg'
import filterPhoneSvg from '@/assets/icons/filter_phone.svg'
import filterDateSvg from '@/assets/icons/filter_date.svg'
import filterTagSvg from '@/assets/icons/filter_tag.svg'
import filterNotTagSvg from '@/assets/icons/close-circle.svg'
import filterStaffSvg from '@/assets/icons/filter_staff.svg'
import filterCommentSvg from '@/assets/icons/filter_comment.svg'

import type { ComponentRef } from '@/service/interface/vue'
import { keys } from 'lodash'
import { watch } from 'vue'

const conversationStore = useConversationStore()
const commonStore = useCommonStore()
const pageStore = usePageStore()

/**ref của modal chính */
const filter_modal_ref = ref<ComponentRef>()
const filter_interact = ref<ComponentRef>()
const filter_message = ref<ComponentRef>()
const filter_phone = ref<ComponentRef>()
const filter_date = ref<ComponentRef>()
const filter_not_tag = ref<ComponentRef>()
const filter_tag = ref<ComponentRef>()
const filter_staff = ref<ComponentRef>()

/**đếm tổng số khách hàng thoả mãn điều kiện lọc */
const total_conversation = ref<number>()

// khi thay đổi giá trị lọc tin nhắn thì load lại dữ liệu
watch(
    () => conversationStore.option_filter_page_data,
    () => countTotalConversationValid(),
    { deep: true }
)

onMounted(() => teleportModelFilterOnPcScreen())

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
    resetConversationFilter()
    toggleModal()
}
/**ẩn hiện modal */
function toggleModal() {
    filter_modal_ref.value?.toggleModal()
}
/**xử lý sự kiện khi modal mở ra */
function countTotalConversationValid() {
    count_conversation(
        {
            ...{
                page_id: keys(pageStore.selected_page_id_list),
            },
            ...conversationStore.option_filter_page_data
        },
        (e, r) => total_conversation.value = r
    )
}

defineExpose({ toggleModal })
</script>