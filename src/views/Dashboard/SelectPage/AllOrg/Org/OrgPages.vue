<template>
  <div
    id="org-item__org-page"
    class="bg-white rounded-b-lg  grid grid-cols-1 md:grid-cols-4 gap-y-3 gap-x-6"
  >
    <template v-for="page of active_page_list">
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
import { KEY_ADVANCE_SELECT_AGE_FUNCT } from '@/views/Dashboard/SelectPage/symbol'
import { computed, inject } from 'vue'

import PageItem from '@/views/Dashboard/SelectPage/PageItem.vue'

import type { PageData } from '@/service/interface/app/page'
// import { useOrgStore } from '@/stores';

const $emit = defineEmits(['sort_list_page'])

// const orgStore = useOrgStore()

const $props = withDefaults(
  defineProps<{
    /** id tổ chức */
    org_id?: string
  }>(),
  {}
)

// const show_pages = computed(() => {
//   return active_page_list.value?.filter(page => {
//     return page?.group_admin_id === $props.org_id
//   })
// })

/**xử lý khi trang được chọn ở chế độ nhiều */
const triggerSelectPage = inject(KEY_ADVANCE_SELECT_AGE_FUNCT)

/**danh sách page sau khi được lọc */
const active_page_list = defineModel<PageData[]>('active_page_list')
</script>
