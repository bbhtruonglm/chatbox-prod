<template>
    <div class="h-full w-full flex relative">
        <div class="bg-white duration-500 h-screen w-[300px] absolute shadow-xl z-[10]" :class="GenNavClass()">
            <div class="w-full h-full relative py-14 px-4 md:py-2 md:px-2">
                <button @click="toggleNav" class="absolute top-[70px] right-[-40px] md:hidden">
                    <img v-if="toggle_nav" src="@/assets/icons/close.svg">
                    <img v-else src="@/assets/icons/toggle.svg">
                </button>
                <div class="cursor-pointer">
                    <div class="block md:hidden">
                        <img src="@/assets/icons/bbh-large.svg" />
                    </div>
                    <div class="hidden md:block">
                        <img v-if="!toggle_nav" src="@/assets/icons/bbh-large.svg">
                        <img v-else src="@/assets/icons/bbh-mini.svg">
                    </div>
                </div>
                <hr class="my-4" />
                <div class="h-[calc(100%_-_145px)] md:h-[calc(100%_-_232px)] overflow-hidden overflow-y-auto">
                    <NavItem v-for="nav of LIST_NAV" :is_active="$route.path.indexOf(nav.path) === 0"
                        @click="selectNav(nav.path)" :icon_class="nav.icon_class" :is_only_show_icon="toggle_nav"
                        :icon="nav.icon" :title="nav.title" />
                </div>
                <div class="absolute bottom-[40px] md:bottom-[17px] w-[calc(100%_-_32px)] md:w-[calc(100%_-_16px)]">
                    <NavItem :is_active="$route.path.indexOf('/main/dashboard/noti') === 0"
                        @click="selectNav('/main/dashboard/noti')" :is_only_show_icon="toggle_nav" :icon="bellSvg"
                        :title="$t('v1.view.main.dashboard.nav.noti')" />
                    <UserItem :is_active="$route.path.indexOf('/main/dashboard/user') === 0"
                        @click="selectNav('/main/dashboard/user')" :is_active_user="true" :is_only_show_icon="toggle_nav"
                        :icon="`https://graph.facebook.com/${appStore.chatbot_user?.fb_staff_id}/picture`"
                        :title="appStore.chatbot_user?.full_name" />
                    <NavItem class="hidden md:flex" :is_only_show_icon="toggle_nav"
                        :icon="toggle_nav ? arrowRightSvg : arrowLeftSvg" @click="toggleNav"
                        :title="$t('v1.view.main.dashboard.nav.toggle')" />
                </div>
            </div>
        </div>
        <div class="duration-500 w-full">
            <RouterView />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

import bellSvg from '@/assets/icons/bell.svg'
import arrowLeftSvg from '@/assets/icons/arrow-left.svg'
import arrowRightSvg from '@/assets/icons/arrow-right.svg'
import pageSvg from '@/assets/icons/page.svg'
import crownSvg from '@/assets/icons/crown.svg'
import linkSvg from '@/assets/icons/link.svg'

import NavItem from '@/components/Dashboard/NavItem.vue'
import UserItem from '@/components/Dashboard/UserItem.vue'
import { useRouter } from 'vue-router'
import { saveLocal, getLocal } from '@/service/helper/store'
import { useI18n } from 'vue-i18n'
import { useAppStore } from '@/stores'

const $router = useRouter()
const { t: $t } = useI18n()
const appStore = useAppStore()

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
]

/**
 * load toggle từ local
 * 
 * - tablet/pc
 * false: hiển thị full nav
 * true: hiển thị nav nhỏ
 * 
 * - mobile
 * false: không hiển thị nav
 * true: hiển thị full nav
 */
const toggle_nav = ref(getLocal('dashboard_toggle_nav', false))
/** lưu toggle xuống local, để khi f5 trang không bị mất */
saveLocal(toggle_nav, 'dashboard_toggle_nav')

/**check screen size before click */
function selectNav(path: string) {
    // close nav with mobile screen
    if (window.innerWidth < 768) toggle_nav.value = false

    $router.push(path)
}

/**thay đổi trạng thái của nav */
function toggleNav() {
    toggle_nav.value = !toggle_nav.value
}
/**
 * css lại nav khi ẩn / hiên
 * mobile: ẩn nav - hiện nav cỡ lớn
 * tablet/pc: hiện nav cỡ lớn - hiện nav cỡ nhỏ
 */
function GenNavClass() {
    /**
     * trạng thái bình thường
     * mobile: ẩn nav
     * tablet/pc: hiển thị cỡ lớn
     */
    if (!toggle_nav.value) return 'left-[-300px] md:static'

    /**
     * trạng thái kích hoạt
     * mobile: hiển thị cỡ lớn
     * tablet/pc: hiển thị cỡ nhỏ
     */
    return 'top-0 left-0 md:static md:w-[60px]'
}
</script>