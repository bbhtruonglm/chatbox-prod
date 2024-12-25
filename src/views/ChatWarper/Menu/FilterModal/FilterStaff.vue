<template>
  <Popover
    ref="filter_popover_ref"
    :is_fit="false"
    width="450px"
    height="500px"
    position="RIGHT"
    :back="350"
  >
    <MenuTitle :title="$t('v1.view.main.dashboard.chat.filter.staff.title')" />
    <div class="py-3">
      <input
        ref="search_ref"
        type="text"
        :placeholder="$t('v1.view.main.dashboard.chat.filter.staff.find_staff')"
        class="border px-3 py-1 w-full rounded-lg focus:outline-none text-sm"
        v-on:keyup="searchStaff"
        v-model="search_staff_name"
      />
    </div>
    <div class="h-[calc(100%_-_88px)] overflow-y-auto">
      <div
        class="w-full flex items-center justify-between py-2.5 border-b cursor-pointer hover:bg-orange-100 px-2"
        v-for="(staff, index) in staff_list"
        @click="selectStaff(index)"
      >
        <div class="flex items-center">
          <StaffAvatar
            class="rounded-full w-6 h-6 mr-3"
            :id="staff?.user_id || staff?.fb_staff_id"
          />
          <p
            :class="{
              'line-through': !staff?.user_id,
            }"
            class="text-sm"
          >
            {{ staff.name }}
          </p>
        </div>
        <img
          v-if="staff.is_selected"
          class="w-5 h-5"
          src="@/assets/icons/check-circle.svg"
        />
      </div>
    </div>
  </Popover>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { useConversationStore, usePageStore } from '@/stores'
import { map, debounce, sortBy, mapValues, size } from 'lodash'
import { nonAccentVn } from '@/service/helper/format'
import { watch } from 'vue'

import Popover from '@/components/Popover.vue'
import StaffAvatar from '@/components/Avatar/StaffAvatar.vue'
import MenuTitle from '@/components/Main/Dashboard/MenuTitle.vue'

import type { ComponentRef } from '@/service/interface/vue'
import type { StaffInfo } from '@/service/interface/app/staff'

const conversationStore = useConversationStore()
const pageStore = usePageStore()

/** Danh sách nhân viên */
const staff_list = ref<StaffInfo[]>([])
/** Danh sách nhân viên */
const snap_staffs = ref<{ [index: string]: StaffInfo }>({})
/** Search staff name */
const search_staff_name = ref<string>('')
/**ref của dropdown */
const filter_popover_ref = ref<ComponentRef>()
/**ref của dropdown search */
const search_ref = ref<ComponentRef>()

watch(
  () => pageStore.selected_page_list_info,
  () => getStaffs()
)

/** Xoá lọc */
function clearThisFilter() {
  // xoá store lọc
  delete conversationStore.option_filter_page_data.staff_id

  // loại bỏ gắn cờ
  staff_list.value = staff_list.value.map(staff => {
    staff.is_selected = false

    return staff
  })
}
/** Lấy danh sách nhân viên */
function getStaffs() {
  // lưu lại danh sách nhãn gốc dưới dạng obj
  map(pageStore.selected_page_list_info, item => {
    snap_staffs.value = {
      ...snap_staffs.value,
      ...mapValues(item.staff_list, staff => {
        // gắn toàn bộ nhãn cờ chưa chọn để tránh lỗi khi sort
        staff.is_selected = false

        return staff
      }),
    }
  })

  // đánh dấu các staff đã được chọn
  staff_list.value = map(snap_staffs.value, staff => {
    // check từ store
    if (
      conversationStore.option_filter_page_data.staff_id?.includes(
        staff?.fb_staff_id
      )
    )
      staff.is_selected = true

    return staff
  })

  // lọc đã chọn lên đầu
  staff_list.value = sortStaff(staff_list.value)
}
/** Lựa chọn nhân viên */
function selectStaff(index: number) {
  // toggle nhãn
  staff_list.value[index].is_selected = !staff_list.value[index].is_selected

  /**danh sách id nhãn đã chọn */
  let list_id = staff_list.value
    ?.filter(staff => staff.is_selected)
    ?.map(staff => staff.user_id || staff.fb_staff_id)

  // lưu lại id nhãn đã chọn vào store
  conversationStore.option_filter_page_data.staff_id = size(list_id)
    ? list_id
    : undefined

  // sort đã chọn lên đầu
  staff_list.value = sortStaff(staff_list.value)
}
/**đưa các staff được chọn lên đầu */
function sortStaff(input: StaffInfo[]) {
  return sortBy(input, 'is_selected').reverse()
}
/** Lọc hội thoại theo nhân viên */
const searchStaff = debounce(($event: Event) => {
  // nếu không tìm kiếm thì hiển thị toàn bộ
  if (!search_staff_name.value)
    return (staff_list.value = sortStaff(map(snap_staffs.value)))

  // lọc các nhãn thoả mãn tìm kiếm
  let temp: StaffInfo[] = map(snap_staffs.value).filter((item: StaffInfo) =>
    nonAccentVn(item.name).includes(nonAccentVn(search_staff_name.value))
  )

  staff_list.value = sortStaff(temp)
}, 300)

defineExpose({ filter_popover_ref, clearThisFilter })
</script>
