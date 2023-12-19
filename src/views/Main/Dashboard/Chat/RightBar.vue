<template>
    <div class="md:w-[300px] xl:w-[400px] h-full hidden md:block">
        <div class="px-1 border-b h-[50px] flex py-2">
            <button class="text-xs py-1 px-2 rounded-full mr-1 mb-1" @click="filterWidget()" :class="{
                'bg-orange-500': widget_selected === 'all',
                'text-white': widget_selected === 'all',
                'bg-slate-100': widget_selected !== 'all',
                'text-slate-600': widget_selected !== 'all'
            }">
                {{ $t('v1.common.all') }}
            </button>
            <template v-for="widget in getWidgetRight()?.slice(0, 3)">
                <button class="text-xs py-1 px-2 rounded-full mr-1 mb-1 truncate w-[92px]" @click="filterWidget(widget)"
                    :class="{
                        'bg-orange-500': widget_selected === widget._id,
                        'text-white': widget_selected === widget._id,
                        'bg-slate-100': widget_selected !== widget._id,
                        'text-slate-600': widget_selected !== widget._id
                    }">
                    {{ widget.snap_app.name }}
                </button>
            </template>
            <button v-if="getWidgetRight()?.length > 3" @mouseover="widget_button_popover_ref?.mouseover"
                @mouseleave="widget_button_popover_ref?.mouseleave"
                class="text-xs py-1 px-2 rounded-full mr-1 mb-1 text-slate-600 bg-slate-100">
                +
                {{ getWidgetRight()?.length - 3 }}
            </button>
        </div>
        <div class="h-[calc(100%_-_100px)] overflow-hidden scrollbar-vertical overflow-y-auto pb-10">
            <template v-for="widget of widget_list" class="border-b">
                <div v-if="!isMobile() && !widget.is_hidden">
                    <div @click="toggleWidget(widget)" v-if="widget.position === 'RIGHT'"
                        class="text-xs font-bold text-slate-600 pl-2 flex items-center cursor-pointer relative hover:bg-orange-100 py-3">
                        <img :src="widget.snap_app.icon" class="mr-1" width="20" height="20" />
                        {{ widget.snap_app.name }}
                        <img v-if="!widget.is_show" class="absolute top-5 right-2" src="@/assets/icons/arrow-down.svg"
                            width="12" height="12" />
                        <img v-else class="absolute top-5 right-2" src="@/assets/icons/arrow-up.svg" width="12"
                            height="12" />
                    </div>
                    <div v-if="widget.is_show && widget.position === 'RIGHT'"
                        :class="widget.app_installed_size === 'FULL' ? 'h-[calc(100vh_-_200px)]' : 'h-[300px]'"
                        class="w-full border-b">
                        <iframe class="w-full h-full" :src="widget.url" frameborder="0" />
                    </div>
                </div>
            </template>
        </div>
        <div class="flex items-center h-[50px] justify-end">
            <div class="mr-1">
                <img src="@/assets/icons/bbh-mini.svg" class="w-[15px]" />
            </div>
            <div class="text-xs mr-1">
                {{ $t('v1.view.main.dashboard.chat.operate_by') }}
            </div>
            <div class="font-bold text-xs mr-3">
                Bot Ban Hang
            </div>
        </div>
    </div>
    <template>
        <Popover ref="widget_button_popover_ref" position="BOTTOM" :reverse="true" :is_fit="false" width="auto"
            height="auto">
            <div class="flex flex-wrap max-w-[295px] max-h-[200px] overflow-hidden scrollbar-vertical overflow-y-auto">
                <template v-for="widget in getWidgetRight()?.slice(3)">
                    <button class="text-xs py-1 px-2 rounded-full mr-1 mb-1 truncate w-[92px]" @click="filterWidget(widget)"
                        :class="{
                            'bg-orange-500': widget_selected === widget._id,
                            'text-white': widget_selected === widget._id,
                            'bg-slate-100': widget_selected !== widget._id,
                            'text-slate-600': widget_selected !== widget._id
                        }">
                        {{ widget.snap_app.name }}
                    </button>
                </template>
            </div>
        </Popover>
    </template>
</template>
<script setup lang="ts">
import { nextTick, ref, watch, onMounted } from 'vue'
import { useConversationStore } from '@/stores'
import { getIframeUrl, getPageWidget } from '@/service/function'
import { nonAccentVn } from '@/service/helper/format'
import { saveLocal, getLocal } from '@/service/helper/store'
import { isMobile } from '@/service/function'

import Popover from '@/components/Popover.vue'

import type { AppInstalledInfo } from '@/service/interface/app/widget'
import type { ComponentRef } from '@/service/interface/vue'

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
/** */
const widget_button_popover_ref = ref<ComponentRef>()

saveLocal(widget_search_name, 'widget_search_name')

watch(() => conversationStore.list_widget_token, () => getListWidget())

/**lọc ra các widget bên phải */
function getWidgetRight() {
    return widget_list.value?.filter(widget => widget.position === 'RIGHT')
}
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
        widget_list.value = getPageWidget(PAGE_ID)
            ?.filter(widget => widget.active_widget)
            ?.map(widget => {
                // nếu dạng nhỏ nhất thì auto ẩn luôn
                if (widget.app_installed_size === 'MINIMUM') widget.is_show = false
                // hiển thị toàn bộ widget
                else widget.is_show = true

                // thêm token cho url
                widget.url = getIframeUrl(widget)

                return widget
            })
            ?.sort((a, b) => {
                // sort theo index từ 0 -> n
                if (a.index_position > b.index_position) return 1

                else return -1
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