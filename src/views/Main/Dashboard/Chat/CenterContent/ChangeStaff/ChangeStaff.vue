<template>
    <ModalBottom ref="change_staff_modal_ref" :left="commonStore.center_modal_left" :width="commonStore.center_modal_width"
        @open_modal="getStaffsByPageId()">
        <template v-slot:header>
            {{ $t('v1.view.main.dashboard.chat.assign_staff.title') }}
        </template>
        <template v-slot:body>
            <div class="h-[calc(100vh_-_300px)]">
                <SearchStaff @search_staff="searchStaff" />
                <StaffItem @select_staff="assignConversationtoStaff" :staffs="staffs" :select_staff_id="fb_staff_id" />
            </div>
        </template>
    </ModalBottom>
    <Dropdown ref="change_staff_dropdown_ref" @open_dropdown="onOpenDropdown()" :is_fit="false" width="350px"
        height="360px">
        <SearchStaff ref="search_ref" @search_staff="searchStaff" />
        <StaffItem @select_staff="assignConversationtoStaff" :staffs="staffs" :select_staff_id="fb_staff_id" />
    </Dropdown>
</template>

<script setup lang="ts">
import { map } from 'lodash'
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useCommonStore, usePageStore, useConversationStore } from '@/stores'
import { isMobile, teleportCenterModelOnPcScreen } from '@/service/function'
import { set_assign_staff_conversation } from '@/service/api/chatbox/n4-service'
import { nonAccentVn } from '@/service/helper/format'
import { flow } from '@/service/helper/async'

import ModalBottom from '@/components/ModalBottom.vue'
import Dropdown from '@/components/Dropdown.vue'
import SearchStaff from '@/views/Main/Dashboard/Chat/CenterContent/ChangeStaff/SearchStaff.vue'
import StaffItem from '@/views/Main/Dashboard/Chat/CenterContent/ChangeStaff/StaffItem.vue'

import type { ComponentRef } from '@/service/interface/vue'
import type { StaffInfo } from '@/service/interface/app/staff'
import type { CbError } from '@/service/interface/function'

const $route = useRoute()

/** Sử dụng store */
const commonStore = useCommonStore()
const pageStore = usePageStore()
const conversationStore = useConversationStore()

/**ref của dropdown */
const change_staff_dropdown_ref = ref<ComponentRef>()
/** ref của modal */
const change_staff_modal_ref = ref<ComponentRef>()
/** Danh sách nhân viên */
const staffs = ref<{ [index: string]: StaffInfo }>({})
/** Danh sách nhân viên */
const snap_staffs = ref<{ [index: string]: StaffInfo }>({})
/** Nhân viên được phân công phụ trách cuộc hội thoại */
const fb_staff_id = ref<string>('')
/** Tên nhân viên đang tìm kiếm */
const search_staff_name = ref<string>('')
/** ref của modal */
const search_ref = ref<ComponentRef>()

/** Khi chọn converstion khác thì ẩn modal assign nhân viên đi */
watch(
    () => conversationStore.select_conversation,
    () => change_staff_modal_ref.value?.immediatelyHide()
)

onMounted(() => teleportCenterModelOnPcScreen())

/**hiện thị */
function toggle($event: MouseEvent) {
    // nếu mobile thì mở bottom modal
    if (isMobile()) change_staff_modal_ref.value?.toggleModal()
    // nếu là pc thỉ mở dropdown
    else change_staff_dropdown_ref.value?.toggleDropdown($event)
}
/**tự động focus vào search trên pc */
function onOpenDropdown() {
    setTimeout(() => search_ref.value?.focus(), 50)    

    getStaffsByPageId()
}
/** Lấy ra danh sách user theo page hiện tại đang chọn */
function getStaffsByPageId() {
    // * Xóa tên nhân viên đang tìm kiếm
    search_staff_name.value = ''

    // * Lấy ID page hiện tại
    const curent_page_id: string = $route.query.page_id as string

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
    if (!conversationStore.select_conversation) return

    // * Nếu nhân viên đã được assign thì không chạy logic nữa
    if (fb_staff_id.value === staff.fb_staff_id) return

    // * Lưu lại id nhân viên được phân phụ trách cuộc hội thoại
    fb_staff_id.value = staff.fb_staff_id

    // * Đưa nhân viên được assign lên đầu danh sách
    pushStaffSelectedToTop()

    flow([
        // * Gọi api để update nhân viên được assign
        (cb: CbError) => set_assign_staff_conversation({
            page_id: conversationStore.select_conversation?.fb_page_id as string,
            client_id: conversationStore.select_conversation?.fb_client_id as string,
            new_staff_id: staff.fb_staff_id,
            old_staff_id: conversationStore.select_conversation?.fb_staff_id,
        }, (e, r) => {
            if (e) return cb(e)

            cb()
        }),
        // * ẩn sau khi chạy xong
        (cb: CbError) => {
            // ẩn modal
            if (isMobile()) change_staff_modal_ref.value?.immediatelyHide()
            // ẩn dropdown
            else change_staff_dropdown_ref.value?.immediatelyHide()

            cb()
        },
    ], undefined, true)
}
/** Lọc hội thoại theo nhân viên */
function searchStaff(search_staff_name: string) {
    if (!search_staff_name) return staffs.value = snap_staffs.value
    staffs.value = {}
    map(snap_staffs.value, (item: StaffInfo) => {
        let search_name: string = nonAccentVn(search_staff_name)
        let staff_name: string = nonAccentVn(item.name)
        if (staff_name.includes(search_name)) {
            staffs.value[item.fb_staff_id] = item
        }
    })
}
/** Đưa nhân viên được assign lên đầu danh sách */
function pushStaffSelectedToTop() {
    let new_staff_list: { [index: string]: StaffInfo } = {}
    new_staff_list[fb_staff_id.value] = staffs.value[fb_staff_id.value]
    map(staffs.value, (item) => {
        if (item && item.fb_staff_id !== fb_staff_id.value) {
            new_staff_list[item.fb_staff_id] = staffs.value[item.fb_staff_id]
        }
    })
    staffs.value = new_staff_list
}

defineExpose({ toggle })
</script>