<template>
  <button
    @click="openMenu"
    class="relative"
  >
    <Badge
      :value="2"
      class="absolute z-10 -right-2 -top-1"
    />
    <StaffAvatar
      :id="chatbotUserStore.getStaffId()"
      class="w-9 h-9 hover:brightness-90 rounded-full"
    />
  </button>
  <Dropdown
    ref="user_menu_ref"
    width="349px"
    height="auto"
    position="BOTTOM"
    :is_fit="false"
    :back="289"
    :distance="17"
  >
    <div class="dashboard-header-user-menu">
      <h6 class="title-custom">
        {{ $t('v1.view.main.dashboard.header.business') }}
      </h6>
      <MenuItem
        @click="redirectMenu('noti')"
        :icon="BriefCaseIcon"
        :title="$t('v1.view.main.dashboard.header.menu.setting_business')"
      />
      <MenuItem
        @click="redirectMenu('noti')"
        :icon="UsersIcon"
        :title="$t('v1.view.main.dashboard.header.menu.staff_manager')"
      />
      <MenuItem
        @click="redirectMenu('pricing')"
        :icon="CheckBadgeIcon"
        :title="$t('v1.view.main.dashboard.header.menu.pricing_manager')"
        :alert_value="1"
      />
      <hr class="my-1" />
      <h6 class="title-custom">
        {{ $t('v1.view.main.dashboard.header.personal') }}
      </h6>
      <MenuItem
        @click="redirectMenu('user')"
        :icon="UserIcon"
        :title="$t('v1.view.main.dashboard.header.menu.user_info')"
      />
      <MenuItem
        @click="redirectMenu('noti')"
        :icon="BellIcon"
        :title="$t('v1.view.main.dashboard.header.menu.alert')"
        :alert_value="2"
      />
      <MenuItem
        @click="openPageSetting"
        :icon="CogIcon"
        :title="$t('v1.view.main.dashboard.header.menu.setting')"
      />
      <MenuItem
        @click="signout"
        :icon="LogOutIcon"
        :title="$t('v1.view.main.dashboard.header.menu.logout')"
      />
    </div>
  </Dropdown>
</template>
<script setup lang="ts">
import { useChatbotUserStore, usePageStore } from '@/stores'
import { ref } from 'vue'
import { signout } from '@/service/helper/oauth'
import { useRouter } from 'vue-router'
import { openNewTab, getLocale } from '@/service/function'
import { getItem } from '@/service/helper/localStorage'
import { keys } from 'lodash'

import Dropdown from '@/components/Dropdown.vue'
import StaffAvatar from '@/components/Avatar/StaffAvatar.vue'
import MenuItem from '@/components/Main/Dashboard/MenuItem.vue'
import Badge from '@/views/Dashboard/Header/Badge.vue'

import BriefCaseIcon from '@/components/Icons/BriefCase.vue'
import UsersIcon from '@/components/Icons/Users.vue'
import CheckBadgeIcon from '@/components/Icons/CheckBadge.vue'
import UserIcon from '@/components/Icons/User.vue'
import BellIcon from '@/components/Icons/Bell.vue'
import CogIcon from '@/components/Icons/Cog.vue'
import LogOutIcon from '@/components/Icons/LogOut.vue'

const chatbotUserStore = useChatbotUserStore()
const pageStore = usePageStore()
const $router = useRouter()

/** Ref của menu dropdown */
const user_menu_ref = ref<InstanceType<typeof Dropdown>>()

/** Mở menu */
function openMenu($event: MouseEvent) {
  user_menu_ref.value?.toggleDropdown($event)
}
/**mở menu */
function redirectMenu(path: string) {
  // tắt menu dropdown
  user_menu_ref.value?.toggleDropdown()

  // chuyển đến trang
  $router.push(`/dashboard/${path}`)
}
/**mở cài đặt trang */
function openPageSetting() {
  openNewTab(
    `${$env.host.page_setting_view}?token=${getItem(
      'access_token'
    )}&fb_page_id=${
      keys(pageStore.selected_page_id_list)?.[0]
    }&locale=${getLocale()}`
  )
}
</script>
<style lang="scss">
.dashboard-header-user-menu {
  .title-custom {
    @apply text-xs font-medium text-slate-500 py-1 px-2;
  }
}
</style>
