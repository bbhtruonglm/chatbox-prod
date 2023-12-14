<template>
    <Menu ref="dashboard_menu_ref" :init_toggle_nav="commonStore.dashboard_toggle_nav"
        @toggle_nav_change="onToggleNavChange">
        <template v-slot:menu>
            <div @click="toggleNav" class="cursor-pointer">
                <div class="block md:hidden">
                    <img src="@/assets/icons/bbh-large.svg" />
                </div>
                <div class="hidden md:block">
                    <img v-if="!commonStore.this_toggle_nav" src="@/assets/icons/bbh-large.svg">
                    <img v-else src="@/assets/icons/bbh-mini.svg">
                </div>
            </div>
            <hr class="mt-2" />
            <div class="pt-2 h-[calc(100%_-_185px)] md:h-[calc(100%_-_277px)] overflow-hidden scrollbar-vertical overflow-y-auto">
                <MenuBar v-if="isMobile() || !$route.path?.includes('/main/dashboard/chat')" />
                <FilterBar v-else />
            </div>
            <div class="absolute bottom-[40px] md:bottom-[17px] w-[calc(100%_-_32px)] md:w-[calc(100%_-_16px)]">
                <UserItem :is_active="$route.path.indexOf('/main/dashboard/user') === 0"
                    @click="selectNav('/main/dashboard/user')" :is_only_show_icon="commonStore.this_toggle_nav" />
                <NavItem class="hidden md:flex" :is_only_show_icon="commonStore.this_toggle_nav"
                    :icon="commonStore.this_toggle_nav ? arrowRightSvg : arrowLeftSvg" @click="toggleNav"
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
import { useCommonStore } from '@/stores'
import { ref } from 'vue'
import { isMobile } from '@/service/function'
import { teleportModelFilterOnPcScreen, teleportCenterModelOnPcScreen } from '@/service/function'

import arrowLeftSvg from '@/assets/icons/arrow-left.svg'
import arrowRightSvg from '@/assets/icons/arrow-right.svg'
import NavItem from '@/components/Main/Dashboard/NavItem.vue'
import UserItem from '@/components/Main/Dashboard/UserItem.vue'
import Menu from '@/components/Main/Menu.vue'
import FilterBar from '@/views/Main/Dashboard/Menu/FilterBar.vue'
import MenuBar from '@/views/Main/Dashboard/Menu/MenuBar.vue'

import type { ComponentRef } from '@/service/interface/vue'

const $router = useRouter()
const { t: $t } = useI18n()
const commonStore = useCommonStore()

/**ref của menu */
const dashboard_menu_ref = ref<ComponentRef>()

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
</script>