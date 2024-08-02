<template>
  <div class="flex items-center gap-3">
    <Select
      v-if="orgStore.list_org?.length"
      v-model="orgStore.selected_org_id"
      :filter_off="true"
      :placeholder="$t('v1.view.main.dashboard.select_page.select_org')"
      class="w-60 text-slate-700"
    >
      <Option
        v-for="org of orgStore.list_org"
        :value="org.org_id"
      >
        {{ org?.org_info?.org_name }}
      </Option>
    </Select>
    <div
      v-else
      class="rounded-lg w-60 h-9 bg-white flex items-center justify-between p-3 text-sm"
    >
      <div>
        {{ $t('v1.common.loading') }}
      </div>
      <Loading />
    </div>
  </div>
</template>
<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { useOrgStore, usePageStore } from '@/stores'
import { size } from 'lodash'

import Select from '@/components/Select.vue'
import Option from '@/components/Option.vue'
import Loading from '@/components/Loading.vue'

const orgStore = useOrgStore()
const pageStore = usePageStore()

// nạp dữ liệu tổ chức hiện tại khi component được mount
onMounted(getCurrentOrgInfo)

// nạp dữ liệu tổ chức hiện tại khi load toàn bộ danh sách tổ chức
watch(() => orgStore.list_org, getCurrentOrgInfo)

// nạp lại dữ liệu tổ chức khi có sự thay đổi tổ chức được chọn
watch(() => orgStore.selected_org_id, () => {
  // reset chọn page
  pageStore.selected_page_id_list = {}

  // nạp lại dữ liệu tổ chức
  getCurrentOrgInfo()
})

/**nạp dữ liệu của tổ chức hiện tại được chọn */
function getCurrentOrgInfo() {
  // nếu chưa có danh sách tổ chức thì không làm gì cả
  if (!size(orgStore.list_org)) return

  // nếu chưa có tổ chức nào được chọn thì chọn tổ chức đầu tiên
  if (!orgStore.selected_org_id)
    orgStore.selected_org_id = orgStore.list_org?.[0]?.org_id

  // nạp dữ liệu của tổ chức hiện tại được chọn từ danh sách tổ chức
  orgStore.selected_org_info = orgStore.list_org?.find(
    org => org.org_id === orgStore.selected_org_id
  )
}
</script>
