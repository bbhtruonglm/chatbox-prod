<template>
    <div class="w-full h-full bg-slate-100 md:bg-white">
        <div class="bg-white pt-[65px] md:pt-8 xl:pt-4">
            <div class="pl-14 pr-4 md:pl-4">
                <div class="relative md:w-[300px]">
                    <img width="23" height="23" class="absolute top-[6px] left-[10px]" src="@/assets/icons/search.svg">
                    <input class="w-full border-2 rounded-full py-1 pl-10 pr-2 " type="text"
                        :placeholder="$t('v1.view.main.dashboard.select_page.search_placeholder')">
                </div>
            </div>
            <div class="overflow-hidden overflow-x-auto px-4 mt-1">
                <div class="flex w-max">
                    <div @click="current_selected_tab = tab.key"
                        class="font-semibold px-4 py-1 cursor-pointer border-b-2 border-white text-slate-400 hover:border-orange-500 hover:font-semibold hover:text-black"
                        :class="{ '!text-black !border-orange-500': current_selected_tab === tab.key }"
                        v-for="tab of  LIST_TAB_SELECT">{{ tab.title }}
                    </div>
                </div>
            </div>
        </div>
        <div class="px-2 h-[calc(100%_-_229px)] md:h-[calc(100%_-_169px)]">
            <div class="flex justify-end py-2">
                <div class="flex items-center cursor-pointer">
                    <div @click="checkbox_select_all_page?.click()" class="text-sm font-semibold">{{
                        $t('v1.view.main.dashboard.select_page.select_all_page') }}</div>
                    <input ref="checkbox_select_all_page" type="checkbox" class="w-[15px] h-[15px] ml-1 accent-orange-600">
                </div>
            </div>
            <!-- click vào vùng 1 và vùng 2: thì click vào checkbox luôn -->
            <div :class="{ 'md:grid-cols-3 xl:grid-cols-4': appStore.toggle_nav }"
                class="h-[calc(100%_-_36px)] overflow-hidden overflow-y-auto grid grid-cols-1 pb-5 md:grid-cols-2 gap-2 md:gap-4 xl:grid-cols-3">
                <div v-for="i of 20" class="cursor-pointer bg-white rounded-md flex py-3 hover:shadow-lg md:bg-slate-100">
                    <div class="w-[60px] flex justify-center items-center">
                        <div class="relative">
                            <img src="@/assets/icons/crown.svg" width="15" height="15"
                                class="absolute top-[-10px] left-[50%] translate-x-[-50%]">
                            <img src="https://graph.facebook.com/100179064765476/picture?width=40&height=40" width="40"
                                height="40" class="rounded-full">
                        </div>
                    </div>
                    <div class="w-[calc(100%_-_150px)]">
                        <div class="text-base truncate">Thoi trang bot ban hang</div>
                        <div class="flex items-center">
                            <img src="@/assets/icons/facebook.svg">
                            <div class="text-sm text-slate-500 ml-1 truncate">100179064765476</div>
                        </div>
                    </div>
                    <div class="w-[90px]">
                        <div class="flex justify-end">
                            <img src="@/assets/icons/star.svg" width="15" height="15" class="mr-4 cursor-pointer" />
                            <img src="@/assets/icons/hide.svg" width="15" height="15" class="mr-4 cursor-pointer" />
                            <input type="checkbox" class="w-[15px] h-[15px] mr-2 accent-orange-600">
                        </div>
                        <div class="text-center pt-[13px]">
                            <button class="bg-slate-600 text-white text-xs px-3 rounded-full h-[28px] hover:bg-slate-400">{{
                                $t('v1.view.main.dashboard.select_page.chat_now') }}</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="h-[90px] md:h-[64px] bg-white rounded-t-[35px] md:rounded-none pt-4 px-[40px]">
            <div>
                <button
                    class="bg-orange-600 w-full rounded-full py-1 text-white flex justify-center items-center hover:bg-orange-500 mx-auto md:w-[300px]">
                    {{ $t('v1.view.main.dashboard.select_page.munti_chat_page') }}
                    <div
                        class="text-xs text-orange-600 bg-white rounded-full w-[19px] h-[19px] flex justify-center items-center ml-2">
                        2
                    </div>
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n'
import { saveLocal, getLocal } from '@/service/helper/store'
import { useAppStore } from '@/stores'

const { t: $t } = useI18n()
const appStore = useAppStore()

const LIST_TAB_SELECT = [
    {
        title: $t(`v1.view.main.dashboard.select_page.all_platform`),
        key: 'ALL_PLATFORM'
    },
    ...$env.platform.map(n => {
        return {
            title: $t(`v1.view.main.dashboard.select_page.${n}`),
            key: n.toUpperCase()
        }
    })
]

// đọc data từ local
const current_selected_tab = ref(getLocal('current_selected_tab', 'ALL_PLATFORM'))
// lưu lại data vào local để khi f5 không bị reset
saveLocal(current_selected_tab, 'current_selected_tab')

const checkbox_select_all_page = ref<HTMLInputElement>()
</script>