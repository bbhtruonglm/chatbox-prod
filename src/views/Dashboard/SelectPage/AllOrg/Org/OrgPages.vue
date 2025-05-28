<template>
  <div
    id="org-item__org-page"
    class="bg-white rounded-b-lg grid grid-cols-1 md:grid-cols-4 gap-y-3 gap-x-6"
  >
    <template v-for="page of show_pages">
      <PageItem
        @select_page="triggerSelectPage"
        @sort_list_page="$emit('sort_list_page')"
        :page_info="page?.page!"
        :page="page"
        :org_id
      />
    </template>
  </div>
</template>
<script setup lang="ts">
import { useOrgStore, usePageManagerStore } from '@/stores'
import { KEY_ADVANCE_SELECT_AGE_FUNCT } from '@/views/Dashboard/SelectPage/symbol'
import { computed, inject } from 'vue'

import PageItem from '@/views/Dashboard/SelectPage/PageItem.vue'

import type { PageData } from '@/service/interface/app/page'
import { usePageManager } from '@/views/Dashboard/composables/usePageManager'

const $emit = defineEmits(['sort_list_page'])

const orgStore = useOrgStore()
const pageManagerStore = usePageManagerStore()

/** composable */
const { filterPageByGroup } = usePageManager()

const $props = withDefaults(
  defineProps<{
    /** id tổ chức */
    org_id?: string
  }>(),
  {}
)

/** danh sách các page được hiển thị */
const show_pages = computed(() =>
  filterPageByGroup(
    active_page_list.value,
    pageManagerStore.pape_to_group_map,
    orgStore.selected_org_group,
    $props.org_id
  )
)

/**xử lý khi trang được chọn ở chế độ nhiều */
const triggerSelectPage = inject(KEY_ADVANCE_SELECT_AGE_FUNCT)

/**danh sách page sau khi được lọc */
const active_page_list = defineModel<PageData[]>('active_page_list', {
  default: [],
})
</script>
