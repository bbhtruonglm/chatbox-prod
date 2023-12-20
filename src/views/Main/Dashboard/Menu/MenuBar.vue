<template>
    <NavItem v-if="size(pageStore.selected_page_id_list)" :is_active="$route.path.indexOf('/main/dashboard/chat') === 0"
        @click="goToChat" icon_class="w-[20px]" :icon="chatSvg" :title="$t('v1.view.main.dashboard.nav.chat')" />
    <NavItem v-for="nav of LIST_NAV" :is_active="$route.path.indexOf(nav.path) === 0" @click="selectNav(nav.path)"
        :icon_class="nav.icon_class" :icon="nav.icon" :title="nav.title" />
    <NavItem :icon="settingSvg" @click="openPageSetting" :title="$t('v1.view.main.dashboard.nav.page_setting')" />
    <NavItem :icon="analyticSvg" @click="openAnalytic" :title="$t('v1.view.main.dashboard.nav.analytic')" />
    <NavItem v-if="size(pageStore.selected_page_id_list)" :is_active="$route.path.indexOf('/main/dashboard/download') === 0"
        @click="preGoToChat(() => selectNav('/main/dashboard/download'))" icon_class="w-[20px]" :icon="downloadSvg"
        :title="$t('v1.view.main.dashboard.nav.download')" />
    <NavItem :icon="infoSvg" @click="openGuildLink" :title="$t('v1.view.main.dashboard.nav.info')" />
    <NavItem :is_active="$route.path.indexOf('/main/dashboard/noti') === 0" @click="selectNav('/main/dashboard/noti')"
        :icon="bellSvg" :title="$t('v1.view.main.dashboard.nav.noti')" />
    <UserItem :is_active="$route.path.indexOf('/main/dashboard/user') === 0" @click="selectNav('/main/dashboard/user')" />
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useCommonStore, usePageStore } from '@/stores'
import { computed } from 'vue'
import { keys, size } from 'lodash'
import { openNewTab, preGoToChat } from '@/service/function'
import { getItem } from '@/service/helper/localStorage'

import UserItem from '@/components/Main/Dashboard/UserItem.vue'
import NavItem from '@/components/Main/Dashboard/NavItem.vue'

import settingSvg from '@/assets/icons/setting.svg'
import analyticSvg from '@/assets/icons/analytic.svg'
import pageSvg from '@/assets/icons/page.svg'
import chatSvg from '@/assets/icons/chat.svg'
import downloadSvg from '@/assets/icons/download.svg'
import crownSvg from '@/assets/icons/crown.svg'
import widgetSvg from '@/assets/icons/widget.svg'
import linkSvg from '@/assets/icons/link.svg'
import bellSvg from '@/assets/icons/bell.svg'
import infoSvg from '@/assets/icons/info.svg'

const $props = withDefaults(defineProps<{
    /**gắn cờ luôn luôn hiện full, không ẩn */
    alway_full?: boolean
}>(), {})

const $router = useRouter()
const { t: $t } = useI18n()
const commonStore = useCommonStore()
const pageStore = usePageStore()
const locale = localStorage.getItem('locale') || ''

/**danh sách menu item */
const LIST_NAV = [
    {
        path: '/main/dashboard/select-page',
        icon: pageSvg,
        icon_class: 'w-[20px]',
        title: $t('v1.view.main.dashboard.nav.select_page')
    },
    {
        path: '/main/dashboard/select-platform',
        icon: linkSvg,
        icon_class: 'w-[20px]',
        title: $t('v1.view.main.dashboard.nav.select_platform')
    },
    {
        path: '/main/dashboard/pricing',
        icon: crownSvg,
        icon_class: 'w-[20px]',
        title: $t('v1.view.main.dashboard.nav.upgrade')
    },
    {
        path: '/main/dashboard/widget',
        icon: widgetSvg,
        icon_class: 'w-[20px]',
        title: $t('v1.view.main.dashboard.nav.widget')
    },
]

/**mở cài đặt trang */
function openPageSetting() {
    openNewTab(`${$env.host.page_setting_view}?token=${getItem('access_token')}&fb_page_id=${keys(pageStore.selected_page_id_list)?.[0]}&locale=${locale}`)
}
/**mở thống kê */
function openAnalytic() {
    openNewTab(`${$env.host.analytic_view}?token=${getItem('access_token')}&fb_page_id=${keys(pageStore.selected_page_id_list).join()}&locale=${locale}`)
}
/**nếu là màn điện thoại thì ẩn nav sau khi chọn menu */
function selectNav(path: string) {
    // check cỡ màn điện thoại
    if (window.innerWidth < 768) commonStore.dashboard_toggle_nav = false

    $router.push(path)
}
/**đi đến trang chat */
function goToChat() {
    preGoToChat(() => selectNav('/main/dashboard/chat'))
}
/**mở link doc hướng dẫn sử dụng sản phẩm */
function openGuildLink() {
    openNewTab('https://docs.google.com/document/d/1w6jkqojCVmocEM5Ur0b5GvEym3sU4d6M2kEnQWgmuMw/edit?usp=sharing')
}
</script>