<template>
  <div class="h-full flex-shrink-0 flex flex-col justify-between">
    <div class="flex flex-col gap-1 overflow-y-auto">
      <div class="flex justify-center">
        <button @click="$router.push('/dashboard/select-page')">
          <div class="size-9 overflow-hidden group">
            <div class="size-full group-hover:hidden">
              <img
                v-if="orgStore.selected_org_info?.org_info?.org_avatar"
                :src="orgStore.selected_org_info?.org_info?.org_avatar"
                class="w-full h-full rounded-full"
              />
              <img
                v-else
                :src="commonStore.partner?.logo?.icon"
                class="w-full h-full"
              />
            </div>
            <div
              class="hidden group-hover:flex justify-center items-center size-full bg-black rounded-full"
              v-tooltip.right="$t('Quay lại Trình quản lý Trang')"
            >
              <ArrowLeftIcon class="size-5 text-white" />
            </div>
          </div>
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
      <NavItem
        id="interact"
        @dblclick="filter_interact?.filter_dropdown_ref?.toggleDropdown"
        :is_disable_tooltip="true"
        @mouseover="filter_interact?.filter_popover_ref?.mouseover"
        @mouseleave="filter_interact?.filter_popover_ref?.mouseleave"
        @click="filter_interact?.clearThisFilter()"
        :is_active="!!conversationStore.option_filter_page_data.display_style"
        :icon="InboxIcon"
        :title="$t('v1.view.main.dashboard.chat.filter.interact.title')"
      />
      <NavItem
        id="message"
        :is_disable_tooltip="true"
        @mouseover="filter_message?.filter_popover_ref?.mouseover"
        @mouseleave="filter_message?.filter_popover_ref?.mouseleave"
        @click="filter_message?.clearThisFilter()"
        :is_active="isActiveMessageFilter()"
        :icon="ChatDotIcon"
        :title="$t('v1.view.main.dashboard.chat.filter.message.title')"
      />
      <NavItem
        id="phone"
        :is_disable_tooltip="true"
        @mouseover="filter_phone?.filter_popover_ref?.mouseover"
        @mouseleave="filter_phone?.filter_popover_ref?.mouseleave"
        @click="filter_phone?.clearThisFilter()"
        :is_active="isActiveFilter('phone')"
        :icon="PhoneIcon"
        :title="$t('v1.view.main.dashboard.chat.filter.phone.title')"
      />
      <NavItem
        id="date"
        :is_disable_tooltip="true"
        @mouseover="filter_date?.filter_popover_ref?.mouseover"
        @mouseleave="filter_date?.filter_popover_ref?.mouseleave"
        @click="filter_date?.clearThisFilter()"
        :is_active="isActiveFilter('date')"
        :icon="DateIcon"
        :title="$t('v1.view.main.dashboard.chat.filter.time.title')"
      />
      <NavItem
        id="tag"
        :is_disable_tooltip="true"
        @mouseover="filter_tag?.filter_popover_ref?.mouseover"
        @mouseleave="filter_tag?.filter_popover_ref?.mouseleave"
        @click="filter_tag?.clearThisFilter()"
        :is_active="!!conversationStore.option_filter_page_data.label_id"
        :icon="TagIcon"
        :title="$t('v1.view.main.dashboard.chat.filter.label.title')"
      />
      <NavItem
        id="not_tag"
        :is_disable_tooltip="true"
        @mouseover="filter_not_tag?.filter_popover_ref?.mouseover"
        @mouseleave="filter_not_tag?.filter_popover_ref?.mouseleave"
        @click="filter_not_tag?.clearThisFilter()"
        :is_active="!!conversationStore.option_filter_page_data.not_label_id"
        :icon="TagNotIcon"
        :title="$t('v1.view.main.dashboard.chat.filter.exclude_label.title')"
      />
      <NavItem
        id="staff"
        v-if="$main.isShowStaffFilter()"
        :is_disable_tooltip="true"
        @mouseover="filter_staff?.filter_popover_ref?.mouseover"
        @mouseleave="filter_staff?.filter_popover_ref?.mouseleave"
        @click="filter_staff?.clearThisFilter()"
        :is_active="!!conversationStore.option_filter_page_data.staff_id"
        :icon="UsersIcon"
        :title="$t('v1.view.main.dashboard.chat.filter.staff.title')"
      />
      <NavItem
        id="post"
        :is_disable_tooltip="true"
        @mouseover="filter_post?.filter_popover_ref?.mouseover"
        @mouseleave="filter_post?.filter_popover_ref?.mouseleave"
        @click="filter_post?.clearThisFilter()"
        :is_active="!!conversationStore.option_filter_page_data.post_id"
        :icon="NewSpaperIcon"
        :title="$t('v1.view.main.dashboard.chat.filter.post.title')"
      />
      <NavItem
        v-if="isFilterActive()"
        @click="$main.clearAllFilter()"
        :icon="CloseBoldIcon"
        class_icon="text-red-600"
        :title="$t('v1.view.main.dashboard.chat.filter.un_filter')"
      />
    </div>
    <User
      position="TOP"
      :back="0"
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
import { ref, watch } from 'vue'
import { useCommonStore, useConversationStore, useOrgStore } from '@/stores'
import {
  isActiveMessageFilter,
  isFilterActive,
  isActiveFilter,
  resetConversationFilter,
} from '@/service/function'

