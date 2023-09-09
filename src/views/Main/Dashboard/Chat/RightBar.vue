<template>
    <div class="md:w-[300px] xl:w-[400px] h-full hidden md:block">
        <div class="h-[50px] flex items-center py-2 pl-2">
            <div class="w-[calc(100%_-_50px)] h-full relative">
                <input class="focus:outline-none w-full h-full border rounded-full pl-3 pr-7" type="text"
                    :placeholder="$t('v1.view.main.dashboard.chat.widget.search')" />
                <img class="absolute top-[7px] right-[7px] cursor-pointer" src="@/assets/icons/search.svg" />
            </div>
            <div class="w-[50px] flex justify-center">
                <img class="cursor-pointer" src="@/assets/icons/edit.svg" />
            </div>
        </div>
        <div class="h-[calc(100%_-_50px)] overflow-hidden overflow-y-auto pb-10">
            <div class="px-2 pb-1 border-b">
                <button class="text-xs bg-orange-500 text-white py-1 px-2 rounded-full mr-1 mb-1">
                    {{ $t('v1.common.all') }}
                </button>
                <button v-for="i of 10" class="text-xs bg-slate-100 text-slate-600 py-1 px-2 rounded-full mr-1 mb-1">
                    {{ random_word() }}
                </button>
            </div>
            <div v-for="widget of widget_list" class="border-b">
                <div @click="toggleWidget(widget)"
                    class="text-xs font-bold text-slate-600 pl-2 flex items-center cursor-pointer relative hover:bg-orange-100 py-3">
                    <img :src="widget.snap_app.icon" class="mr-1" width="20" height="20" />
                    {{ widget.snap_app.name }}
                    <img v-if="!widget.is_show" class="absolute top-5 right-2" src="@/assets/icons/arrow-down.svg"
                        width="12" height="12" />
                    <img v-else class="absolute top-5 right-2" src="@/assets/icons/arrow-up.svg" width="12" height="12" />
                </div>
                <div v-show="widget.is_show" class="w-full h-[300px]">
                    <iframe class="w-full h-full" :src="widget.url" frameborder="0" />
                </div>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { nextTick, ref, watch } from 'vue'
import { random_word } from '@/service/helper/random'
import { useConversationStore } from '@/stores'

import type { AppInstalledInfo } from '@/service/interface/app/widget'
import { getIframeUrl, getPageWidget } from '@/service/function';

const conversationStore = useConversationStore()

/**danh sách widget */
const widget_list = ref<AppInstalledInfo[]>([])

watch(() => conversationStore.list_widget_token, () => getListWidget())

/**ẩn hiện widget */
function toggleWidget(widget: AppInstalledInfo) {
    widget.is_show = !widget.is_show
}
/**đọc danh sách các widget của trang này */
function getListWidget() {
    /**id trang */
    const PAGE_ID = conversationStore.select_conversation?.fb_page_id

    if (!PAGE_ID) return []

    // làm mới danh sách
    widget_list.value = []

    // render lại danh sách
    nextTick(() => {
        widget_list.value = getPageWidget(PAGE_ID)?.map(widget => {
            // hiển thị toàn bộ widget
            widget.is_show = true

            // thêm token cho url
            widget.url = getIframeUrl(widget)
    
            return widget
        }) || []
    })
}
</script>