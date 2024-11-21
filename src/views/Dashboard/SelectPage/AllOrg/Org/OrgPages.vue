<template>
  <div
    v-if="active_page_list?.length"
    class="bg-white rounded-lg py-3 px-4 grid grid-cols-4 gap-y-3 gap-x-6"
  >
    <template v-for="page of active_page_list">
      <PageItem
        @select_page="triggerSelectPage"
        @sort_list_page="getListPage"
        :page_info="page?.page!"
        :page="page"
      />
    </template>
  </div>
</template>
<script setup lang="ts">
import { useOrgStore, usePageStore, useSelectPageStore } from '@/stores'
import { KEY_ADVANCE_SELECT_AGE_FUNCT, KEY_SORT_LIST_PAGE_FUNCT } from '@/views/Dashboard/SelectPage/symbol'
import { omitBy } from 'lodash'
import { inject, onMounted, ref, watch } from 'vue'

import PageItem from '@/views/Dashboard/SelectPage/PageItem.vue'

import type { PageData } from '@/service/interface/app/page'

const $props = withDefaults(
  defineProps<{
    /** id tổ chức */
    org_id: string
  }>(),
  {}
)

const pageStore = usePageStore()
const selectPageStore = useSelectPageStore()

/**xử lý khi trang được chọn ở chế độ nhiều */
const triggerSelectPage = inject(KEY_ADVANCE_SELECT_AGE_FUNCT)

/**danh sách page sau khi được lọc */
const active_page_list = ref<PageData[]>()

// load danh sách trang khi component được tạo
onMounted(() => getListPage())

// lọc danh sách page khi được tìm kiếm
watch(
  () => selectPageStore.search,
  () => getListPage()
)
// nạp lại danh sách page thì có thay đổi
watch(
  () => pageStore.active_page_list,
  () => getListPage()
)

/**hàm sort lại danh sách trang của component cha */
const sortListPage = inject(KEY_SORT_LIST_PAGE_FUNCT)

/**sắp xếp page gắn sao lên đầu */
function getListPage() {
  // lọc ra các page thuộc về nhóm này
  active_page_list.value = sortListPage?.()?.filter(isVisible)
}
/**có hiển thị trang không */
function isVisible(page?: PageData): boolean {
  // không có page thì không hiển thị
  if (!page?.page?.fb_page_id) return false

  // chỉ hiển thị trang của tổ chức này
  if (
    !pageStore.map_orgs?.map_org_page?.[$props.org_id]?.[page?.page?.fb_page_id]
  )
    return false

  // cho phép hiển thị
  return true
}
</script>
