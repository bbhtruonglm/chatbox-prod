<template>
    <ModalBottom ref="filter_modal_ref" :left="commonStore.conversation_filter_modal_left"
        :width="commonStore.conversation_filter_modal_width">
        <template v-slot:header>
            {{ $t('v1.view.main.dashboard.chat.filter.staff.title') }}
        </template>
        <template v-slot:body>
            <div class="h-[calc(100vh_-_239px)]">
                <div class="py-3">
                    <input type="text" :placeholder="$t('v1.view.main.dashboard.chat.filter.staff.find_staff')"
                        class="border px-3 py-1 w-full rounded-lg focus:outline-none" v-on:keyup="searchStaff"
                        v-model="search_staff_name">
                </div>
                <div class="h-[calc(100%_-_58px)] overflow-y-auto">
                    <div class="w-full flex items-center justify-between py-2.5 border-b cursor-pointer hover:bg-orange-100 px-2"
                        v-for="staff, staff_id in staffs" @click="selectStaff(staff_id as string)">
                        <div class="flex items-center">
                            <StaffAvatar class="rounded-full w-6 h-6 mr-3" :id="staff.fb_staff_id" />
                            <p class="text-sm">{{ staff.name }}</p>
                        </div>
                        <img v-if="staffs_selected[staff_id]" class="w-5 h-5" src="@/assets/icons/check-circle.svg">
                    </div>
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
    <Dropdown ref="filter_dropdown_ref" :is_fit="false" width="450px" height="500px" position="RIGHT" :back="250">
        <button v-tooltip="$t('v1.view.main.dashboard.chat.filter.un_filter')"
            v-if="!!conversationStore.option_filter_page_data.staff_id" @click="clearThisFilter"
            class="absolute top-[8px] right-[14px]">
            <img src="@/assets/icons/close-red.svg">
        </button>
        <div class="border-b font-semibold pb-1">
            {{ $t('v1.view.main.dashboard.chat.filter.staff.title') }}
        </div>
        <div class="py-3">
            <input type="text" :placeholder="$t('v1.view.main.dashboard.chat.filter.staff.find_staff')"
                class="border px-3 py-1 w-full rounded-lg focus:outline-none" v-on:keyup="searchStaff"
                v-model="search_staff_name">
        </div>
        <div class="h-[calc(100%_-_88px)] overflow-y-auto">
            <div class="w-full flex items-center justify-between py-2.5 border-b cursor-pointer hover:bg-orange-100 px-2"
                v-for="staff, staff_id in staffs" @click="selectStaff(staff_id as string)">
                <div class="flex items-center">
                    <StaffAvatar class="rounded-full w-6 h-6 mr-3" :id="staff.fb_staff_id" />
                    <p class="text-sm">{{ staff.name }}</p>
                </div>
                <img v-if="staffs_selected[staff_id]" class="w-5 h-5" src="@/assets/icons/check-circle.svg">
            </div>
        </div>
    </Dropdown>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useConversationStore, usePageStore, useCommonStore } from '@/stores'
import { map, keys, debounce } from 'lodash'

import ModalBottom from '@/components/ModalBottom.vue'
import Dropdown from '@/components/Dropdown.vue'
import StaffAvatar from '@/components/Avatar/StaffAvatar.vue'
import FilterButton from '@/views/Main/Dashboard/Chat/LeftBar/FilterModal/FilterButton.vue'

import { nonAccentVn } from '@/service/helper/format'

import type { ComponentRef } from '@/service/interface/vue'
import type { StaffInfo } from '@/service/interface/app/staff'
import { isMobile } from '@/service/function'

const conversationStore = useConversationStore()
const pageStore = usePageStore()
const commonStore = useCommonStore()

/** ref của modal */
const filter_modal_ref = ref<ComponentRef>()
/** Danh sách nhân viên */
const staffs = ref<{ [index: string]: StaffInfo }>({})
/** Danh sách nhân viên */
const snap_staffs = ref<{ [index: string]: StaffInfo }>({})
/** Danh sách nhân viên đã lựa chọn khi lọc */
const staffs_selected = ref<{ [index: string]: boolean }>({})
/** Search staff name */
const search_staff_name = ref<string>('')
/**ref của dropdown */
const filter_dropdown_ref = ref<ComponentRef>()

/** Xoá lọc */
function clearThisFilter() {
    delete conversationStore.option_filter_page_data.staff_id
    staffs_selected.value = {}
    immediatelyHide()
}

/** Ẩn hiện modal */
function toggleModal() {
    filter_modal_ref.value?.toggleModal()
}

/** Lấy danh sách nhân viên */
function getStaffs() {
    map(pageStore.selected_page_list_info, item => {
        staffs.value = { ...staffs.value, ...item.staff_list }
    })
    snap_staffs.value = staffs.value
}

/** Lựa chọn nhân viên */
function selectStaff(staff_id: string) {
    if (staffs_selected.value[staff_id]) delete staffs_selected.value[staff_id]
    else staffs_selected.value[staff_id] = true

    filterByStaff()
}

/** Lọc hội thoại theo nhân viên */
function filterByStaff() {
    conversationStore.option_filter_page_data.staff_id = keys(staffs_selected.value)
}

/** Lọc hội thoại theo nhân viên */
const searchStaff = debounce(($event: Event) => {
    console.log(search_staff_name.value)
    if (!search_staff_name.value) return staffs.value = snap_staffs.value
    staffs.value = {}
    map(snap_staffs.value, (item: StaffInfo) => {
        if (nonAccentVn(item.name).includes(nonAccentVn(search_staff_name.value))) {
            staffs.value[item.fb_staff_id] = item
        }
    })
}, 300)

/** Hiển thị lại nhân viên đã chọn */
function showLabelSelected() {
    conversationStore.option_filter_page_data?.staff_id?.map(item => {
        staffs_selected.value[item] = true
    })
}

onMounted(() => {
    setTimeout(function () {
        getStaffs()
        showLabelSelected()
    }, 2000)
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