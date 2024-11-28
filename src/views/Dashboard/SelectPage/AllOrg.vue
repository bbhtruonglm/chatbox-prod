<template>
  <div
    id="select-page__all-org"
    class="overflow-y-auto flex flex-col gap-6 pb-16"
  >
    <GroupPage
      v-if="!selectPageStore.is_group_page_mode"
      @select_page="$main.triggerSelectPage"
      filter="RECENT"
      :icon="ClockIcon"
      :title="$t('v1.common.recent')"
      tab="PAGE"
      :advancedFilter="$main.filterOrgPageOnly"
    />
    <template v-if="selectPageStore.current_menu !== 'RECENT'">
      <template v-for="org of sortBy(orgStore.list_org, 'org_info.org_name')">
        <Org
          v-if="org?.org_id"
          :key="org?.org_id"
          :org_id="org?.org_id"
        />
      </template>
    </template>
  </div>
</template>
<script setup lang="ts">
import { read_link_org } from '@/service/api/chatbox/billing'
import { useOrgStore, usePageStore, useSelectPageStore } from '@/stores'
import { N4SerivceAppPage } from '@/utils/api/N4Service/Page'
import { Toast } from '@/utils/helper/Alert/Toast'
import { keys, omitBy, sortBy } from 'lodash'
import { onMounted, provide, toRef } from 'vue'
import { KEY_ADVANCE_SELECT_AGE_FUNCT } from './symbol'
import { loading } from '@/utils/decorator/loading'
import { error } from '@/utils/decorator/error'
import { container } from 'tsyringe'

import Org from '@/views/Dashboard/SelectPage/AllOrg/Org.vue'
import GroupPage from '@/views/Dashboard/SelectPage/GroupPage.vue'

import ClockIcon from '@/components/Icons/Clock.vue'

import type { PageData } from '@/service/interface/app/page'

const $toast = container.resolve(Toast)
const selectPageStore = useSelectPageStore()
const pageStore = usePageStore()
const orgStore = useOrgStore()

class Main {
  /**lấy toàn bộ dữ liệu tổ chức và trang */
  @loading(toRef(selectPageStore, 'is_loading'))
  @error($toast)
  async getALlOrgAndPage() {
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
  }
  /**lọc ra các trang thuộc 1 tổ chức nào đó */
  filterOrgPageOnly(page: PageData): boolean {
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
  triggerSelectPage(page: PageData): void {
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
}
const $main = new Main()

// lấy toàn bộ dữ liệu tổ chức và trang khi component được mount
onMounted($main.getALlOrgAndPage)

// cung cấp hàm xử lý khi chọn trang
provide(KEY_ADVANCE_SELECT_AGE_FUNCT, $main.triggerSelectPage)
</script>
