<template>
    <ModalBottom 
        ref="change_staff_modal_ref" 
        :left="commonStore.assign_staff_modal_left" 
        :width="commonStore.assign_staff_modal_width"
        @open_modal="getStaffsByPageId()"
    >
        <template v-slot:header>
            {{ $t('v1.view.main.dashboard.chat.assign_staff.title') }}
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
                    class="w-full flex items-center justify-between py-2.5 
                    border-b cursor-pointer hover:bg-orange-100 px-2"
                    v-for="staff, staff_id in staffs"
                    @click="assignConversationtoStaff(staff)"
                    v-show="staff"
                >   
                    <div class="flex items-center">
                        <StaffAvatar
                            class="rounded-full mr-3" 
                            :id="staff?.fb_staff_id"
                            size="35"
                        />
                        <p class="text-sm">{{ staff?.name }}</p>
                    </div>
                    <img 
                        v-if="fb_staff_id === staff_id"
                        class="w-5 h-5"
                        src="@/assets/icons/check-circle.svg"
                    >
                </div>
            </div>
        </template>
    </ModalBottom>
</template>

<script setup lang="ts">
import { map } from 'lodash'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useCommonStore, usePageStore, useConversationStore } from '@/stores'
import { teleportModelAssignStaffOnPcScreen } from '@/service/function'


import ModalBottom from '@/components/ModalBottom.vue'
import StaffAvatar from '@/components/Avatar/StaffAvatar.vue'

import { nonAccentVn } from '@/service/helper/format'

import type { ComponentRef } from '@/service/interface/vue'
import type { StaffInfo } from '@/service/interface/app/staff'

/** Sử dụng route vue */
const $route = useRoute()

/** Sử dụng store */
const commonStore = useCommonStore()
const pageStore = usePageStore()
const conversationStore = useConversationStore()

/** ref của modal chính */
const change_staff_modal_ref = ref<ComponentRef>()

/** Danh sách nhân viên */
const staffs = ref<{ [index: string]: StaffInfo }>({})

/** Danh sách nhân viên */
const snap_staffs = ref<{ [index: string]: StaffInfo }>({})

/** Nhân viên được phân công phụ trách cuộc hội thoại */
const fb_staff_id = ref<string>('')

/** Tên nhân viên đang tìm kiếm */
const search_staff_name = ref<string>('')

onMounted(() => {
    teleportModelAssignStaffOnPcScreen()
})

/** ẩn hiện modal */
function toggleModal() {
    change_staff_modal_ref.value?.toggleModal()
}

/** Lấy ra danh sách user theo page hiện tại đang chọn */
function getStaffsByPageId() {
    // * Xóa tên nhân viên đang tìm kiếm
    search_staff_name.value = ''
    
    // * Lấy ID page hiện tại
    const curent_page_id:string = $route.query.page_id as string

    // * Lấy ra thông tin page hiện tại từ store
    const current_page = pageStore.selected_page_list_info[curent_page_id]

    // * Lưu lại danh sách nhân viên
    staffs.value = current_page.staff_list || {}
    snap_staffs.value = staffs.value

    // * Lưu lại id nhân viên được phân phụ trách cuộc hội thoại
    fb_staff_id.value = conversationStore.select_conversation?.fb_staff_id || ''

    // * Đưa nhân viên được assign lên đầu danh sách
    pushStaffSelectedToTop()
}

/** Phân công cuộc trò chuyện cho nhân viên */
function assignConversationtoStaff(staff: StaffInfo) {
    // * Nếu data conversation không tồn tại thì dừng lại
    if(!conversationStore.select_conversation) return

    // * Nếu nhân viên đã được assign thì không chạy logic nữa
    if(fb_staff_id.value === staff.fb_staff_id) return
     
    // * Phân công cuộc hội thoại cho nhân viên
    conversationStore.select_conversation.fb_staff_id = staff.fb_staff_id

    // * Lưu lại id nhân viên được phân phụ trách cuộc hội thoại
    fb_staff_id.value = staff.fb_staff_id

    // * Đưa nhân viên được assign lên đầu danh sách
    pushStaffSelectedToTop()

    // TODO Gọi api để update nhân viên được assign
}

/** Lọc hội thoại theo nhân viên */
function searchStaff() {
    if(!search_staff_name.value) return staffs.value = snap_staffs.value
    staffs.value = {}
    map(snap_staffs.value, (item:StaffInfo) => {
        let search_name: string = nonAccentVn(search_staff_name.value)
        let staff_name:string = nonAccentVn(item.name)
        if(staff_name.includes(search_name)) {
            staffs.value[item.fb_staff_id] = item
        }
    })
}

/** Đưa nhân viên được assign lên đầu danh sách */
function pushStaffSelectedToTop() {
    let new_staff_list: { [index: string]: StaffInfo } = {}
    new_staff_list[fb_staff_id.value] = staffs.value[fb_staff_id.value]
    map(staffs.value, (item) => {
        if(item && item.fb_staff_id !== fb_staff_id.value) {
            new_staff_list[item.fb_staff_id] = staffs.value[item.fb_staff_id]
        }
    })
    staffs.value = new_staff_list
}

defineExpose({ toggleModal })
</script>