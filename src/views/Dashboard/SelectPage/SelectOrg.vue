<template>
  <div class="flex items-center gap-3">
    <Select
      v-model="selected_org_id"
      :filter_off="true"
      :placeholder="$t('v1.view.main.dashboard.select_page.select_org')"
      class="w-60 text-slate-700"
    >
      <Option value="ALL_ORG">
        {{ $t('v1.view.main.dashboard.select_page.all_org') }}
      </Option>
      <Option
        v-for="org of list_org"
        :value="org.org_id"
      >
        {{ org.org_name }}
      </Option>
    </Select>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'

import Select from '@/components/Select.vue'
import Option from '@/components/Option.vue'

/**dữ liệu của tổ chức */
interface OrgInfo {
  /**id của tổ chức */
  org_id?: number
  /**tên tổ chức */
  org_name?: string
}

/**dữ liệu fake của 1 tổ chức */
const FAKE_ORG: OrgInfo = {
  org_id: 1,
  org_name: 'Tổ chức của bạn',
}
/**danh sách các tổ chức của user này */
const list_org = ref<OrgInfo[]>([FAKE_ORG, FAKE_ORG, FAKE_ORG])
/**id của tổ chức đang được chọn */
const selected_org_id = ref('ALL_ORG')
</script>
