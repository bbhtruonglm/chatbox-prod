<template>
    <ModalBottom ref="filter_modal_ref">
        <template v-slot:header>
            {{ $t('v1.view.main.dashboard.chat.filter.staff.title') }}
        </template>
        <template v-slot:body>
            <div class="py-3">
                <input 
                    type="text" :placeholder="$t('v1.view.main.dashboard.chat.filter.staff.find_staff')"
                    class="border px-3 py-1 w-full rounded-lg focus:outline-none"
                    v-on:keyup="searchStaff()"
                    v-model="search_staff_name"
                >
            </div>
            <div class="h-[50vh] overflow-y-auto">
                <div 
                    class="w-full flex items-center justify-between py-2.5 border-b cursor-pointer hover:bg-orange-100 px-2"
                    v-for="staff, staff_id in staffs"
                    @click="selectStaff(staff_id as string)"
                >
                    <div class="flex items-center">
                        <img 
                            :src="getStaffAvatar(staff)"
                            @error="onImageError"
                            class="rounded-full w-6 h-6 mr-3"
                        >
                        <p class="text-sm">{{ staff.name }}</p>
                    </div>
                    <img 
                        v-if="staffs_selected[staff_id]"
                        class="w-5 h-5"
                        src="@/assets/icons/check-circle.svg"
                    >
                </div>
            </div>
        </template>
        <template v-slot:footer>
            <div class="grid grid-cols-2 gap-4">
                <FilterButton 
                    @click="clearThisFilter" 
                    type="text-slate-500 hover:text-white hover:bg-slate-500"
                    :title="$t('v1.view.main.dashboard.chat.filter.un_filter')" 
                />
                <FilterButton 
                    @click="toggleModal"
                    type="border-orange-500 text-orange-500 hover:text-white hover:bg-orange-500"
                    :title="$t('v1.view.main.dashboard.chat.filter.title')" 
                />
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
import type { StaffInfo } from '@/service/interface/app/staff'

const conversationStore = useConversationStore()
const pageStore = usePageStore()

/** ref của modal */
const filter_modal_ref = ref<ComponentRef>()
/** Danh sách nhân viên */
const staffs = ref<{ [index: string]: StaffInfo }>({})
/** Danh sách nhân viên */
const snap_staffs = ref<{ [index: string]: StaffInfo }>({})
/** Danh sách nhân viên đã lựa chọn khi lọc */
const staffs_selected = ref<{[index: string]: boolean}>({})
/** Search staff name */
const search_staff_name = ref<string>('')

/** Xoá lọc */
function clearThisFilter() {
    delete conversationStore.option_filter_page_data.display_style
    toggleModal()
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

/** Hiển thị avatar nhân viên */
function getStaffAvatar(staff: StaffInfo) {
    return `${$env.img_host}/${staff.fb_staff_id}?width=${50}&height=${50}`
}

/** Hiển thị avatar mặc định khi avatar nhân viên bị lỗi */
function onImageError($event: Event) {
    const image = $event.target as HTMLImageElement
    image.src = `${$env.img_host}/1111111111?width=${50}&height=${50}`
}

/** Lựa chọn nhân viên */
function selectStaff(staff_id: string) {
    if(staffs_selected.value[staff_id]) delete staffs_selected.value[staff_id]
    else staffs_selected.value[staff_id] = true

    filterByStaff()
}

/** Lọc hội thoại theo nhân viên */
function filterByStaff() {
    let staff_id:string = ''
    staff_id = Object.keys(staffs_selected.value).join(' ')
    conversationStore.option_filter_page_data.staff_id = staff_id
}

/** Lọc hội thoại theo nhân viên */
function searchStaff() {
    if(!search_staff_name.value) return staffs.value = snap_staffs.value
    staffs.value = {}
    map(snap_staffs.value, (item:StaffInfo) => {
        if(nonAccentVn(item.name).includes(nonAccentVn(search_staff_name.value))) {
            staffs.value[item.fb_staff_id] = item
        }
    })
}

/** Hiển thị lại nhân viên đã chọn */
function showLabelSelected() {
    if(get(conversationStore.option_filter_page_data, 'staff_id')) {
        let staff_id:string = get(conversationStore.option_filter_page_data, 'staff_id') || ''
        let staffs:string[] = staff_id.split(' ')
        staffs.map(item => {
            staffs_selected.value[item] = true
        })
    }
}



onMounted(() => {
    setTimeout(function () {
        getStaffs()
        showLabelSelected()
    }, 2000)
})

defineExpose({ toggleModal })
</script>