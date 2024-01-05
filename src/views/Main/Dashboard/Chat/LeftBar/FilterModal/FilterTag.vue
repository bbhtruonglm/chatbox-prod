<template>
    <ModalBottom ref="filter_modal_ref" :left="commonStore.conversation_filter_modal_left"
        :width="commonStore.conversation_filter_modal_width">
        <template v-slot:header>
            {{ $t('v1.view.main.dashboard.chat.filter.label.title') }}
        </template>
        <template v-slot:body>
            <div class="h-[calc(100vh_-_239px)]">
                <div class="py-3 grid grid-cols-2 gap-2">
                    <SelectPage :select_page="filterLabelByPage" />
                    <input ref="search_ref" type="text"
                        :placeholder="$t('v1.view.main.dashboard.chat.filter.label.find_tag')"
                        class="border px-3 py-1 rounded-lg focus:outline-none" v-on:keyup="searchLabel"
                        v-model="label_search_name">
                </div>
                <div class="flex justify-between py-3 border-t border-b">
                    <p>{{ $t('v1.view.main.dashboard.chat.filter.label.filteration_condition') }}</p>
                    <div class="flex items-center">
                        <p class="mr-3">{{ $t('v1.view.main.dashboard.chat.filter.label.or') }}</p>
                        <input :checked="!conversationStore.option_filter_page_data.label_and" :value="false"
                            v-model="conversationStore.option_filter_page_data.label_and" type="radio"
                            class="accent-orange-600 w-[20px] h-[20px]">
                        <p class="mr-3 ml-8">{{ $t('v1.view.main.dashboard.chat.filter.label.and') }}</p>
                        <input v-model="conversationStore.option_filter_page_data.label_and" :value="true"
                            :checked="conversationStore.option_filter_page_data.label_and" type="radio"
                            class="accent-orange-600 w-[20px] h-[20px] mr-3">
                    </div>
                </div>
                <div class="h-[calc(100%_-_111px)] scrollbar-vertical overflow-hidden overflow-y-auto">
                    <TagItem v-for="item, index of label_list" @click="selectLabel(index)" :label="item"
                        :is_selected="item?.is_selected" />
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
    <Dropdown ref="filter_dropdown_ref" @open_dropdown="onOpenDropdown" :is_fit="false" width="450px" height="500px"
        position="RIGHT" :back="150">
        <div class="text-sm h-full w-full">
            <button v-tooltip="$t('v1.view.main.dashboard.chat.filter.un_filter')"
                v-if="!!conversationStore.option_filter_page_data.label_id" @click="clearThisFilter"
                class="absolute top-[8px] right-[14px]">
                <img src="@/assets/icons/close-red.svg">
            </button>
            <div class="border-b font-semibold pb-1">
                {{ $t('v1.view.main.dashboard.chat.filter.label.title') }}
            </div>
            <div class="py-3 grid grid-cols-2 gap-2">
                <SelectPage :select_page="filterLabelByPage" />
                <input ref="search_ref" type="text" :placeholder="$t('v1.view.main.dashboard.chat.filter.label.find_tag')"
                    class="border px-3 py-1 rounded-lg focus:outline-none" v-on:keyup="searchLabel"
                    v-model="label_search_name">
            </div>
            <div class="flex justify-between py-3 border-t border-b">
                <p>{{ $t('v1.view.main.dashboard.chat.filter.label.filteration_condition') }}</p>
                <div class="flex items-center">
                    <p class="mr-3">{{ $t('v1.view.main.dashboard.chat.filter.label.or') }}</p>
                    <input :checked="!conversationStore.option_filter_page_data.label_and" :value="false"
                        v-model="conversationStore.option_filter_page_data.label_and" type="radio"
                        class="accent-orange-600 w-[20px] h-[20px]">
                    <p class="mr-3 ml-8">{{ $t('v1.view.main.dashboard.chat.filter.label.and') }}</p>
                    <input v-model="conversationStore.option_filter_page_data.label_and" :value="true"
                        :checked="conversationStore.option_filter_page_data.label_and" type="radio"
                        class="accent-orange-600 w-[20px] h-[20px] mr-3">
                </div>
            </div>
            <div class="h-[calc(100%_-_136px)] scrollbar-vertical overflow-hidden overflow-y-auto">
                <TagItem v-for="item, index of label_list" @click="selectLabel(index)" :label="item"
                    :is_selected="item?.is_selected" />
            </div>
        </div>
    </Dropdown>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useConversationStore, usePageStore, useCommonStore } from '@/stores'
import { map, isString, debounce, sortBy, mapValues, size } from 'lodash'
import { nonAccentVn } from '@/service/helper/format'
import { isMobile } from '@/service/function'
import { watch } from 'vue'

