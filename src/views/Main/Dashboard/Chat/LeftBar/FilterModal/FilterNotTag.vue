<template>
    <ModalBottom ref="filter_modal_ref" :left="commonStore.conversation_filter_modal_left"
        :width="commonStore.conversation_filter_modal_width">
        <template v-slot:header>
            {{ $t('v1.view.main.dashboard.chat.filter.exclude_label.title') }}
        </template>
        <template v-slot:body>
            <div class="h-[calc(100vh_-_239px)]">
                <div class="py-3">
                    <input type="text" :placeholder="$t('v1.view.main.dashboard.chat.filter.label.find_tag')"
                        class="border px-3 py-1 w-full rounded-lg focus:outline-none" v-on:keyup="searchLabel"
                        v-model="label_search_name">
                </div>
                <div class="h-[calc(100%_-_58px)] scrollbar-vertical overflow-hidden overflow-y-auto">
                    <TagItem v-for="item, index in labels" @click="selectLabel(index as string)" :label="item"
                        :is_selected="labels_selected[index]" />
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
    <Dropdown ref="filter_dropdown_ref" :is_fit="false" width="450px" height="500px" position="RIGHT" :back="200">
        <div class="border-b font-semibold pb-1">
            {{ $t('v1.view.main.dashboard.chat.filter.exclude_label.title') }}
        </div>
        <div class="py-3">
            <input type="text" :placeholder="$t('v1.view.main.dashboard.chat.filter.label.find_tag')"
                class="border px-3 py-1 w-full rounded-lg focus:outline-none" v-on:keyup="searchLabel"
                v-model="label_search_name">
        </div>
        <div class="h-[calc(100%_-_88px)] scrollbar-vertical overflow-hidden overflow-y-auto">
            <TagItem v-for="item, index in labels" @click="selectLabel(index as string)" :label="item"
                :is_selected="labels_selected[index]" />
        </div>
    </Dropdown>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useConversationStore, usePageStore, useCommonStore } from '@/stores'
import { map, isString, debounce, keys } from 'lodash'
import { nonAccentVn } from '@/service/helper/format'

import ModalBottom from '@/components/ModalBottom.vue'
import Dropdown from '@/components/Dropdown.vue'
import FilterButton from '@/views/Main/Dashboard/Chat/LeftBar/FilterModal/FilterButton.vue'
import TagItem from '@/views/Main/Dashboard/Chat/LeftBar/FilterModal/Tag/TagItem.vue'

import type { ComponentRef } from '@/service/interface/vue'
import type { LabelInfo } from '@/service/interface/app/label'
import { isMobile } from '@/service/function'

const conversationStore = useConversationStore()
const pageStore = usePageStore()
const commonStore = useCommonStore()

/**ref của modal */
const filter_modal_ref = ref<ComponentRef>()
/** Danh sách label của page đang được chọn */
const labels = ref<{ [index: string]: LabelInfo }>({})
/** Snap label của page đang được chọn */
const snap_labels = ref<{ [index: string]: LabelInfo }>({})
/** Danh sách label sau khi bấm chọn */
const labels_selected = ref<{ [index: string]: boolean }>({})
/** ID page hiện tại đang được chọn */
const label_search_name = ref<string>('')
/**ref của dropdown */
const filter_dropdown_ref = ref<ComponentRef>()

/** Xoá lọc */
function clearThisFilter() {
    delete conversationStore.option_filter_page_data.not_label_id
    labels_selected.value = {}
    immediatelyHide()
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
    conversationStore.option_filter_page_data.not_label_id?.map(item => {
        labels_selected.value[item] = true
    })
}

/** Chọn nhãn */
function selectLabel(page_id: string) {
    if (labels_selected.value[page_id]) delete labels_selected.value[page_id]
    else labels_selected.value[page_id] = true
    filterByLabel()
}

/** Lọc theo nhãn đã chọn */
function filterByLabel() {
    conversationStore.option_filter_page_data.not_label_id = keys(labels_selected.value)
}

/** Tìm kiếm nhãn theo tên */
const searchLabel = debounce(($event: Event) => {
    // function searchLabel() {
    if (!label_search_name.value) return labels.value = snap_labels.value
    labels.value = {}
    map(snap_labels.value, (item: LabelInfo) => {
        if (nonAccentVn(item.title).includes(nonAccentVn(label_search_name.value))) {
            labels.value[item._id] = item
        }
    })
    // }
}, 300)

onMounted(() => {
    /**Trường hợp điều kiện lọc theo nhãn and là string thì ghi đè lại thành boolean  */
    if (isString(conversationStore.option_filter_page_data.label_and)) {
        conversationStore.option_filter_page_data.label_and = false
    }

    /** Lấy danh sách nhãn sau 3s mounted done */
    setTimeout(function () {
        getLabelList()
        showLabelSelected()
    }, 3000)
})
/**tắt ngay lập tức */
function immediatelyHide() {
    filter_modal_ref.value?.immediatelyHide()
}
/**hiện thị */
function toggle($event: MouseEvent) {
    // nếu mobile thì mở bottom modal
    if (isMobile()) toggleModal()
    // nếu là pc thỉ mở dropdown
    else filter_dropdown_ref.value?.toggleDropdown($event)
}

defineExpose({ toggle, toggleModal, filter_modal_ref, filter_dropdown_ref, clearThisFilter })
</script>