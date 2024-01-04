<template>
    <NavItem v-if="size(pageStore.selected_page_id_list)" :is_active="$route.path.indexOf('/chat') === 0"
        @click="goToChat" icon_class="w-[20px]" :icon="chatSvg" :title="$t('v1.view.main.dashboard.nav.chat')" />
    <NavItem v-for="nav of LIST_NAV" :is_active="$route.path.indexOf(nav.path) === 0" @click="selectNav($router, nav.path)"
        :icon_class="nav.icon_class" :icon="nav.icon" :title="nav.title" />
    <NavItem :icon="settingSvg" @click="openPageSetting" :title="$t('v1.view.main.dashboard.nav.page_setting')" />
    <NavItem :icon="analyticSvg" @click="openAnalytic" :title="$t('v1.view.main.dashboard.nav.analytic')" />
    <NavItem v-if="is_show_chatbot" :icon="botSvg" @click="openChatbot" :title="$t('v1.view.main.dashboard.nav.bot')" />
    <NavItem v-if="size(pageStore.selected_page_id_list)" :is_active="$route.path.indexOf('/main/dashboard/download') === 0"
        @click="preGoToChat(() => selectNav($router, '/main/dashboard/download'))" icon_class="w-[20px]" :icon="downloadSvg"
        :title="$t('v1.view.main.dashboard.nav.download')" />
    <NavItem :icon="infoSvg" @click="openGuildLink" :title="$t('v1.view.main.dashboard.nav.info')" />
    <NavItem :is_active="$route.path.indexOf('/main/dashboard/noti') === 0"
        @click="selectNav($router, '/main/dashboard/noti')" :icon="bellSvg"
        :title="$t('v1.view.main.dashboard.nav.noti')" />
    <UserItem :is_active="$route.path.indexOf('/main/dashboard/user') === 0"
        @click="selectNav($router, '/main/dashboard/user')" />
    <div class="text-xs mt-2 text-slate-500">{{ $t('v1.common.version') }}: {{ version }}</div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { usePageStore } from '@/stores'
import { keys, size } from 'lodash'
import { openNewTab, preGoToChat, selectNav } from '@/service/function'
import { getItem } from '@/service/helper/localStorage'
import { useRouter } from 'vue-router'

import UserItem from '@/components/Main/Dashboard/UserItem.vue'
import NavItem from '@/components/Main/Dashboard/NavItem.vue'

import settingSvg from '@/assets/icons/setting.svg'
import analyticSvg from '@/assets/icons/analytic.svg'
import botSvg from '@/assets/icons/bot.svg'
import pageSvg from '@/assets/icons/page.svg'
import chatSvg from '@/assets/icons/chat.svg'
import downloadSvg from '@/assets/icons/download.svg'
import crownSvg from '@/assets/icons/crown.svg'
import widgetSvg from '@/assets/icons/widget.svg'
import linkSvg from '@/assets/icons/link.svg'
import bellSvg from '@/assets/icons/bell.svg'
import infoSvg from '@/assets/icons/info.svg'

import { version } from "../../../../../package.json";

const $props = withDefaults(defineProps<{
    /**gắn cờ luôn luôn hiện full, không ẩn */
    alway_full?: boolean
}>(), {})

const { t: $t } = useI18n()
const pageStore = usePageStore()
const $router = useRouter()
const locale = localStorage.getItem('locale') || 'vn'

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
const is_show_chatbot = !!$env.host.chatbot_view

/**mở cài đặt trang */
function openPageSetting() {
    openNewTab(`${$env.host.page_setting_view}?token=${getItem('access_token')}&fb_page_id=${keys(pageStore.selected_page_id_list)?.[0]}&locale=${locale}`)
}
/**mở thống kê */
function openAnalytic() {
    openNewTab(`${$env.host.analytic_view}?token=${getItem('access_token')}&fb_page_id=${keys(pageStore.selected_page_id_list).join()}&locale=${locale}`)
}
/**mở chatbot */
function openChatbot() {
    if (!$env.host.chatbot_view) return

    openNewTab(`${$env.host.chatbot_view}?access_token=${getItem('access_token')}&page_id=${keys(pageStore.selected_page_id_list).join()}&locale=${locale}`)
}
/**đi đến trang chat */
function goToChat() {
    preGoToChat(() => selectNav($router, '/chat'))
}
/**mở link doc hướng dẫn sử dụng sản phẩm */
function openGuildLink() {
    openNewTab('https://docs.google.com/document/d/1w6jkqojCVmocEM5Ur0b5GvEym3sU4d6M2kEnQWgmuMw/edit?usp=sharing')
}
</script>