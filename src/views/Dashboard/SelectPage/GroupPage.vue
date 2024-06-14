<template>
  <div
    v-if="filterPlatform()"
    class="rounded-lg py-3 px-4 bg-white flex gap-3"
  >
    <component
      :is="icon"
      class="flex-shrink-0 w-5 h-5"
    />
    <div class="flex flex-col gap-3 w-full">
      <div class="flex justify-between">
        <div class="text-sm font-medium">
          {{ title }}
        </div>
        <label
          v-if="selectPageStore.is_group_page_mode"
          class="flex items-center gap-1 px-6 cursor-pointer"
        >
          <div class="font-medium text-sm">
            {{ $t('v1.view.main.dashboard.select_page.select_all_page') }}
          </div>
          <!-- v-model="" isSelectAllGroup() -->
          <Checkbox  />
        </label>
      </div>
      <div
        v-if="filter === 'RECENT'"
        class="text-center text-blue-500 text-sm"
      >
        {{ $t('v1.common.upcoming_feature') }}
      </div>
      <div class="grid gap-6 grid-cols-4">
        <template v-for="page of active_page_list">
          <PageItem
            v-if="page?.page"
            :page_info="page?.page"
            :filter="filter"
          />
        </template>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { usePageStore, useSelectPageStore } from '@/stores'
import { ref, watch, provide } from 'vue'
import { map } from 'lodash'
import { nonAccentVn } from '@/service/helper/format'
import { useI18n } from 'vue-i18n'
import { KEY_SORT_LIST_PAGE_FUNCT } from '@/views/Dashboard/SelectPage/symbol'

import PageItem from '@/views/Dashboard/SelectPage/PageItem.vue'
import Checkbox from '@/components/Checkbox.vue'

import type { PageData, PageType } from '@/service/interface/app/page'
import type { Component } from 'vue'

const $props = withDefaults(
  defineProps<{
    /**tiêu đề của nền tảng */
    title: string
    /**icon của nền tảng */
    icon: Component
    /**lọc hiển thị nền tảng */
    filter: string
  }>(),
  {}
)

const { t: $t } = useI18n()
const pageStore = usePageStore()
const selectPageStore = useSelectPageStore()

/**danh sách page sau khi được lọc */
const active_page_list = ref<PageData[]>()

// lọc danh sách page khi được tìm kiếm
watch(
  () => selectPageStore.search,
  () => {
    // kích hoạt loading
    selectPageStore.is_loading = true

    sortListPage()
  }
)
// nạp lại danh sách page thì có thay đổi
watch(
  () => pageStore.active_page_list,
  () => sortListPage()
)

/**sắp xếp page gắn sao lên đầu */
function sortListPage() {
  // object -> array
  let array_page_list = map(pageStore.active_page_list, page_data => {
    // tạo data key cho vitual scroll
    page_data.data_key = page_data.page?.fb_page_id

    return page_data
  })

  /**
   * lọc các page phù hợp điều kiện tìm kiếm
   * - tìm kiếm theo tên hoặc id
   */
  array_page_list = array_page_list.filter(page_data => {
    // chuyển dữ liệu tìm kiếm về tiếng việt không dấu
    let formated_page_name = nonAccentVn(page_data.page?.name || '')
    let page_id = page_data.page?.fb_page_id || ''
    let formated_search_value = nonAccentVn(selectPageStore.search)

    // tìm kiếm theo tên hoặc id
    if (
      formated_page_name.includes(formated_search_value) ||
      page_id.includes(formated_search_value)
    )
      return true

    return false
  })

  /**
   * sắp xếp lại mảng theo quy tắc:
   * - ưu tiên sắp xếp các page được chọn trước
   * - sau đó sắp xếp theo các page được đánh dấu sao
   */
  let sort_priority_page_list = array_page_list.sort((page_a, page_b) => {
    /**sắp xếp các page có gắn dấu sao */
    const sortPriority = () => {
      const priority_a = page_a.page?.is_priority
      const priority_b = page_b.page?.is_priority

      // nếu cả 2 page đều gắn dấu sao thì giữ nguyên vị trí
      if (priority_a && priority_b) return 0

      // nếu chỉ page 1 gắn dấu sao thì ưu tiên page 1
      if (priority_a) return 1

      // nếu chỉ page 2 gắn dấu sao thì ưu tiên page 2
      if (priority_b) return -1

      // nếu không có page nào gắn sao thì giữ nguyên vị trí
      return 0
    }

    /**sắp xếp các page được chọn */
    const sortPageIsSelected = () => {
      // const selected_a =
      //   pageStore.selected_page_id_list?.[page_a.page?.fb_page_id || '']
      // const selected_b =
      //   pageStore.selected_page_id_list?.[page_b.page?.fb_page_id || '']

      // // nếu cả 2 page được chọn thì tính dấu sao
      // if (selected_a && selected_b) return sortPriority()

      // // nếu chỉ page 1 được chọn thì chọn page 1
      // if (selected_a) return 1

      // // nếu chỉ page 2 được chọn thì chọn page 2
      // if (selected_b) return -1

      // nếu không có page nào được chọn thì tính độ ưu tiên
      return sortPriority()
    }

    return sortPageIsSelected()
  })

  // đảo chiều mảng, vì hàm sort chạy theo ASC
  let reverse_page_list = sort_priority_page_list.reverse()

  active_page_list.value = reverse_page_list
}
/**chỉ hiện các group page được chọn */
function filterPlatform(): boolean {
  return (
    // nếu là chọn toàn bộ nền tảng thì cho hiển thị
    selectPageStore.current_menu === 'ALL_PLATFORM' ||
    // nếu không phải chọn đúng mới được hiển thị
    selectPageStore.current_menu === $props.filter
  )
}
/**tính toán có phải toàn bộ page trong group này được chọn không */
function isSelectAllGroup() {
  return true
}

// xuất hàm cho các component con sử dụng
provide(KEY_SORT_LIST_PAGE_FUNCT, sortListPage)
</script>
