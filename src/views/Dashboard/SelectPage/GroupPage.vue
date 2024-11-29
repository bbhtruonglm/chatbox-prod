<template>
  <CardItem v-if="filterPlatform()">
    <template #icon>
      <component
        #icon
        :is="icon"
        class="w-5 h-5"
      />
    </template>
    <template #title>
      {{ title }}
    </template>
    <template
      v-if="!orgStore.is_selected_all_org"
      #action
    >
      <label
        v-if="selectPageStore.is_group_page_mode"
        class="flex items-center gap-1 px-6 cursor-pointer"
      >
        <div class="font-medium text-sm">
          {{ $t('v1.view.main.dashboard.select_page.select_all_page') }}
        </div>
        <Checkbox v-model="is_select_all_page" />
      </label>
    </template>
    <template #item>
      <div class="grid gap-6 grid-cols-4">
        <template v-for="page of active_page_list">
          <PageItem
            v-if="page?.page"
            @select_page="$emit('select_page', page)"
            @sort_list_page="getListPage"
            :page_info="page?.page"
            :page="page"
            :filter="filter"
          />
        </template>
      </div>
    </template>
  </CardItem>
  <EmptyPage
    v-else-if="selectPageStore.current_menu === filter"
    :tab
  />
</template>
<script setup lang="ts">
import { useOrgStore, usePageStore, useSelectPageStore } from '@/stores'
import { ref, watch, computed, onMounted, inject } from 'vue'
import { useI18n } from 'vue-i18n'
import { KEY_SORT_LIST_PAGE_FUNCT } from '@/views/Dashboard/SelectPage/symbol'

import PageItem from '@/views/Dashboard/SelectPage/PageItem.vue'
import Checkbox from '@/components/Checkbox.vue'
import EmptyPage from '@/views/Dashboard/SelectPage/EmptyPage.vue'
import CardItem from '@/components/Main/Dashboard/CardItem.vue'

import type { IPage, PageData } from '@/service/interface/app/page'
import type { Component } from 'vue'

const $emit = defineEmits(['select_page'])

const $props = withDefaults(
  defineProps<{
    /**tiêu đề của nền tảng */
    title: string
    /**icon của nền tảng */
    icon: Component
    /**lọc hiển thị nền tảng */
    filter: string
    /**tab được chọn khi mở modal kết nối page */
    tab?: string
    /**hàm lọc trang nâng cao */
    advancedFilter?: (page: PageData) => boolean
  }>(),
  {}
)

const { t: $t } = useI18n()
const pageStore = usePageStore()
const selectPageStore = useSelectPageStore()
const orgStore = useOrgStore()

/**hàm sort lại danh sách trang của component cha */
const sortListPage = inject(KEY_SORT_LIST_PAGE_FUNCT)

/**danh sách page sau khi được lọc */
const active_page_list = ref<PageData[]>()

/**tính toán xem toàn bộ page của group này có được chọn không */
const is_select_all_page = computed({
  /**tính toán xem toàn bộ page của group này có được chọn không */
  get() {
    /**số page được chọn */
    let count_selected_page = 0
    /**số page của nhóm này */
    let total_page_of_group = 0

    // lặp qua toàn bộ các trang của nhóm
    loopPageOfGroup(page => {
      // tăng số lượng page của nhóm
      total_page_of_group++

      // nếu page này được chọn thì tăng số lượng page được chọn
      if (pageStore.isSelectedPage(page?.fb_page_id)) count_selected_page++
    })

    // nếu không có page nào trong nhóm thì coi là không chọn
    if (!total_page_of_group) return false

    // tính toán xem có phải toàn bộ page trong group này được chọn không
    return count_selected_page === total_page_of_group
  },
  /**chọn | huỷ chọn toàn bộ page của group này */
  set(newValue) {
    // lặp qua toàn bộ các trang của nhóm
    loopPageOfGroup(page => {
      // chọn hoặc huỷ chọn page
      pageStore.setPageSelected(page?.fb_page_id, newValue)
    })
  },
})

// load danh sách trang khi component được tạo
onMounted(() => getListPage())

// lọc danh sách page khi được tìm kiếm
watch(
  () => selectPageStore.search,
  () => getListPage()
)
// nạp lại danh sách page thì có thay đổi
watch(
  () => pageStore.active_page_list,
  () => getListPage()
)
// nạp lại danh sách page thì có thay đổi ở trang toàn bộ tổ chức
watch(
  () => pageStore.map_orgs,
  () => getListPage()
)

/**lặp qua từng trang của nhóm */
function loopPageOfGroup(proceed: (page?: IPage) => void) {
  active_page_list.value?.forEach(page => {
    // bỏ qua các trang không thoả mãn
    if (
      // chỉ xử lý các trang trong nhóm
      page?.page?.type !== $props.filter
      // ||
      // // chỉ xử lý các page còn hạn sử dụng
      // !isActivePage(page?.page)
    )
      return

    // cb các page thuộc về nhóm
    proceed(page?.page)
  })
}
/**sắp xếp page gắn sao lên đầu */
function getListPage() {
  /**có phải là nhóm gần đây không */
  const IS_RECENT = $props.filter === 'RECENT'

  /**các trang của nhóm này */
  let pages = sortListPage?.()?.filter(
    page =>
      // nếu là các page gần đây thì tạm thời không lọc
      IS_RECENT ||
      // lọc ra các page thuộc về nhóm này
      page?.page?.type === $props.filter
  )

  // nếu có hàm lọc trang nâng cao thì lọc tiếp
  if ($props.advancedFilter) pages = pages?.filter($props.advancedFilter)

  // nếu là nhóm gần đây thì chỉ lấy 4 trang
  if (IS_RECENT) pages = pages?.slice(0, 4)

  // lưu lại danh sách page
  active_page_list.value = pages
}
/**chỉ hiện các group page được chọn */
function filterPlatform(): boolean {
  // nếu không có page nào thì không hiển thị
  if (!active_page_list.value?.length) return false

  // nếu là chọn toàn bộ nền tảng thì cho hiển thị
  if (selectPageStore.current_menu === 'ALL_PLATFORM') return true

  // nếu không phải chọn đúng nhóm mới được hiển thị
  return selectPageStore.current_menu === $props.filter
}
</script>
