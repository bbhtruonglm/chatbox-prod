<template>
    <NavItem @click="menu_ref?.toggleDropdown" :is_only_show_icon="commonStore.this_toggle_nav" :icon="toggleSvg"
        :title="$t('v1.view.main.dashboard.nav.menu')" />

    <FilterBarItem @click="clickFilterItem('filter_interact')" @cancel_filter="clearThisFilter('filter_interact')"
        :is_active="!!conversationStore.option_filter_page_data.display_style" :icon="filterInteractSvg"
        :title="$t('v1.view.main.dashboard.chat.filter.interact.title')" />
    <FilterBarItem @click="clickFilterItem('filter_message')" @cancel_filter="clearThisFilter('filter_message')"
        :is_active="isActiveMessageFilter()" :icon="filterMessageSvg"
        :title="$t('v1.view.main.dashboard.chat.filter.message.title')" />
    <FilterBarItem @click="clickFilterItem('filter_phone')" @cancel_filter="clearThisFilter('filter_phone')"
        :is_active="!!conversationStore.option_filter_page_data.have_phone" :icon="filterPhoneSvg"
        :title="$t('v1.view.main.dashboard.chat.filter.interact.title')" />
    <FilterBarItem @click="clickFilterItem('filter_date')" @cancel_filter="clearThisFilter('filter_date')"
        :is_active="!!conversationStore.option_filter_page_data.time_range" :icon="filterDateSvg"
        :title="$t('v1.view.main.dashboard.chat.filter.time.title')" />
    <FilterBarItem @click="clickFilterItem('filter_tag')" @cancel_filter="clearThisFilter('filter_tag')"
        :is_active="!!conversationStore.option_filter_page_data.label_id" :icon="filterTagSvg"
        :title="$t('v1.view.main.dashboard.chat.filter.label.title')" />
    <FilterBarItem @click="clickFilterItem('filter_not_tag')" @cancel_filter="clearThisFilter('filter_not_tag')"
        :is_active="!!conversationStore.option_filter_page_data.not_label_id" :icon="filterNotTagSvg"
        :title="$t('v1.view.main.dashboard.chat.filter.exclude_label.title')" />
    <FilterBarItem @click="clickFilterItem('filter_staff')" @cancel_filter="clearThisFilter('filter_staff')"
        :is_active="!!conversationStore.option_filter_page_data.staff_id" :icon="filterStaffSvg"
        :title="$t('v1.view.main.dashboard.chat.filter.staff.title')" />
    <FilterBarItem :is_disable="true" :icon="filterCommentSvg" :title="$t('v1.common.incomming')" />
    <FilterBarItem v-if="isFilterActive()" @click="resetConversationFilter()" :icon="closeRedSvg"
        :title="$t('v1.view.main.dashboard.chat.filter.un_filter')" />
    <template>
        <Dropdown ref="menu_ref" :is_fit="false" width="220px" height="auto" position="RIGHT">
            <MenuBar :alway_full="true" />
        </Dropdown>
        <FilterInteract :ref="setFilterModalfRef('filter_interact')" />
        <FilterMessage :ref="setFilterModalfRef('filter_message')" />
        <FilterPhone :ref="setFilterModalfRef('filter_phone')" />
        <FilterDate :ref="setFilterModalfRef('filter_date')" />
        <FilterNotTag :ref="setFilterModalfRef('filter_not_tag')" />
        <FilterTag :ref="setFilterModalfRef('filter_tag')" />
        <FilterStaff :ref="setFilterModalfRef('filter_staff')" />
    </template>
</template>
<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useConversationStore, useCommonStore } from '@/stores'
import { isActiveMessageFilter, isFilterActive, resetConversationFilter } from '@/service/function'
import { map } from 'lodash'

import FilterBarItem from '@/views/Main/Dashboard/Menu/FilterBarItem.vue'
import NavItem from '@/components/Main/Dashboard/NavItem.vue'
import Dropdown from '@/components/Dropdown.vue'

import FilterInteract from '@/views/Main/Dashboard/Chat/LeftBar/FilterModal/FilterInteract.vue'
import FilterMessage from '@/views/Main/Dashboard/Chat/LeftBar/FilterModal/FilterMessage.vue'
import FilterPhone from '@/views/Main/Dashboard/Chat/LeftBar/FilterModal/FilterPhone.vue'
import FilterDate from '@/views/Main/Dashboard/Chat/LeftBar/FilterModal/FilterDate.vue'
import FilterNotTag from '@/views/Main/Dashboard/Chat/LeftBar/FilterModal/FilterNotTag.vue'
import FilterTag from '@/views/Main/Dashboard/Chat/LeftBar/FilterModal/FilterTag.vue'
import FilterStaff from '@/views/Main/Dashboard/Chat/LeftBar/FilterModal/FilterStaff.vue'
import MenuBar from '@/views/Main/Dashboard/Menu/MenuBar.vue'

import toggleSvg from '@/assets/icons/toggle.svg'
import filterInteractSvg from '@/assets/icons/filter_interact.svg'
import filterMessageSvg from '@/assets/icons/filter_message.svg'
import filterPhoneSvg from '@/assets/icons/filter_phone.svg'
import filterDateSvg from '@/assets/icons/filter_date.svg'
import filterTagSvg from '@/assets/icons/filter_tag.svg'
import filterNotTagSvg from '@/assets/icons/filter_not_tag.svg'
import filterStaffSvg from '@/assets/icons/filter_staff.svg'
import filterCommentSvg from '@/assets/icons/filter_comment.svg'
import closeRedSvg from '@/assets/icons/close-red.svg'

import type { ComponentRef } from '@/service/interface/vue'

const conversationStore = useConversationStore()
const commonStore = useCommonStore()

/**ref của các modal filter */
const filter_modal_refs = reactive<any>({})
/**ref của dropdown */
const menu_ref = ref<ComponentRef>()

/**tạo ra các ref động */
const setFilterModalfRef = (id: string) => (el: any) => {
    if (el) filter_modal_refs[id] = el
}
/**mở modal lọc */
function clickFilterItem(id: string) {
    // loop qua toàn bộ các modal
    map(filter_modal_refs, (el, el_id) => {
        // ẩn hiện modal được click
        if (el_id === id) el?.toggleModal()

        // tắt toàn bộ các modal khác đang được mở
        else if (el?.filter_modal_ref?.is_open)
            el?.filter_modal_ref?.immediatelyHide()
    })
}
/**huỷ filter này */
function clearThisFilter(id: string) {
    filter_modal_refs?.[id]?.clearThisFilter()
}
</script>