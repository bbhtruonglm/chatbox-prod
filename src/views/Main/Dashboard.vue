<template>
    <Menu ref="dashboard_menu_ref" :init_toggle_nav="commonStore.dashboard_toggle_nav"
        @toggle_nav_change="onToggleNavChange">
        <template v-slot:menu>
            <div class="flex justify-center">
                <div class="block md:hidden">
                    <img src="@/assets/icons/bbh-large.svg" />
                </div>
                <div class="hidden md:block">
                    <img v-if="!isChat()" src="@/assets/icons/bbh-large.svg" class="h-[37px]" />
                    <img v-else src="@/assets/icons/bbh-mini.svg" class="h-[37px]" />
                </div>
            </div>
            <hr class="mt-2" />
            <div
                class="pt-2 md:h-[calc(100%_-_85px)] xl:h-[calc(100%_-_110px)] overflow-hidden scrollbar-vertical overflow-y-auto">
                <MenuBar v-if="!$route.path?.includes('/chat')" />
                <FilterBar v-else />
            </div>
            <div class="absolute bottom-[40px] md:bottom-[17px] w-[calc(100%_-_32px)] md:w-[calc(100%_-_16px)]">
                <NavItem v-if="isChat()" class="hidden md:flex" :icon="settingSvg" :is_only_show_icon="true"
                    @click="selectNav($router, '/main/dashboard/user')" :title="$t('v1.view.main.dashboard.nav.setting_user')" />
            </div>
        </template>
        <template v-slot:content>
            <slot>
                <RouterView />
            </slot>
        </template>
    </Menu>
</template>

<script setup lang="ts">
import { useCommonStore } from '@/stores'
import { ref } from 'vue'
import { isChat } from '@/service/function'
import { selectNav } from '@/service/function'

import FilterBar from '@/views/Main/Dashboard/Menu/FilterBar.vue'
import MenuBar from '@/views/Main/Dashboard/Menu/MenuBar.vue'
import Menu from '@/components/Main/Menu.vue'
import settingSvg from '@/assets/icons/setting.svg'
import NavItem from '@/components/Main/Dashboard/NavItem.vue'

import type { ComponentRef } from '@/service/interface/vue'

const commonStore = useCommonStore()

/**ref của menu */
const dashboard_menu_ref = ref<ComponentRef>()

/**thay đổi trạng thái của nav */
function onToggleNavChange(value: boolean) {
    commonStore.dashboard_toggle_nav = value
}
</script>