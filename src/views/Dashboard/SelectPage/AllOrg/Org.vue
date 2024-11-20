<template>
  <div
    :class="{
      'opacity-50':
        orgStore.selected_org_id !== org_id &&
        size(pageStore.selected_page_id_list) &&
        selectPageStore.is_group_page_mode,
    }"
    class="flex flex-col gap-2.5"
  >
    <OrgTitle :org_id />
    <OrgPages :org_id />
  </div>
</template>
<script setup lang="ts">
import { useOrgStore, usePageStore, useSelectPageStore } from '@/stores'
import { size } from 'lodash'

import OrgTitle from '@/views/Dashboard/SelectPage/AllOrg/Org/OrgTitle.vue'
import OrgPages from '@/views/Dashboard/SelectPage/AllOrg/Org/OrgPages.vue'

const orgStore = useOrgStore()
const pageStore = usePageStore()
const selectPageStore = useSelectPageStore()

const $props = withDefaults(
  defineProps<{
    /** id tổ chức */
    org_id: string
  }>(),
  {}
)
</script>
