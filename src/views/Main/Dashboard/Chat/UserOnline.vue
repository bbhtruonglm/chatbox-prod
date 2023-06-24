<template>
    <div v-if="!size(staff_list_array)" class="relative">
        <div class="absolute left-[50%] translate-x-[-50%]">
            <Loading class="mx-auto" />
        </div>
    </div>
    <!-- <div v-if="!size(staff_list_array)" class="absolute left-[50%] translate-x-[-50%] h-[37px]">
        <Loading class="mx-auto" />
    </div> -->
    <VirtualList class="user-online overflow-hidden overflow-x-auto mt-2 px-2 h-[37px]" wrap-class="inline-flex"
        :data-key="'data_key'" :data-sources="staff_list_array" :data-component="UserOnlineItem" direction="horizontal" />
</template>
<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue'
import VirtualList from 'vue3-virtual-scroll-list'
import { usePageStore } from '@/stores'
import { online_staff } from '@/service/api/chatbox/n4-service'
import { waterfall } from 'async'
import { keys, map, set, size, sortBy } from 'lodash'

import Loading from '@/components/Loading.vue'
import UserOnlineItem from '@/views/Main/Dashboard/Chat/UserOnline/UserOnlineItem.vue'

import type { CbError } from '@/service/interface/function'
import type { StaffInfo, AllStaffList, StaffSocket } from '@/service/interface/app/staff'

const pageStore = usePageStore()

/**danh sách các staff hiện tại của các page được chọn */
const staff_list = ref<AllStaffList>({})
/**danh sách dạng mảng */
const staff_list_array = ref<StaffInfo[]>([])

// khi có data page được chọn thì tính toán danh sách online
watch(() => pageStore.selected_page_list_info, () => getListStaffOfSelectedPage())

onMounted(() => window.addEventListener('chatbox_socket_staff', onRealtimeChangeOnlineStatus))
onUnmounted(() => window.removeEventListener('chatbox_socket_staff', onRealtimeChangeOnlineStatus))

interface CustomEvent extends Event {
    detail?: StaffSocket
}
/**lắng nghe thay đổi khi user trực tuyến - ngoại tuyến */
function onRealtimeChangeOnlineStatus({ detail }: CustomEvent) {
    if (!detail?.fb_staff_id || !staff_list.value[detail?.fb_staff_id]) return

    // nếu trực tuyến
    if (detail?.online_status)
        set(staff_list.value, [detail?.fb_staff_id, 'is_online'], true)
    // nếu ngoại tuyến 
    else
        delete staff_list.value?.[detail?.fb_staff_id]?.is_online

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
                map(
                    r,
                    staff_id => set(
                        staff_list.value,
                        [staff_id, 'is_online'],
                        true
                    )
                )

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