import Attach from '@/views/ChatWarper/Menu/Attach.vue'
import User from '@/components/User.vue'
import NavItem from '@/views/ChatWarper/Menu/NavItem.vue'
import FilterInteract from '@/views/ChatWarper/Menu/FilterModal/FilterInteract.vue'
import FilterMessage from '@/views/ChatWarper/Menu/FilterModal/FilterMessage.vue'
import FilterPhone from '@/views/ChatWarper/Menu/FilterModal/FilterPhone.vue'
import FilterDate from '@/views/ChatWarper/Menu/FilterModal/FilterDate.vue'
import FilterNotTag from '@/views/ChatWarper/Menu/FilterModal/FilterNotTag.vue'
import FilterTag from '@/views/ChatWarper/Menu/FilterModal/FilterTag.vue'
import FilterStaff from '@/views/ChatWarper/Menu/FilterModal/FilterStaff.vue'
import FilterPost from '@/views/ChatWarper/Menu/FilterModal/FilterPost.vue'

import { ArrowLeftIcon } from '@heroicons/vue/24/solid'
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
import { Domain } from '@/utils/helper/Domain'
import {
  CalcSpecialPageConfigs,
  type ICalcSpecialPageConfigs,
} from '@/utils/helper/Conversation/CalcSpecialPageConfigs'
import { container } from 'tsyringe'

const conversationStore = useConversationStore()
const orgStore = useOrgStore()
const commonStore = useCommonStore()

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

watch(
  () => commonStore.filter_show_with_shortcut,
  newValue => {
    // nếu không có giá trị thì thôi
    if (!newValue) return

    /** sự kiện nhấn doubles click */
    const DBL_CLICK_EVENT = new MouseEvent('dblclick', {
      view: window,
      bubbles: true,
      cancelable: true,
    })

    /** Nút cần nhấn */
    const BUTTON = document.getElementById(newValue) as HTMLElement

    // trigger nhấn sự kiện nhấn doubles click
    BUTTON?.dispatchEvent(DBL_CLICK_EVENT)

    // clear data
    commonStore.filter_show_with_shortcut = ''
  }
)

class Main {
  /**
   * @param SERVICE_CALC_SPECIAL_PAGE_CONFIGS tính toán cấu hình trang đặc biệt
   */
  constructor(
    private readonly SERVICE_CALC_SPECIAL_PAGE_CONFIGS: ICalcSpecialPageConfigs = container.resolve(
      CalcSpecialPageConfigs
    )
  ) {}

  /**có hiện lọc nhân viên không */
  isShowStaffFilter() {
    /**cấu hình trang đặc biệt */
    const SPECIAL_PAGE_CONFIG = this.SERVICE_CALC_SPECIAL_PAGE_CONFIGS.exec()

    // nếu chỉ cho nv xem của mình thì không hiện lọc nhân viên
    return !SPECIAL_PAGE_CONFIG.is_only_visible_client_of_staff
  }
  /** Xóa toàn bộ lọc đã chọn */
  clearAllFilter() {
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
}
const $main = new Main()
</script>
