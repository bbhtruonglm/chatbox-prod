<template>
    <Menu ref="chat_menu_ref" :init_toggle_nav="commonStore.chat_toggle_nav" @toggle_nav_change="onToggleNavChange">
        <template v-slot:menu>
            <div class="absolute bottom-[40px] md:bottom-[17px] w-[calc(100%_-_32px)] md:w-[calc(100%_-_16px)]">
                <UserItem @click="" :is_only_show_icon="toggle_nav" />
            </div>
        </template>
        <template v-slot:content>
            <div class="w-full h-full bg-slate-100 md:bg-white">
                <div class="bg-white pt-[65px] md:pt-8 xl:pt-4">
                    <div class="pl-14 pr-4 md:pl-4 flex items-center">
                        <div class="cursor-pointer">
                            <img src="@/assets/icons/filter.svg" width="23" height="23">
                        </div>
                        <div class="flex items-center ml-4 w-full justify-between">
                            <span class="font-medium text-2xl">
                                {{ $t('v1.common.chatbox') }}
                            </span>
                            <img class="cursor-pointer" src="@/assets/icons/search.svg" width="28" height="28">
                        </div>
                    </div>
                    <VirtualList class="overflow-hidden overflow-x-auto mt-2" wrap-class="inline-flex"
                        :data-key="'data_key'" :data-sources="items" :data-component="UserOnlineItem"
                        direction="horizontal" />
                    <VirtualList class="h-[calc(100vh_-_184px)] overflow-hidden overflow-y-auto  pb-[40px]"
                        :data-key="'data_key'" :data-sources="items" :data-component="ConversationItem" />
                </div>
            </div>
        </template>
    </Menu>
</template>

<script setup lang="ts">
import { useCommonStore } from '@/stores'
import { computed, ref } from 'vue'
import { copy } from '@/service/helper/format'
import { getLocal, saveLocal } from '@/service/helper/store'

import Menu from '@/components/Main/Menu.vue'
import Search from '@/components/Main/Dashboard/Search.vue'
import PlatformTab from '@/components/Main/Dashboard/PlatformTab.vue'
import VirtualList from 'vue3-virtual-scroll-list'
import ConversationItem from '@/views/Main/Dashboard/Chat/ConversationItem.vue'
import UserOnlineItem from '@/views/Main/Dashboard/Chat/UserOnlineItem.vue'
import NavItem from '@/components/Main/Dashboard/NavItem.vue'
import UserItem from '@/components/Main/Dashboard/UserItem.vue'

import type { TabPlatform } from '@/service/interface/app/page'
import type { ComponentPublicInstance } from 'vue'

const commonStore = useCommonStore()

let count = 0
const items = ref(Array(100).fill({ data_key: count++, text: 'abc' }))

/**ref của menu */
const chat_menu_ref = ref<ComponentPublicInstance<any>>()
/**lắng nghe giá trị ẩn hiện nav từ component */
const toggle_nav = computed(() => chat_menu_ref.value?.this_toggle_nav)
/**danh sách các tab gốc */
const ROOT_TAB = {
    ALL_PLATFORM: {
        title: 'alo',
        count: 0
    },
    ALL_PLATFORM1: {
        title: 'heey',
        count: 0
    },
    ALL_PLATFORM2: {
        title: 'xxxx',
        count: 0
    },
}
/**danh sách các tab */
const list_tab_select = ref<TabPlatform>(copy(ROOT_TAB))
const current_selected_tab = ref(getLocal('chat_current_selected_tab', 'ALL_PLATFORM'))
// lưu lại data vào local để khi f5 không bị reset
saveLocal(current_selected_tab, 'chat_current_selected_tab')

/**thay đổi trạng thái của nav */
function onToggleNavChange(value: boolean) {
    commonStore.chat_toggle_nav = value
}
</script>