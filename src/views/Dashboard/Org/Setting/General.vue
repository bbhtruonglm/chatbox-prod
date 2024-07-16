<template>
  <CardItem>
    <template #icon>
      <CogIcon class="w-5 h-5" />
    </template>
    <template #title>
      {{ $t('v1.view.main.dashboard.org.setting.title') }}
    </template>
    <template #item>
      <Toggle
        v-model="org_is_active_2fa"
        class_toggle="peer-checked:bg-black"
      >
        {{ $t('v1.view.main.dashboard.org.setting.require_two_factor') }}
      </Toggle>
    </template>
  </CardItem>
</template>
<script setup lang="ts">
import { useOrgStore } from '@/stores'
import { computed } from 'vue'
import { set } from 'lodash'

import CardItem from '@/components/Main/Dashboard/CardItem.vue'
import Toggle from '@/components/Toggle.vue'

import CogIcon from '@/components/Icons/Cog.vue'
import { update_org } from '@/service/api/chatbox/billing'

const orgStore = useOrgStore()

/**có kích hoạt 2fa không */
const org_is_active_2fa = computed({
  get() {
    // lấy dữ liệu từ store
    return orgStore.selected_org_info?.org_config?.org_is_active_2fa
  },
  set(val) {
    // set dữ liệu vào store
    set(orgStore, 'selected_org_info.org_config.org_is_active_2fa', val)

    // gọi api update
    updateOrg()
  },
})

/**update thông tin org lên server */
async function updateOrg() {
  // nếu chưa chọn org thì thôi
  if (!orgStore.selected_org_id) return

  // gọi api update
  orgStore.selected_org_info = await update_org(orgStore.selected_org_id, {
    org_config: {
      org_is_active_2fa: org_is_active_2fa.value,
    },
  })
}
</script>
