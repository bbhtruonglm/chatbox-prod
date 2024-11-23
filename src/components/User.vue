<template>
  <button @click="openMenu">
    <div class="relative w-fit mx-auto">
      <Badge
        v-if="orgStore.count_noti"
        :value="orgStore.count_noti"
        class="absolute z-10 -right-2 -top-1"
      />
      <StaffAvatar
        :id="chatbotUserStore.chatbot_user?.user_id"
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
    <template v-if="orgStore.isAdminOrg() || orgStore.is_selected_all_org">
      <MenuTitle :title="$t('v1.view.main.dashboard.header.business')" />
      <MenuItem
        @click="redirectMenu('org')"
        :icon="BriefCaseIcon"
        :title="$t('v1.view.main.dashboard.header.menu.setting_business')"
      />
      <MenuItem
        @click="redirectMenu('org')"
        :icon="UsersIcon"
        :title="$t('v1.view.main.dashboard.header.menu.staff_manager')"
      />
      <MenuItem
        @click="redirectMenu('org/pay')"
        :icon="CheckBadgeIcon"
        :title="$t('v1.view.main.dashboard.header.menu.pricing_manager')"
      >
        <!-- <Badge
        :value="1"
        class="flex-shrink-0"
      /> -->
      </MenuItem>
      <MenuItem
        @click="redirectMenu('widget')"
        :icon="SquareIcon"
        :title="$t('v1.view.main.dashboard.nav.widget')"
      />
      <hr class="my-1" />
    </template>
    <MenuTitle :title="$t('v1.view.main.dashboard.header.personal')" />
    <MenuItem
      @click="openUserInfoModal()"
      :icon="UserIcon"
      :title="$t('v1.view.main.dashboard.header.menu.user_info')"
    />
    <MenuItem
      @click="openNoti"
      :icon="BellIcon"
      :title="$t('v1.view.main.dashboard.header.menu.alert')"
    >
      <Badge
        v-if="orgStore.count_noti"
        :value="orgStore.count_noti"
        class="flex-shrink-0"
      />
    </MenuItem>
    <MenuItem
      v-if="chatbotUserStore.isBbhMember()"
      @click="openBbhAdminPage()"
      :icon="ServerSettingIcon"
      :title="$t('v1.view.main.dashboard.header.menu.admin')"
    />
    <MenuItem
      @click="signout"
      :icon="LogOutIcon"
      :title="$t('v1.view.main.dashboard.header.menu.logout')"
    />
  </Dropdown>
  <Alert ref="modal_alert_ref" />
  <UserInfo ref="modal_user_info_ref" />
</template>
<script setup lang="ts">
import { useChatbotUserStore, useOrgStore } from '@/stores'
import { computed, onMounted, ref, watch } from 'vue'
import { signout } from '@/service/helper/oauth'
import { useRouter } from 'vue-router'

import Dropdown from '@/components/Dropdown.vue'
import StaffAvatar from '@/components/Avatar/StaffAvatar.vue'
import MenuItem from '@/components/Main/Dashboard/MenuItem.vue'
import Badge from '@/components/Badge.vue'
import MenuTitle from '@/components/Main/Dashboard/MenuTitle.vue'
import Alert from '@/components/User/Alert.vue'
import UserInfo from '@/components/User/UserInfo.vue'

import BriefCaseIcon from '@/components/Icons/BriefCase.vue'
import UsersIcon from '@/components/Icons/Users.vue'
import CheckBadgeIcon from '@/components/Icons/CheckBadge.vue'
import UserIcon from '@/components/Icons/User.vue'
import BellIcon from '@/components/Icons/Bell.vue'
import CogIcon from '@/components/Icons/Cog.vue'
import ServerSettingIcon from '@/components/Icons/ServerSetting.vue'
import LogOutIcon from '@/components/Icons/LogOut.vue'
import SquareIcon from '@/components/Icons/Square.vue'

import type { ModalPosition } from '@/service/interface/vue'
import { count_noti } from '@/service/api/chatbox/billing'
import { Navigation } from '@/utils/helper/Navigation'
import { getItem } from '@/service/helper/localStorage'
import { LocaleSingleton } from '@/utils/helper/Locale'

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
const orgStore = useOrgStore()
const $router = useRouter()

/** Ref của menu dropdown */
const user_menu_ref = ref<InstanceType<typeof Dropdown>>()
/** Ref của modal thông báo */
const modal_alert_ref = ref<InstanceType<typeof Alert>>()
/** Ref của modal thông tin người dùng */
const modal_user_info_ref = ref<InstanceType<typeof UserInfo>>()

// đếm số thông báo khi khởi động
onMounted(countNotiCurrentOrg)

// khi chọn lại org thì đếm lại số thông báo
watch(() => orgStore.selected_org_id, countNotiCurrentOrg)

/**đếm số noti của tổ chức đang chọn */
async function countNotiCurrentOrg() {
  try {
    // nếu chưa chọn tổ chức thì không làm gì
    if (!orgStore.selected_org_id) return

    // đếm số thông báo
    orgStore.count_noti = await count_noti(orgStore.selected_org_id)
  } catch (e) {
    // tạm thời không xử lý
  }
}
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
/**mở modal thông tin người dùng */
function openUserInfoModal() {
  // tắt menu dropdown
  user_menu_ref.value?.toggleDropdown()

  // mở modal thông tin người dùng
  modal_user_info_ref.value?.toggleModal()
}
/**mở modal của noti */
function openNoti() {
  // tắt dropdown
  user_menu_ref.value?.toggleDropdown()

  // mở modal
  modal_alert_ref.value?.toggleModal()
}
/**mở trang quản trị bbh */
function openBbhAdminPage() {
  /**token */
  const TOKEN = getItem('access_token')
  const LOCALE = LocaleSingleton.getInst().get()
  /**đường dẫn */
  const URI = $env.host.bbh_admin
  // mở tab mới
  Navigation.openNewTab(`${URI}?token=${TOKEN}&locale=${LOCALE}`)
}
</script>
