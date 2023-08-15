<template>
    <ModalBottom ref="filter_modal_ref">
        <template v-slot:header>
            {{ $t('v1.view.main.dashboard.chat.filter.exclude_label.title') }}
        </template>
        <template v-slot:body>
            <div class="py-3">
                <input 
                    type="text" :placeholder="$t('v1.view.main.dashboard.chat.filter.label.find_tag')"
                    class="border px-3 py-1 w-full rounded-lg focus:outline-none"
                    v-on:keyup="searchLabel()"
                    v-model="label_search_name"
                >
            </div>
            <div class="h-[40vh] overflow-y-auto">
                <div 
                    class="flex justify-between py-2 border-b items-center cursor-pointer hover:bg-slate-100"
                    v-for="item, index in labels"
                    @click="selectLabel(index as string)"
                >
                    <div class="flex items-center">
                        <div 
                            class="w-5 h-5 rounded-full mr-3" 
                            :style="{ 'background' : item.bg_color }"
                        >
                        </div>
                        <span>{{ item.title }}</span>
                        <span
                            v-if="Object.keys(pageStore.selected_page_id_list).length > 1"
                            class="ml-3 text-xs text-slate-400"
                        >
                            {{ pageStore.active_page_list[item.fb_page_id].page?.name }}
                            <br>
                            {{ pageStore.active_page_list[item.fb_page_id].page?.fb_page_id }}
                        </span>
                    </div>
                    <img
                        v-if="labels_selected[index]"
                        class="mr-3 w-5 h-5"
                        src="@/assets/icons/check-circle.svg"
                    >
                </div>
            </div>
        </template>
        <template v-slot:footer>
            <div class="grid grid-cols-2 gap-4">
                <FilterButton @click="clearThisFilter" type="text-slate-500 hover:text-white hover:bg-slate-500"
                    :title="$t('v1.view.main.dashboard.chat.filter.un_filter')" />
                <FilterButton @click="toggleModal"
                    type="border-orange-500 text-orange-500 hover:text-white hover:bg-orange-500"
                    :title="$t('v1.view.main.dashboard.chat.filter.title')" />
            </div>
        </template>
    </ModalBottom>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useConversationStore, usePageStore } from '@/stores'
import { map, isString, get } from 'lodash'

import ModalBottom from '@/components/ModalBottom.vue'
import FilterButton from '@/views/Main/Dashboard/Chat/FilterModal/FilterButton.vue'

import { nonAccentVn } from '@/service/helper/format'

import type { ComponentRef } from '@/service/interface/vue'
import type { LabelInfo } from '@/service/interface/app/label'


const conversationStore = useConversationStore()
const pageStore = usePageStore()

/**ref của modal */
const filter_modal_ref = ref<ComponentRef>()
/** Danh sách label của page đang được chọn */
const labels = ref<{[index: string]: LabelInfo}>({})
/** Snap label của page đang được chọn */
const snap_labels = ref<{[index: string]: LabelInfo}>({})
/** Danh sách label sau khi bấm chọn */
const labels_selected = ref<{[index: string]: boolean}>({})
/** ID page hiện tại đang được chọn */
const label_search_name = ref<string>('')

/** Xoá lọc */
function clearThisFilter() {
    delete conversationStore.option_filter_page_data.display_style
    toggleModal()
}

/** Ẩn hiện modal */
function toggleModal() {
    filter_modal_ref.value?.toggleModal()
}

/** Lấy danh sách nhãn */
function getLabelList() {
    map(pageStore.selected_page_list_info, (item) => {
        labels.value = { ...labels.value, ...item.label_list }
    })
    snap_labels.value = labels.value
}

/** Hiển thị label đã chọn */
function showLabelSelected() {
    if(get(conversationStore.option_filter_page_data, 'not_label_id')) {
        let label_id:string = get(conversationStore.option_filter_page_data, 'not_label_id') || ''
        let labels:string[] = label_id.split(' ')
        labels.map(item => {
            labels_selected.value[item] = true
        })
    }
}

/** Chọn nhãn */
function selectLabel(page_id: string) {
    if(labels_selected.value[page_id]) delete labels_selected.value[page_id]
    else labels_selected.value[page_id] = true
    filterByLabel()
}

/** Lọc theo nhãn đã chọn */
function filterByLabel() {
    let label_id:string = ''
    label_id = Object.keys(labels_selected.value).join(' ')
    conversationStore.option_filter_page_data.not_label_id = label_id
}

/** Tìm kiếm nhãn theo tên */
function searchLabel() {
    if(!label_search_name.value) return labels.value = snap_labels.value
    labels.value = {}
    map(snap_labels.value, (item:LabelInfo) => {
        if(nonAccentVn(item.title).includes(nonAccentVn(label_search_name.value))) {
            labels.value[item._id] = item
        }
    })
}

onMounted(() => {
    /**Trường hợp điều kiện lọc theo nhãn and là string thì ghi đè lại thành boolean  */
    if(isString(conversationStore.option_filter_page_data.label_and)) {
        conversationStore.option_filter_page_data.label_and = false
    }

    /** Lấy danh sách nhãn sau 3s mounted done */
    setTimeout(function() {
        getLabelList()
        showLabelSelected()
    }, 3000)
})

defineExpose({ toggleModal })
</script>