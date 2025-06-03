<template>
  <div
    id="org-item__org-page"
    class="bg-white rounded-b-lg flex flex-col gap-3"
  >
    <template v-for="(group, key) of grouped_page_list">
      <div class="flex flex-col gap-0.5">
        <div class="flex gap-1 items-center rounded bg-slate-100 px-1 py-0.5">
          <PageTypeIcon
            :page_type="key as PageType"
            class="size-3"
          />
          <p class="text-xs font-medium">
            {{ $t(`v1.common.${key?.toLocaleLowerCase()}`) }}
          </p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-y-0.5 gap-x-6">
          <PageItem
            v-for="page of group"
            @select_page="triggerSelectPage"
            @sort_list_page="$emit('sort_list_page')"
            :page_info="page?.page!"
            :page="page"
            :org_id
            container_class="!border-none"
          />
        </div>
      </div>
    </template>
  </div>
</template>
<script setup lang="ts">
import { KEY_ADVANCE_SELECT_AGE_FUNCT } from '@/views/Dashboard/SelectPage/symbol'
import { computed, inject } from 'vue'

import PageItem from '@/views/Dashboard/SelectPage/PageItem.vue'

import type {
  IPageType,
  PageData,
  PageType,
} from '@/service/interface/app/page'
import PageTypeIcon from '@/components/Avatar/PageTypeIcon.vue'

const $emit = defineEmits(['sort_list_page'])

const $props = withDefaults(
  defineProps<{
    /** id tổ chức */
    org_id?: string
  }>(),
  {}
)

/**xử lý khi trang được chọn ở chế độ nhiều */
const triggerSelectPage = inject(KEY_ADVANCE_SELECT_AGE_FUNCT)

/**danh sách page sau khi được lọc */
const active_page_list = defineModel<PageData[]>('active_page_list', {
  default: [],
})

/** danh sách được nhóm theo nền tảng */
const grouped_page_list = computed<Record<string, PageData[]>>(() => {
  let result: Record<string, PageData[]> = {}

  active_page_list.value.forEach(page => {
    console.log(page.page?.type)

    /** nền tảng của trang */
    const PAGE_TYPE = page.page?.type || ''

    // nếu không có thì thôi
    if (!PAGE_TYPE) return

    // thêm trang vào nền tảng tương ứng
    result[PAGE_TYPE] = [...(result[PAGE_TYPE] || []), page]
  })

  return result
})
</script>
