<template>
  <div class="overflow-y-auto flex flex-col gap-6 pb-16">
    <Org
      v-for="(page_ids, org_id) of pageStore.map_orgs?.map_org_page"
      :org_id
    />
  </div>
</template>
<script setup lang="ts">
import { read_link_org } from '@/service/api/chatbox/billing'
import { usePageStore, useSelectPageStore } from '@/stores'
import { N4SerivceAppPage } from '@/utils/api/N4Service/Page'
import { ToastSingleton } from '@/utils/helper/Alert/Toast'
import { keys } from 'lodash'
import { onMounted } from 'vue'

import Org from '@/views/Dashboard/SelectPage/AllOrg/Org.vue'

const $toast = ToastSingleton.getInst()
const selectPageStore = useSelectPageStore()
const pageStore = usePageStore()

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
</script>
