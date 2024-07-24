<template>
  <button @click="openMenu">
    <div class="relative w-fit mx-auto">
      <!-- <Badge
        :value="2"
        class="absolute z-10 -right-2 -top-1"
      /> -->
      <StaffAvatar
        :id="chatbotUserStore.getStaffId()"
        class="w-9 h-9 hover:brightness-90 rounded-full"
      />
    </div>
  </button>
  <Dropdown
    ref="user_menu_ref"
    width="349px"
    height="auto"
    :is_fit="false"
    :position="position"
    :back="back"
    :distance="10"
    class_content="flex flex-col gap-1"
  >
    <MenuTitle :title="$t('v1.view.main.dashboard.header.business')" />
    <MenuItem
      @click="redirectMenu('org')"
      :icon="BriefCaseIcon"
      :title="$t('v1.view.main.dashboard.header.menu.setting_business')"
    />
    <!-- <MenuItem
      @click="redirectMenu('noti')"
      :icon="UsersIcon"
      :title="$t('v1.view.main.dashboard.header.menu.staff_manager')"
    />
    <MenuItem
      @click="redirectMenu('pricing')"
      :icon="CheckBadgeIcon"
      :title="$t('v1.view.main.dashboard.header.menu.pricing_manager')"
    >
      <Badge
        :value="1"
        class="flex-shrink-0"
      />
    </MenuItem> -->
    <hr class="my-1" />
    <MenuTitle :title="$t('v1.view.main.dashboard.header.personal')" />
    <MenuItem
      @click="redirectMenu('user')"
      :icon="UserIcon"
      :title="$t('v1.view.main.dashboard.header.menu.user_info')"
    />
    <!-- <MenuItem
      @click="redirectMenu('noti')"
      :icon="BellIcon"
      :title="$t('v1.view.main.dashboard.header.menu.alert')"
    >
      <Badge
        :value="2"
        class="flex-shrink-0"
      />
    </MenuItem> -->
    <!-- <MenuItem
      @click="redirectMenu('user')"
      :icon="CogIcon"
      :title="$t('v1.view.main.dashboard.header.menu.setting')"
    /> -->
    <MenuItem
      @click="signout"
      :icon="LogOutIcon"
      :title="$t('v1.view.main.dashboard.header.menu.logout')"
    />
  </Dropdown>
</template>
<script setup lang="ts">
import { useChatbotUserStore } from '@/stores'
import { ref } from 'vue'
import { signout } from '@/service/helper/oauth'
import { useRouter } from 'vue-router'

import Dropdown from '@/components/Dropdown.vue'
import StaffAvatar from '@/components/Avatar/StaffAvatar.vue'
import MenuItem from '@/components/Main/Dashboard/MenuItem.vue'
import Badge from '@/components/Badge.vue'
import MenuTitle from '@/components/Main/Dashboard/MenuTitle.vue'

import BriefCaseIcon from '@/components/Icons/BriefCase.vue'
import UsersIcon from '@/components/Icons/Users.vue'
import CheckBadgeIcon from '@/components/Icons/CheckBadge.vue'
import UserIcon from '@/components/Icons/User.vue'
import BellIcon from '@/components/Icons/Bell.vue'
import CogIcon from '@/components/Icons/Cog.vue'
import LogOutIcon from '@/components/Icons/LogOut.vue'

import type { ModalPosition } from '@/service/interface/vue'

const $props = withDefaults(
  defineProps<{
    /**vị trí của modal */
    position: ModalPosition
    /**lùi lại bao nhiêu */
    back: number
  }>(),
  {}
)

const chatbotUserStore = useChatbotUserStore()
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
</script>
