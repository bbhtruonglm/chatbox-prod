<template>
    <div class="md:w-[300px] xl:w-[400px] h-full hidden md:block">
        <div class="h-[50px] flex items-center py-2 pl-2">
            <div 
                class="w-[calc(100%_-_50px)] h-full relative"
                :class="{ 'cursor-not-allowed':  widget_selected !== 'all' }"
            >
                <input 
                    class="focus:outline-none w-full h-full border rounded-full pl-3 pr-7" type="text"
                    :class="{
                        'pointer-events-none': widget_selected !== 'all'
                    }"
                    :placeholder="$t('v1.view.main.dashboard.chat.widget.search')"
                    v-model="widget_search_name"
                    v-on:keyup="startSearch()" 
                    v-on:keydown="loading = true" 
                />
                <img v-if="!loading" class="absolute top-[7px] right-[7px] cursor-pointer" src="@/assets/icons/search.svg" />
                <Loading v-if="loading" class="absolute top-[5px] right-[7px] cursor-pointer"/>
            </div>
            <div class="w-[50px] flex justify-center">
                <img class="cursor-pointer" src="@/assets/icons/edit.svg" />
            </div>
        </div>
        <div class="h-[calc(100%_-_50px)] overflow-hidden overflow-y-auto pb-10">
            <div class="px-2 pb-1 border-b">
                <button class="text-xs py-1 px-2 rounded-full mr-1 mb-1" @click="filterWidget()" :class="{
                    'bg-orange-500': widget_selected === 'all',
                    'text-white': widget_selected === 'all',
                    'bg-slate-100': widget_selected !== 'all',
                    'text-slate-600': widget_selected !== 'all'
                }">
                    {{ $t('v1.common.all') }}
                </button>
                <button class="text-xs py-1 px-2 rounded-full mr-1 mb-1" v-for="widget in widget_list"
                    @click="filterWidget(widget)" :class="{
                        'bg-orange-500': widget_selected === widget._id,
                        'text-white': widget_selected === widget._id,
                        'bg-slate-100': widget_selected !== widget._id,
                        'text-slate-600': widget_selected !== widget._id
                    }">
                    {{ widget.snap_app.name }}
                </button>
            </div>
            <div v-for="widget of widget_list" class="border-b" v-show="!widget.is_hidden">
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
import { nextTick, ref, watch, onMounted } from 'vue'
import { random_word } from '@/service/helper/random'
import { useConversationStore } from '@/stores'
import { debounce } from 'lodash';

import type { AppInstalledInfo } from '@/service/interface/app/widget'
import { getIframeUrl, getPageWidget } from '@/service/function';
import { nonAccentVn } from '@/service/helper/format'
import { saveLocal, getLocal } from '@/service/helper/store'
import { getItem, setItem } from '@/service/helper/localStorage';
import Loading from '@/components/Loading.vue';

const conversationStore = useConversationStore()

/**danh sách widget */
const widget_list = ref<AppInstalledInfo[]>([])
/**danh sách widget */
const snap_widget_list = ref<AppInstalledInfo[]>([])
/** Tên widget cần tìm kiếm */
const widget_search_name = ref<string>(getLocal('widget_search_name', ''))
/** Tên widget đang được chọn */
const widget_selected = ref<string>('all')
/** hiện loading */
const loading = ref<boolean>(false)

saveLocal(widget_search_name, 'widget_search_name')

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

        snap_widget_list.value = widget_list.value
        filterWidget()
        searchWidget()
    })
}
/** Tìm kiếm widget theo tên */
function searchWidget() {
    /** Ẩn loading */
    loading.value = false

    /** TH search name không tồn tại */
    if (!widget_search_name.value) {
        widget_list.value = snap_widget_list.value.map(widget => {
            widget.is_hidden = false
            return widget
        })
        return
    }

    /** search name có tồn tại */
    widget_list.value = snap_widget_list.value.map(widget => {
        widget.is_hidden = true
        let widget_name: string = nonAccentVn(widget.snap_app.name)
        let search_name: string = nonAccentVn(widget_search_name.value)
        if (widget_name.includes(search_name)) widget.is_hidden = false
        return widget
    })
}
/** Bắt đầu tìm kiếm widget theo tên sau 500ms */
const startSearch = debounce(function () { searchWidget() }, 500)
/** Lọc widget theo tên */
function filterWidget(widget_select?: AppInstalledInfo) {
    if (!widget_select) {
        widget_selected.value = 'all'
        widget_list.value = snap_widget_list.value.map(widget => {
            widget.is_hidden = false
            return widget
        })
        return
    }
    widget_search_name.value = ''
    widget_selected.value = widget_select._id
    widget_list.value = snap_widget_list.value.map(widget => {
        widget.is_hidden = true
        if (widget._id === widget_select._id) widget.is_hidden = false
        return widget
    })
}
/** Hiển thị widget đã chọn sau 2s từ khi Mounted */
function getWidgetSelected() {
    setTimeout(function () { searchWidget() }, 3000)
}

onMounted(() => {
    getWidgetSelected()
})
</script>