import SelectPage from './Tag/SelectPage.vue'
import Dropdown from '@/components/Dropdown.vue'
import ModalBottom from '@/components/ModalBottom.vue'
import TagItem from '@/views/Main/Dashboard/Chat/LeftBar/FilterModal/Tag/TagItem.vue'
import FilterButton from '@/views/Main/Dashboard/Chat/LeftBar/FilterModal/FilterButton.vue'

import type { ComponentRef } from '@/service/interface/vue'
import type { LabelInfo } from '@/service/interface/app/label'

const conversationStore = useConversationStore()
const pageStore = usePageStore()
const commonStore = useCommonStore()

/**ref của modal */
const filter_modal_ref = ref<ComponentRef>()
/** Danh sách label của page đang được chọn */
const label_list = ref<LabelInfo[]>([])
/** Snap dữ liệu danh sách label */
const snap_label_list = ref<LabelInfo[]>([])
/** Snap label của page đang được chọn */
const snap_labels = ref<{ [index: string]: LabelInfo }>({})
/** ID page hiện tại đang được chọn */
const label_search_name = ref<string>('')
/**ref của dropdown */
const filter_dropdown_ref = ref<ComponentRef>()
/**ref của dropdown search */
const search_ref = ref<ComponentRef>()

watch(() => pageStore.selected_page_list_info, () => getLabelList())

onMounted(() => {
    /**Trường hợp điều kiện lọc theo nhãn and là string thì ghi đè lại thành boolean  */
    if (isString(conversationStore.option_filter_page_data.label_and)) {
        conversationStore.option_filter_page_data.label_and = false
    }
})

/**tự động focus vào search */
function onOpenDropdown() {
    setTimeout(() => search_ref.value?.focus(), 50)
}
/** Xoá lọc */
function clearThisFilter() {
    // xoá store lọc
    delete conversationStore.option_filter_page_data.label_id

    // loại bỏ gắn cờ
    label_list.value = label_list.value.map(label => {
        label.is_selected = false

        return label
    })

    // tắt modal
    immediatelyHide()
}
/** Ẩn hiện modal */
function toggleModal() {
    filter_modal_ref.value?.toggleModal()
}
/** Lấy danh sách nhãn */
function getLabelList() {
    // lưu lại danh sách nhãn gốc dưới dạng obj
    map(pageStore.selected_page_list_info, (item) => {
        snap_labels.value = {
            ...snap_labels.value,
            ...mapValues(item.label_list, label => {
                // gắn toàn bộ nhãn cờ chưa chọn để tránh lỗi khi sort
                label.is_selected = false

                return label
            })
        }
    })

    // đánh dấu các label đã được chọn
    label_list.value = map(snap_labels.value, label => {
        // check từ store
        if (
            conversationStore.option_filter_page_data.label_id?.includes(label?._id)
        ) label.is_selected = true

        return label
    })

    // lọc đã chọn lên đầu
    label_list.value = sortLabel(label_list.value)
    // snap lại dữ liệu để lọc theo page
    snap_label_list.value = label_list.value
}
/** Chọn nhãn */
function selectLabel(index: number) {
    // toggle nhãn
    label_list.value[index].is_selected = !label_list.value[index].is_selected

    /**danh sách id nhãn đã chọn */
    let list_id = label_list.value?.filter(label => label.is_selected)?.map(label => label._id)

    // lưu lại id nhãn đã chọn vào store
    conversationStore.option_filter_page_data.label_id = size(list_id) ? list_id : undefined

    // sort đã chọn lên đầu
    label_list.value = sortLabel(label_list.value)
}
/**đưa các label được chọn lên đầu */
function sortLabel(input: LabelInfo[]) {
    return sortBy(input, 'is_selected').reverse()
}
/** Tìm kiếm nhãn theo tên */
const searchLabel = debounce(($event: Event) => {
    // nếu không tìm kiếm thì hiển thị toàn bộ
    if (!label_search_name.value) return label_list.value = sortLabel(map(snap_labels.value))

    // lọc các nhãn thoả mãn tìm kiếm
    let temp: LabelInfo[] = map(snap_labels.value)
        .filter((item: LabelInfo) => nonAccentVn(item.title)
            .includes(nonAccentVn(label_search_name.value)))

    label_list.value = sortLabel(temp)
}, 300)
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
/** Hiển thị nhãn theo page đã chọn */
function filterLabelByPage(page_id: string) {
    if (!page_id) {
        label_list.value = snap_label_list.value
        label_list.value = sortLabel(label_list.value)
        return
    }
    label_list.value = snap_label_list.value.filter(label => {
        return label.fb_page_id === page_id
    })
    label_list.value = sortLabel(label_list.value)
}

defineExpose({ toggle, toggleModal, filter_modal_ref, filter_dropdown_ref, clearThisFilter })
</script>