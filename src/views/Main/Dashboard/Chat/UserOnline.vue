<template>
    <div v-if="!size(staff_list_array)" class="relative">
        <div class="absolute left-[50%] translate-x-[-50%]">
            <Loading class="mx-auto" />
        </div>
    </div>
    <VirtualList class="user-online overflow-hidden overflow-x-auto mt-2 px-2 h-[37px]" wrap-class="inline-flex"
        :data-key="'data_key'" :data-sources="staff_list_array" :data-component="UserOnlineItem" direction="horizontal" />
</template>
<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue'
import VirtualList from 'vue3-virtual-scroll-list'
import { usePageStore, useStaffStore } from '@/stores'
import { online_staff } from '@/service/api/chatbox/n4-service'
import { waterfall } from 'async'
import { keys, map, set, size, sortBy } from 'lodash'

import Loading from '@/components/Loading.vue'
import UserOnlineItem from '@/views/Main/Dashboard/Chat/UserOnline/UserOnlineItem.vue'

import type { CbError } from '@/service/interface/function'
import type { StaffInfo, AllStaffList, StaffSocket } from '@/service/interface/app/staff'

/**dữ liệu từ socket */
interface CustomEvent extends Event {
    detail?: StaffSocket
}

const pageStore = usePageStore()
const staffStore = useStaffStore()

/**danh sách các staff hiện tại của các page được chọn */
const staff_list = ref<AllStaffList>({})
/**danh sách dạng mảng */
const staff_list_array = ref<StaffInfo[]>([])

// khi có data page được chọn thì tính toán danh sách online
watch(() => pageStore.selected_page_list_info, () => getListStaffOfSelectedPage())

onMounted(() => window.addEventListener('chatbox_socket_staff', onRealtimeChangeOnlineStatus))
onUnmounted(() => window.removeEventListener('chatbox_socket_staff', onRealtimeChangeOnlineStatus))

/**lắng nghe thay đổi khi user trực tuyến - ngoại tuyến */
function onRealtimeChangeOnlineStatus({ detail }: CustomEvent) {
    if (!detail?.fb_staff_id) return

    // nếu trực tuyến
    if (detail?.online_status)
        changeUserOnlineValue(detail?.fb_staff_id, 'ONLINE')
    // nếu ngoại tuyến 
    else
        changeUserOnlineValue(detail?.fb_staff_id, 'OFFINE')

    // sort lại danh sách
    sortUserOnlineToTop()
}
/**đọc danh sách của các user của các page được chọn hiện tại */
function getListStaffOfSelectedPage() {
    waterfall([
        // * gộp dữ liệu staff
        (cb: CbError) => {
            // loop danh sách các page được chọn
            map(pageStore.selected_page_list_info, (page_info, page_id: string) => {
                // lấy danh sách staff của 1 page
                const staff_list_data = page_info?.staff_list || {}

                // loop danh sách staff của 1 page
                map(staff_list_data, (staff_data, staff_id) => {
                    // tạo data key
                    const current_staff_data = {
                        ...{ data_key: staff_id },
                        ...staff_data,
                    }

                    // thêm vào mảng các staff
                    set(staff_list.value, [staff_id], current_staff_data)
                })
            })

            cb()
        },
        // * đọc dữ liệu online hiện tại
        (cb: CbError) => online_staff(
            keys(pageStore.selected_page_id_list),
            (e, r) => {
                if (e) return cb(e)

                if (!size(r)) return cb()

                // gắn cờ online
                map(r, staff_id => changeUserOnlineValue(staff_id, 'ONLINE'))

                cb()
            }
        ),
        // * object -> array
        (cb: CbError) => {
            sortUserOnlineToTop()

            cb()
        }
    ])
}
/**thay đổi trạng thái online | offline của 1 user */
function changeUserOnlineValue(staff_id: string, type: 'ONLINE' | 'OFFINE') {
    // nếu online
    if (type === 'ONLINE') {
        if (!size(staffStore.staff_list_of_active_page)) return

        // lưu lại giá trị vào biến trong component để phục vụ sort
        set(
            staff_list.value,
            [staff_id, 'is_online'],
            true
        )

        // lưu lại giá trị ở store
        set(
            staffStore.staff_list_of_active_page || {},
            [staff_id, 'is_online'],
            true
        )
    }
    // nếu offline
    else {
        // xoá giá trị ở biến trong component để phục vụ sort
        delete staff_list.value?.[staff_id]?.is_online

        // xoá giá trị ở store
        delete staffStore.staff_list_of_active_page?.[staff_id]?.is_online
    }
}
/**sắp xếp user đang trực tuyến lên đầu */
function sortUserOnlineToTop() {
    // object -> array | sort is_online
    staff_list_array.value = sortBy(map(staff_list.value), 'is_online')
}
</script>
<style scoped lang="scss">
.user-online {
    &::-webkit-scrollbar {
        height: 0px;
    }
}
</style>