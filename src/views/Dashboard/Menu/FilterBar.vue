<template>
    <NavItem @click="menu_ref?.toggleDropdown" :is_only_show_icon="isChat()" :icon="toggleSvg"
        :title="$t('v1.view.main.dashboard.nav.menu')" />

    <FilterBarItem :is_disable_tooltip="true" @mouseover="filter_interact?.filter_popover_ref?.mouseover"
        @mouseleave="filter_interact?.filter_popover_ref?.mouseleave" @cancel_filter="filter_interact?.clearThisFilter()"
        :is_active="!!conversationStore.option_filter_page_data.display_style" :icon="filterInteractSvg"
        :title="$t('v1.view.main.dashboard.chat.filter.interact.title')" />
    <FilterBarItem :is_disable_tooltip="true" @mouseover="filter_message?.filter_popover_ref?.mouseover"
        @mouseleave="filter_message?.filter_popover_ref?.mouseleave" @cancel_filter="filter_message?.clearThisFilter()"
        :is_active="isActiveMessageFilter()" :icon="filterMessageSvg"
        :title="$t('v1.view.main.dashboard.chat.filter.message.title')" />
    <FilterBarItem :is_disable_tooltip="true" @mouseover="filter_phone?.filter_popover_ref?.mouseover"
        @mouseleave="filter_phone?.filter_popover_ref?.mouseleave" @cancel_filter="filter_phone?.clearThisFilter()"
        :is_active="isActiveFilter('phone')" :icon="filterPhoneSvg"
        :title="$t('v1.view.main.dashboard.chat.filter.phone.title')" />
    <FilterBarItem @click="filter_date?.toggle" @cancel_filter="filter_date?.clearThisFilter()"
        :is_active="isActiveFilter('date')" :icon="filterDateSvg"
        :title="$t('v1.view.main.dashboard.chat.filter.time.title')" />
    <FilterBarItem @click="filter_tag?.toggle" @cancel_filter="filter_tag?.clearThisFilter()"
        :is_active="!!conversationStore.option_filter_page_data.label_id" :icon="filterTagSvg"
        :title="$t('v1.view.main.dashboard.chat.filter.label.title')" />
    <FilterBarItem @click="filter_not_tag?.toggle" @cancel_filter="filter_not_tag?.clearThisFilter()"
        :is_active="!!conversationStore.option_filter_page_data.not_label_id" :icon="filterNotTagSvg"
        :title="$t('v1.view.main.dashboard.chat.filter.exclude_label.title')" />
    <FilterBarItem @click="filter_staff?.toggle" @cancel_filter="filter_staff?.clearThisFilter()"
        :is_active="!!conversationStore.option_filter_page_data.staff_id" :icon="filterStaffSvg"
        :title="$t('v1.view.main.dashboard.chat.filter.staff.title')" />
    <FilterBarItem @click="filter_post?.toggle" @cancel_filter="filter_post?.clearThisFilter()"
        :is_active="!!conversationStore.option_filter_page_data.post_id" :icon="filterCommentSvg"
        :title="$t('v1.view.main.dashboard.chat.filter.post.title')" />
    <FilterBarItem v-if="isFilterActive()" @click="clearAllFilter()" :icon="closeRedSvg"
        :title="$t('v1.view.main.dashboard.chat.filter.un_filter')" />
    <template>
        <Dropdown ref="menu_ref" :is_fit="false" width="220px" height="auto" position="RIGHT">
            <MenuBar :alway_full="true" />
        </Dropdown>
        <FilterInteract ref="filter_interact" />
        <FilterMessage ref="filter_message" />
        <FilterPhone ref="filter_phone" />
        <FilterDate ref="filter_date" />
        <FilterTag ref="filter_tag" />
        <FilterNotTag ref="filter_not_tag" />
        <FilterStaff ref="filter_staff" />
        <FilterPost ref="filter_post" />
    </template>
</template>
<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useConversationStore, useCommonStore } from '@/stores'
import { 
    isActiveMessageFilter, 
    isChat, isFilterActive,
    resetConversationFilter, 
    isActiveFilter 
} from '@/service/function'

import FilterBarItem from '@/views/Dashboard/Menu/FilterBarItem.vue'
import NavItem from '@/components/Main/Dashboard/NavItem.vue'
import Dropdown from '@/components/Dropdown.vue'

import FilterInteract from '@/views/Dashboard/Chat/LeftBar/FilterModal/FilterInteract.vue'
import FilterMessage from '@/views/Dashboard/Chat/LeftBar/FilterModal/FilterMessage.vue'
import FilterPhone from '@/views/Dashboard/Chat/LeftBar/FilterModal/FilterPhone.vue'
import FilterDate from '@/views/Dashboard/Chat/LeftBar/FilterModal/FilterDate.vue'
import FilterNotTag from '@/views/Dashboard/Chat/LeftBar/FilterModal/FilterNotTag.vue'
import FilterTag from '@/views/Dashboard/Chat/LeftBar/FilterModal/FilterTag.vue'
import FilterStaff from '@/views/Dashboard/Chat/LeftBar/FilterModal/FilterStaff.vue'
import FilterPost from '../Chat/LeftBar/FilterModal/FilterPost.vue'
import MenuBar from '@/views/Dashboard/Menu/MenuBar.vue'

import toggleSvg from '@/assets/icons/menu-chat.svg'
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

/**ref của dropdown */
const menu_ref = ref<ComponentRef>()
/** Lọc theo tương tác */
const filter_interact = ref<ComponentRef>()
/** Lọc theo trạng thái tin nhắn */
const filter_message = ref<ComponentRef>()
/** Lọc số điện thoại */
const filter_phone = ref<ComponentRef>()
/** Lọc theo thời gian */
const filter_date = ref<ComponentRef>()
/** Lọc theo nhãn */
const filter_tag = ref<ComponentRef>()
/** Lọc theo loại trừ nhãn */
const filter_not_tag = ref<ComponentRef>()
/** Lọc theo nhân viên */
const filter_staff = ref<ComponentRef>()
/** Lọc theo bài post */
const filter_post = ref<ComponentRef>()

/** Xóa toàn bộ lọc đã chọn */
function clearAllFilter() {
    filter_interact.value?.clearThisFilter()
    filter_message.value?.clearThisFilter()
    filter_phone.value?.clearThisFilter()
    filter_date.value?.clearThisFilter()
    filter_tag.value?.clearThisFilter()
    filter_not_tag.value?.clearThisFilter()
    filter_staff.value?.clearThisFilter()
    filter_post.value?.clearThisFilter()
    resetConversationFilter()
}
</script>