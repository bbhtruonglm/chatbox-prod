<template>
    <div class="h-full w-full flex relative">
        <div class="bg-white duration-500 h-screen w-[300px] absolute z-[10]" :class="GenNavClass()">
            <div class="w-full h-full relative py-14 px-4 md:py-8 md:px-2 xl:py-2">
                <div @click="toggleNav" v-if="commonStore.toggle_nav" class="absolute top-0 right-[-413px] h-screen w-screen md:hidden" />
                <button @click="toggleNav" class="absolute top-[70px] right-[-40px] md:hidden">
                    <img v-if="commonStore.toggle_nav" src="@/assets/icons/close.svg">
                    <img v-else src="@/assets/icons/toggle.svg">
                </button>
                <div class="cursor-pointer">
                    <div class="block md:hidden">
                        <img src="@/assets/icons/bbh-large.svg" />
                    </div>
                    <div class="hidden md:block">
                        <img v-if="!commonStore.toggle_nav" src="@/assets/icons/bbh-large.svg">
                        <img v-else src="@/assets/icons/bbh-mini.svg">
                    </div>
                </div>
                <hr class="my-4" />
                <div class="h-[calc(100%_-_145px)] md:h-[calc(100%_-_232px)] overflow-hidden overflow-y-auto">
                    <NavItem v-for="nav of LIST_NAV" :is_active="$route.path.indexOf(nav.path) === 0"
                        @click="selectNav(nav.path)" :icon_class="nav.icon_class" :is_only_show_icon="commonStore.toggle_nav"
                        :icon="nav.icon" :title="nav.title" />
                </div>
                <div class="absolute bottom-[40px] md:bottom-[17px] w-[calc(100%_-_32px)] md:w-[calc(100%_-_16px)]">
                    <NavItem :is_active="$route.path.indexOf('/main/dashboard/noti') === 0"
                        @click="selectNav('/main/dashboard/noti')" :is_only_show_icon="commonStore.toggle_nav" :icon="bellSvg"
                        :title="$t('v1.view.main.dashboard.nav.noti')" />
                    <UserItem :is_active="$route.path.indexOf('/main/dashboard/user') === 0"
                        @click="selectNav('/main/dashboard/user')" :is_active_user="!!chatbotUserStore.chatbot_user?.pricing_id" :is_only_show_icon="commonStore.toggle_nav"
                        :icon="`https://graph.facebook.com/${chatbotUserStore.chatbot_user?.fb_staff_id}/picture?width=50&height=50`"
                        :title="chatbotUserStore.chatbot_user?.full_name" />
                    <NavItem class="hidden md:flex" :is_only_show_icon="commonStore.toggle_nav"
                        :icon="commonStore.toggle_nav ? arrowRightSvg : arrowLeftSvg" @click="toggleNav"
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
import bellSvg from '@/assets/icons/bell.svg'
import arrowLeftSvg from '@/assets/icons/arrow-left.svg'
import arrowRightSvg from '@/assets/icons/arrow-right.svg'
import pageSvg from '@/assets/icons/page.svg'
import crownSvg from '@/assets/icons/crown.svg'
import linkSvg from '@/assets/icons/link.svg'

import NavItem from '@/components/Dashboard/NavItem.vue'
import UserItem from '@/components/Dashboard/UserItem.vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useCommonStore, useChatbotUserStore } from '@/stores'

const $router = useRouter()
const { t: $t } = useI18n()
const commonStore = useCommonStore()
const chatbotUserStore = useChatbotUserStore()

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

/**check screen size before click */
function selectNav(path: string) {
    // close nav with mobile screen
    if (window.innerWidth < 768) commonStore.toggle_nav = false

    $router.push(path)
}

/**thay đổi trạng thái của nav */
function toggleNav() {
    commonStore.toggle_nav = !commonStore.toggle_nav
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
    if (!commonStore.toggle_nav) return 'left-[-300px] md:static'

    /**
     * trạng thái kích hoạt
     * mobile: hiển thị cỡ lớn
     * tablet/pc: hiển thị cỡ nhỏ
     */
    return 'top-0 left-0 md:static md:w-[60px]'
}
</script>