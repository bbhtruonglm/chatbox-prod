<template>
    <div class="w-full h-full bg-slate-100">
        <div class="bg-white pt-[65px]">
            <div class="pl-14 pr-4">
                <div class="relative">
                    <img width="23" height="23" class="absolute top-[6px] left-[10px]" src="@/assets/icons/search.svg">
                    <input class="w-full border-2 rounded-full py-1 pl-10 pr-2 " type="text"
                        :placeholder="$t('v1.view.main.dashboard.select_page.search_placeholder')">
                </div>
            </div>
            <div class="overflow-hidden overflow-x-auto flex px-4 mt-1 shadow-lg">
                <div @click="current_selected_tab = tab.key"
                    class="px-4 py-1 cursor-pointer border-b-2 border-white text-slate-600 hover:border-orange-500 hover:font-semibold hover:text-black"
                    :class="{ 'font-semibold text-black !border-orange-500': current_selected_tab === tab.key }"
                    v-for="tab of  LIST_TAB_SELECT ">{{ tab.title }}
                </div>
            </div>
        </div>
        <div class="px-2 h-[calc(100%_-_229px)]">
            <div class="flex justify-end py-2">
                <div class="flex items-center cursor-pointer">
                    <div @click="checkbox_select_all_page?.click()" class="text-sm font-semibold">{{
                        $t('v1.view.main.dashboard.select_page.select_all_page') }}</div>
                    <input ref="checkbox_select_all_page" type="checkbox" class="w-[15px] h-[15px] ml-1">
                </div>
            </div>
            <div class="h-[calc(100%_-_36px)] overflow-hidden overflow-y-auto">
                <div v-for="i of 20" class="bg-white px-2 mb-1 rounded-md h-[50px]">
                    page data
                </div>
            </div>
        </div>
        <div class="h-[90px] bg-white shadow-lg rounded-[35px] pt-4 px-[40px]">
            <div>
                <button class="bg-orange-600 w-full rounded-full py-1 text-white flex justify-center items-center">
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

const { t: $t } = useI18n()

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