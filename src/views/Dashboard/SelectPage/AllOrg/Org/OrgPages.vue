<template>
  <div class="bg-white rounded-lg py-3 px-4 grid grid-cols-4 gap-y-3 gap-x-6">
    <template v-for="page of pageStore.active_page_list">
      <PageItem
        v-if="isVisible(page)"
        @select_page="selectPage"
        :page_info="page?.page!"
        :page="page"
      />
    </template>
  </div>
</template>
<script setup lang="ts">
import { useOrgStore, usePageStore } from '@/stores'
import { KEY_SORT_LIST_PAGE_FUNCT } from '@/views/Dashboard/SelectPage/symbol'
import { provide } from 'vue'
import { omitBy } from 'lodash'

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
const orgStore = useOrgStore()

function sortListPage() {
  console.log('alo')
}
/**xử lý khi trang được chọn ở chế độ nhiều */
function selectPage(page: PageData) {
  // nếu không có page thì không chọn
  if (!page?.page?.fb_page_id) return

  // chọn lại tổ chức đang chọn
  orgStore.selected_org_id =
    pageStore.map_orgs?.map_page_org?.[page?.page?.fb_page_id!]

  // loại bỏ tất cả trang đang chọn khác tổ chức này
  pageStore.selected_page_id_list = omitBy(
    pageStore.selected_page_id_list,
    (v, page_id) => {
      /**id tổ chức của trang này */
      const ORG_ID = pageStore.map_orgs?.map_page_org?.[page_id]

      // nếu tổ chức không phải tổ chức đang chọn thì loại bỏ
      return ORG_ID !== orgStore.selected_org_id
    }
  )
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

// xuất hàm cho các component con sử dụng
provide(KEY_SORT_LIST_PAGE_FUNCT, sortListPage)
</script>
