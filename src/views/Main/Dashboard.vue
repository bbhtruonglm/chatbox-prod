<template>
    <Menu ref="dashboard_menu_ref" :init_toggle_nav="commonStore.dashboard_toggle_nav"
        @toggle_nav_change="onToggleNavChange">
        <template v-slot:menu>
            <div @click="toggleNav" class="cursor-pointer">
                <div class="block md:hidden">
                    <img src="@/assets/icons/bbh-large.svg" />
                </div>
                <div class="hidden md:block">
                    <img v-if="!toggle_nav" src="@/assets/icons/bbh-large.svg">
                    <img v-else src="@/assets/icons/bbh-mini.svg">
                </div>
            </div>
            <hr class="my-4" />
            <div class="h-[calc(100%_-_185px)] md:h-[calc(100%_-_256px)] overflow-hidden overflow-y-auto">
                <NavItem v-if="size(pageStore.selected_page_id_list)"
                    :is_active="$route.path.indexOf('/main/dashboard/chat') === 0" @click="goToChat" icon_class="w-[20px]"
                    :is_only_show_icon="toggle_nav" :icon="chatSvg" :title="$t('v1.view.main.dashboard.nav.chat')" />
                <NavItem v-for="nav of LIST_NAV" :is_active="$route.path.indexOf(nav.path) === 0"
                    @click="selectNav(nav.path)" :icon_class="nav.icon_class" :is_only_show_icon="toggle_nav"
                    :icon="nav.icon" :title="nav.title" />
            </div>
            <div class="absolute bottom-[40px] md:bottom-[17px] w-[calc(100%_-_32px)] md:w-[calc(100%_-_16px)]">
                <NavItem :is_only_show_icon="toggle_nav" :icon="infoSvg" @click="openGuildLink"
                    :title="$t('v1.view.main.dashboard.nav.info')" />
                <NavItem :is_active="$route.path.indexOf('/main/dashboard/noti') === 0"
                    @click="selectNav('/main/dashboard/noti')" :is_only_show_icon="toggle_nav" :icon="bellSvg"
                    :title="$t('v1.view.main.dashboard.nav.noti')" />
                <UserItem :is_active="$route.path.indexOf('/main/dashboard/user') === 0"
                    @click="selectNav('/main/dashboard/user')" :is_only_show_icon="toggle_nav" />
                <NavItem class="hidden md:flex" :is_only_show_icon="toggle_nav"
                    :icon="toggle_nav ? arrowRightSvg : arrowLeftSvg" @click="toggleNav"
                    :title="$t('v1.view.main.dashboard.nav.toggle')" />
            </div>
        </template>
        <template v-slot:content>
            <RouterView />
        </template>
    </Menu>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useCommonStore, usePageStore } from '@/stores'
import { computed, ref } from 'vue'
import { size } from 'lodash'
import { openNewTab, preGoToChat } from '@/service/function'
import { teleportModelFilterOnPcScreen, teleportCenterModelOnPcScreen } from '@/service/function'

import bellSvg from '@/assets/icons/bell.svg'
import arrowLeftSvg from '@/assets/icons/arrow-left.svg'
import arrowRightSvg from '@/assets/icons/arrow-right.svg'
import infoSvg from '@/assets/icons/info.svg'
import pageSvg from '@/assets/icons/page.svg'
import chatSvg from '@/assets/icons/chat.svg'
import crownSvg from '@/assets/icons/crown.svg'
import widgetSvg from '@/assets/icons/widget.svg'
import linkSvg from '@/assets/icons/link.svg'
import NavItem from '@/components/Main/Dashboard/NavItem.vue'
import UserItem from '@/components/Main/Dashboard/UserItem.vue'
import Menu from '@/components/Main/Menu.vue'

import type { ComponentRef } from '@/service/interface/vue'

const $router = useRouter()
const { t: $t } = useI18n()
const commonStore = useCommonStore()
const pageStore = usePageStore()

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
/**ref của menu */
const dashboard_menu_ref = ref<ComponentRef>()

/**lắng nghe giá trị ẩn hiện nav từ component */
const toggle_nav = computed(() => dashboard_menu_ref.value?.this_toggle_nav)

/**mở link doc hướng dẫn sử dụng sản phẩm */
function openGuildLink() {
    openNewTab('https://docs.google.com/document/d/1w6jkqojCVmocEM5Ur0b5GvEym3sU4d6M2kEnQWgmuMw/edit?usp=sharing')
}
/**nếu là màn điện thoại thì ẩn nav sau khi chọn menu */
function selectNav(path: string) {
    // check cỡ màn điện thoại
    if (window.innerWidth < 768) commonStore.dashboard_toggle_nav = false

    $router.push(path)
}
/**thay đổi trạng thái của nav */
function onToggleNavChange(value: boolean) {
    commonStore.dashboard_toggle_nav = value

    teleportModelFilterOnPcScreen()
    teleportCenterModelOnPcScreen()
}
/**ẩn hiện nav */
function toggleNav() {
    dashboard_menu_ref.value?.toggleNav()
}
/**đi đến trang chat */
function goToChat() {
    preGoToChat(() => selectNav('/main/dashboard/chat'))
}
</script>