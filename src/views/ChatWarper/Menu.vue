<template>
  <div class="h-full flex-shrink-0 flex flex-col justify-between">
    <div class="flex flex-col gap-1 overflow-y-auto">
      <div class="flex justify-center">
        <button @click="$router.push('/dashboard/select-page')">
          <img
            src="@/assets/icons/bbh-mini.svg"
            class="w-9"
          />
        </button>
      </div>
      <button
        @click="attach_ref?.toggleDropdown"
        v-tooltip.right="$t('v1.view.main.dashboard.nav.menu')"
        class="rounded-lg p-2.5 group"
      >
        <SquaresPlusIcon class="w-6 h-6 m-auto group-hover:text-red-600" />
      </button>
      <hr class="border-slate-700 w-8 mx-auto" />
      <FilterItem
        :is_disable_tooltip="true"
        @mouseover="filter_interact?.filter_popover_ref?.mouseover"
        @mouseleave="filter_interact?.filter_popover_ref?.mouseleave"
        @cancel_filter="filter_interact?.clearThisFilter()"
        :is_active="!!conversationStore.option_filter_page_data.display_style"
        :icon="InboxIcon"
        :title="$t('v1.view.main.dashboard.chat.filter.interact.title')"
      />
      <FilterItem
        :is_disable_tooltip="true"
        @mouseover="filter_message?.filter_popover_ref?.mouseover"
        @mouseleave="filter_message?.filter_popover_ref?.mouseleave"
        @cancel_filter="filter_message?.clearThisFilter()"
        :is_active="isActiveMessageFilter()"
        :icon="ChatDotIcon"
        :title="$t('v1.view.main.dashboard.chat.filter.message.title')"
      />
      <FilterItem
        :is_disable_tooltip="true"
        @mouseover="filter_phone?.filter_popover_ref?.mouseover"
        @mouseleave="filter_phone?.filter_popover_ref?.mouseleave"
        @cancel_filter="filter_phone?.clearThisFilter()"
        :is_active="isActiveFilter('phone')"
        :icon="PhoneIcon"
        :title="$t('v1.view.main.dashboard.chat.filter.phone.title')"
      />
      <FilterItem
        @click="filter_date?.toggle"
        @cancel_filter="filter_date?.clearThisFilter()"
        :is_active="isActiveFilter('date')"
        :icon="DateIcon"
        :title="$t('v1.view.main.dashboard.chat.filter.time.title')"
      />
      <FilterItem
        @click="filter_tag?.toggle"
        @cancel_filter="filter_tag?.clearThisFilter()"
        :is_active="!!conversationStore.option_filter_page_data.label_id"
        :icon="TagIcon"
        :title="$t('v1.view.main.dashboard.chat.filter.label.title')"
      />
      <FilterItem
        @click="filter_not_tag?.toggle"
        @cancel_filter="filter_not_tag?.clearThisFilter()"
        :is_active="!!conversationStore.option_filter_page_data.not_label_id"
        :icon="TagNotIcon"
        :title="$t('v1.view.main.dashboard.chat.filter.exclude_label.title')"
      />
      <FilterItem
        @click="filter_staff?.toggle"
        @cancel_filter="filter_staff?.clearThisFilter()"
        :is_active="!!conversationStore.option_filter_page_data.staff_id"
        :icon="UsersIcon"
        :title="$t('v1.view.main.dashboard.chat.filter.staff.title')"
      />
      <FilterItem
        @click="filter_post?.toggle"
        @cancel_filter="filter_post?.clearThisFilter()"
        :is_active="!!conversationStore.option_filter_page_data.post_id"
        :icon="NewSpaperIcon"
        :title="$t('v1.view.main.dashboard.chat.filter.post.title')"
      />
      <FilterItem
        v-if="isFilterActive()"
        @click="clearAllFilter()"
        :icon="CloseBoldIcon"
        :title="$t('v1.view.main.dashboard.chat.filter.un_filter')"
      />
    </div>
    <User
      position="TOP"
      :back="10"
    />
  </div>
  <Attach ref="attach_ref" />
  <FilterInteract ref="filter_interact" />
  <FilterMessage ref="filter_message" />
  <FilterPhone ref="filter_phone" />
  <FilterDate ref="filter_date" />
  <FilterTag ref="filter_tag" />
  <FilterNotTag ref="filter_not_tag" />
  <FilterStaff ref="filter_staff" />
  <FilterPost ref="filter_post" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useConversationStore } from '@/stores'
import {
  isActiveMessageFilter,
  isFilterActive,
  isActiveFilter,
  resetConversationFilter,
} from '@/service/function'

import Attach from '@/views/ChatWarper/Menu/Attach.vue'
import User from '@/components/User.vue'
import FilterItem from '@/views/ChatWarper/Menu/FilterItem.vue'
import FilterInteract from '@/views/ChatWarper/Menu/FilterModal/FilterInteract.vue'
import FilterMessage from '@/views/ChatWarper/Menu/FilterModal/FilterMessage.vue'
import FilterPhone from '@/views/ChatWarper/Menu/FilterModal/FilterPhone.vue'
import FilterDate from '@/views/ChatWarper/Menu/FilterModal/FilterDate.vue'
import FilterNotTag from '@/views/ChatWarper/Menu/FilterModal/FilterNotTag.vue'
import FilterTag from '@/views/ChatWarper/Menu/FilterModal/FilterTag.vue'
import FilterStaff from '@/views/ChatWarper/Menu/FilterModal/FilterStaff.vue'
import FilterPost from '@/views/ChatWarper/Menu/FilterModal/FilterPost.vue'

import SquaresPlusIcon from '@/components/Icons/SquaresPlus.vue'
import InboxIcon from '@/components/Icons/Inbox.vue'
import ChatDotIcon from '@/components/Icons/ChatDot.vue'
import PhoneIcon from '@/components/Icons/Phone.vue'
import DateIcon from '@/components/Icons/Date.vue'
import TagIcon from '@/components/Icons/Tag.vue'
import TagNotIcon from '@/components/Icons/TagNot.vue'
import UsersIcon from '@/components/Icons/Users.vue'
import NewSpaperIcon from '@/components/Icons/NewSpaper.vue'
import CloseBoldIcon from '@/components/Icons/CloseBold.vue'

const conversationStore = useConversationStore()

/**ref của menu đính kèm */
const attach_ref = ref<InstanceType<typeof Attach>>()
/** Lọc theo tương tác */
const filter_interact = ref<InstanceType<typeof FilterInteract>>()
/** Lọc theo trạng thái tin nhắn */
const filter_message = ref<InstanceType<typeof FilterMessage>>()
/** Lọc số điện thoại */
const filter_phone = ref<InstanceType<typeof FilterPhone>>()
/** Lọc theo thời gian */
const filter_date = ref<InstanceType<typeof FilterDate>>()
/** Lọc theo nhãn */
const filter_tag = ref<InstanceType<typeof FilterTag>>()
/** Lọc theo loại trừ nhãn */
const filter_not_tag = ref<InstanceType<typeof FilterNotTag>>()
/** Lọc theo nhân viên */
const filter_staff = ref<InstanceType<typeof FilterStaff>>()
/** Lọc theo bài post */
const filter_post = ref<InstanceType<typeof FilterPost>>()

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
