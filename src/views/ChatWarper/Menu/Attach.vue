<template>
  <Dropdown
    ref="attach_ref"
    :is_fit="false"
    width="349px"
    height="auto"
    position="RIGHT"
    class_content="flex flex-col gap-1 max-h-[calc(100vh-100px)] overflow-y-auto"
  >
    <MenuTitle :title="$t('v1.view.main.dashboard.nav.chat')" />
    <MenuItem
      :icon="ChatIcon"
      :title="$t('v1.view.main.dashboard.nav.chat')"
      :is_selected="true"
    />
    <MenuItem
      @click="$router.push('/dashboard/select-page')"
      :icon="SelectPageIcon"
      :title="$t('v1.view.main.dashboard.nav.select_page')"
    />
    <hr class="my-1" />
    <MenuTitle :title="$t('v1.common.page')" />
    <MenuItem
      @click="$external_site.openMerchant('login', 'a/order')"
      :icon="OrderIcon"
      :title="$t('v1.common.order')"
    >
      <NewTabIcon class="flex-shrink-0 w-4 h-4 text-gray-500" />
    </MenuItem>
    <MenuItem
      @click="$external_site.openPageAnalytic()"
      :icon="AnalyticIcon"
      :title="$t('v1.view.main.dashboard.nav.analytic')"
    >
      <NewTabIcon class="flex-shrink-0 w-4 h-4 text-gray-500" />
    </MenuItem>
    <MenuItem
      @click="$external_site.openPageChatbot()"
      :icon="ManyChatIcon"
      :title="$t('v1.view.main.dashboard.nav.bot')"
    >
      <NewTabIcon class="flex-shrink-0 w-4 h-4 text-gray-500" />
    </MenuItem>
    <MenuItem
      v-if="orgStore.isAdminOrg()"
      @click="$external_site.openPageSetting()"
      :icon="CogIcon"
      :title="$t('v1.view.main.dashboard.nav.setting')"
    >
      <NewTabIcon class="flex-shrink-0 w-4 h-4 text-gray-500" />
    </MenuItem>
    <template v-if="orgStore.isAdminOrg()">
      <hr class="my-1" />
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
      ></MenuItem>
      <MenuItem
        @click="redirectMenu('widget')"
        :icon="SquareIcon"
        :title="$t('v1.view.main.dashboard.nav.widget')"
      />
    </template>
  </Dropdown>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useOrgStore } from '@/stores'
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import { ExternalSite } from '@/utils/helper/ExternalSite'
import { container } from 'tsyringe'

import Dropdown from '@/components/Dropdown.vue'
import MenuTitle from '@/components/Main/Dashboard/MenuTitle.vue'
import MenuItem from '@/components/Main/Dashboard/MenuItem.vue'

import ChatIcon from '@/components/Icons/Chat.vue'
import SelectPageIcon from '@/components/Icons/SelectPage.vue'
import AnalyticIcon from '@/components/Icons/Analytic.vue'
import ManyChatIcon from '@/components/Icons/ManyChat.vue'
import SquareIcon from '@/components/Icons/Square.vue'
import CogIcon from '@/components/Icons/Cog.vue'
import NewTabIcon from '@/components/Icons/NewTab.vue'
import BriefCaseIcon from '@/components/Icons/BriefCase.vue'
import UsersIcon from '@/components/Icons/Users.vue'
import CheckBadgeIcon from '@/components/Icons/CheckBadge.vue'
import OrderIcon from '@/components/Icons/Order.vue'

const { t: $t } = useI18n()
const $router = useRouter()
const orgStore = useOrgStore()
const $external_site = container.resolve(ExternalSite)

/**ref của menu đính kèm */
const attach_ref = ref<InstanceType<typeof Dropdown>>()

/**mở menu */
function redirectMenu(path: string) {
  // chuyển đến trang
  $router.push(`/dashboard/${path}`)
}
/**ẩn hiện menu */
function toggleDropdown($event?: MouseEvent) {
  attach_ref.value?.toggleDropdown($event)
}

defineExpose({ toggleDropdown })
</script>
