<template>
  <div class="overflow-y-auto flex flex-col gap-6 pb-16">
    <GroupPage
      @select_page="triggerSelectPage"
      filter="RECENT"
      :icon="ClockIcon"
      :title="$t('v1.common.recent')"
      tab="PAGE"
      :advancedFilter="filterOrgPageOnly"
    />
    <template v-if="selectPageStore.current_menu !== 'RECENT'">
      <Org
        v-for="(page_ids, org_id) of pageStore.map_orgs?.map_org_page"
        :org_id
      />
    </template>
  </div>
</template>
<script setup lang="ts">
import { read_link_org } from '@/service/api/chatbox/billing'
import { useOrgStore, usePageStore, useSelectPageStore } from '@/stores'
import { N4SerivceAppPage } from '@/utils/api/N4Service/Page'
import { ToastSingleton } from '@/utils/helper/Alert/Toast'
import { keys, omitBy } from 'lodash'
import { onMounted, provide } from 'vue'
import { KEY_ADVANCE_SELECT_AGE_FUNCT } from './symbol'

import Org from '@/views/Dashboard/SelectPage/AllOrg/Org.vue'
import GroupPage from '@/views/Dashboard/SelectPage/GroupPage.vue'

import ClockIcon from '@/components/Icons/Clock.vue'

import type { PageData } from '@/service/interface/app/page'

const $toast = ToastSingleton.getInst()
const selectPageStore = useSelectPageStore()
const pageStore = usePageStore()
const orgStore = useOrgStore()

// lấy toàn bộ dữ liệu tổ chức và trang khi component được mount
onMounted(getALlOrgAndPage)

/**lấy toàn bộ dữ liệu tổ chức và trang */
async function getALlOrgAndPage() {
  try {
    // kích hoạt loading
    selectPageStore.is_loading = true

    // xóa toàn bộ trang hiện tại
    pageStore.active_page_list = {}

    /**toàn bộ các trang của người dùng */
    const PAGE_DATA = await new N4SerivceAppPage().getListPage()

    // nếu không có dữ liệu trang thì thôi
    if (!PAGE_DATA?.page_list) return

    // lưu trữ danh sách trang hiện tại
    pageStore.active_page_list = PAGE_DATA?.page_list

    // lấy dữ liệu mapping tổ chức và trang
    pageStore.map_orgs = await read_link_org(keys(pageStore.active_page_list))
  } catch (e) {
    // hiển thị thông báo lỗi
    $toast.error(e)
  } finally {
    // tắt loading
    selectPageStore.is_loading = false
  }
}
/**lọc ra các trang thuộc 1 tổ chức nào đó */
function filterOrgPageOnly(page: PageData): boolean {
  /**id trang */
  const PAGE_ID = page?.page?.fb_page_id

  // nếu không có id trang thì ẩn
  if (!PAGE_ID) return false

  /**id tổ chức của trang này */
  const ORG_ID = pageStore.map_orgs?.map_page_org?.[PAGE_ID]

  // nếu không có tổ chức thì ẩn
  if (!ORG_ID) return false

  // hiện
  return true
}
/**xử lý khi trang được chọn ở chế độ nhiều */
function triggerSelectPage(page: PageData): void {
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

// cung cấp hàm xử lý khi chọn trang
provide(KEY_ADVANCE_SELECT_AGE_FUNCT, triggerSelectPage)
</script>
