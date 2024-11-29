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
      @click="openMerchant"
      :icon="OrderIcon"
      :title="$t('v1.common.order')"
    >
      <NewTabIcon class="flex-shrink-0 w-4 h-4 text-gray-500" />
    </MenuItem>
    <MenuItem
      @click="openAnalytic"
      :icon="AnalyticIcon"
      :title="$t('v1.view.main.dashboard.nav.analytic')"
    >
      <NewTabIcon class="flex-shrink-0 w-4 h-4 text-gray-500" />
    </MenuItem>
    <MenuItem
      @click="openChatbot"
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
    <!-- <template v-if="orgStore.isAdminOrg()">
      <MenuItem
        @click="openWidget"
        :icon="SquareIcon"
        :title="$t('v1.view.main.dashboard.nav.widget')"
      >
        <NewTabIcon class="flex-shrink-0 w-4 h-4 text-gray-500" />
      </MenuItem>
    </template> -->
    <!-- 
    <NavItem
      v-if="size(pageStore.selected_page_id_list)"
      :is_active="$route.path.indexOf('/dashboard/download') === 0"
      @click="preGoToChat(() => selectNav($router, '/dashboard/download'))"
      icon_class="w-[20px]"
      :icon="downloadSvg"
      :title="$t('v1.view.main.dashboard.nav.download')"
    />
    -->
  </Dropdown>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useOrgStore, usePageStore } from '@/stores'
import { keys } from 'lodash'
import { openNewTab } from '@/service/function'
import { getItem } from '@/service/helper/localStorage'
import { useRouter } from 'vue-router'
import { toastError } from '@/service/helper/alert'
import { ref } from 'vue'
import { ExternalSite } from '@/utils/helper/ExternalSite'
import { container } from 'tsyringe'

import Dropdown from '@/components/Dropdown.vue'
import MenuTitle from '@/components/Main/Dashboard/MenuTitle.vue'
import MenuItem from '@/components/Main/Dashboard/MenuItem.vue'

import widgetSvg from '@/assets/icons/widget.svg'
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

import { Domain } from '@/utils/helper/Domain'
import { Parser } from '@/utils/helper/Parser'
import { Navigation } from '@/utils/helper/Navigation'
import { LocaleSingleton } from '@/utils/helper/Locale'

const { t: $t } = useI18n()
const pageStore = usePageStore()
const $router = useRouter()
const orgStore = useOrgStore()
const locale = LocaleSingleton.getInst().get()
const $external_site = container.resolve(ExternalSite)

/**ref của menu đính kèm */
const attach_ref = ref<InstanceType<typeof Dropdown>>()

/**mở menu */
function redirectMenu(path: string) {
  // chuyển đến trang
  $router.push(`/dashboard/${path}`)
}
/**mở merchant */
function openMerchant() {
  // mở tab mới
  Navigation.openNewTab(`https://merchant.vn`)
}
/**mở thống kê */
function openAnalytic() {
  /**đường dẫn thống kê */
  const URI = Domain.isRetion()
    ? $env.host.analytic.retion
    : $env.host.analytic.bbh
  /**token */
  const TOKEN = getItem('access_token')
  /**id page đang chọn */
  const SELECTED_PAGE_ID = keys(pageStore.selected_page_id_list).join()
  /**id tổ chức đang chọn */
  const SELECTED_ORG_ID = orgStore.selected_org_id

  /**chuỗi query */
  const QS = Parser.toQueryString({
    access_token: TOKEN,
    org_id: SELECTED_ORG_ID,
    page_id: SELECTED_PAGE_ID,
    locale: locale,
  })

  // mở tab mới
  Navigation.openNewTab(`${URI}?${QS}`)
}
/**mở chatbot */
function openChatbot() {
  if (!$env.host.chatbot_view) return

  /**id page chatbot */
  let page_id =
    keys(pageStore.selected_page_id_list)?.[0] ||
    keys(pageStore.active_page_list)?.[0]

  if (!page_id) return toastError($t('v1.view.main.dashboard.nav.bot_faild'))

  // nếu đang chon nhiều page thì mở chatbot với page đầu tiên
  openNewTab(
    `${$env.host.chatbot_view}?access_token=${getItem(
      'access_token'
    )}&page_id=${page_id}&locale=${locale}`
  )
}
/**ẩn hiện menu */
function toggleDropdown($event?: MouseEvent) {
  attach_ref.value?.toggleDropdown($event)
}
/**mở thiết lập widget ở tab mới */
function openWidget() {
  window.open($router.resolve('/dashboard/widget').href, '_blank')
}

defineExpose({ toggleDropdown })
</script>
