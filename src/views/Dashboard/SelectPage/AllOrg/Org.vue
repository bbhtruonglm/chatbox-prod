<template>
  <CardItem
    v-if="active_page_list?.length"
    id="all-org__org-item"
    :class="{
      'opacity-50':
        orgStore.selected_org_id !== org_id &&
        size(pageStore.selected_page_id_list) &&
        selectPageStore.is_group_page_mode,
    }"
    class="group/org-item"
  >
    <template #icon>
      <img
        v-if="pageStore.map_orgs?.map_org_info?.[org_id]?.org_info?.org_avatar"
        :src="pageStore.map_orgs?.map_org_info?.[org_id]?.org_info?.org_avatar"
        class="w-5 h-5 rounded-oval"
      />
      <BriefCaseIcon
        v-else
        class="w-5 h-5 text-slate-700"
      />
    </template>
    <template #title>
      {{ pageStore.map_orgs?.map_org_info?.[org_id]?.org_info?.org_name }}
    </template>
    <template #action>
      <OrgTitleAction
        v-model:selected_platform="selected_platform"
        :org_id
        :active_page_list
      />
    </template>
    <template #item>
      <OrgPages
        @sort_list_page="$main.getListPage"
        v-model:active_page_list="active_page_list"
      />
    </template>
  </CardItem>
</template>
<script setup lang="ts">
import { useOrgStore, usePageStore, useSelectPageStore } from '@/stores'
import { size } from 'lodash'
import { inject, onMounted, ref, watch } from 'vue'
import { KEY_SORT_LIST_PAGE_FUNCT } from '../symbol'

import CardItem from '@/components/Main/Dashboard/CardItem.vue'
import OrgTitleAction from '@/views/Dashboard/SelectPage/AllOrg/Org/OrgTitleAction.vue'
import OrgPages from '@/views/Dashboard/SelectPage/AllOrg/Org/OrgPages.vue'

import BriefCaseIcon from '@/components/Icons/BriefCase.vue'

import type { ISelectPlatform } from '../type'
import type { PageData } from '@/service/interface/app/page'

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

/**hàm sort lại danh sách trang của component cha */
const sortListPage = inject(KEY_SORT_LIST_PAGE_FUNCT)

/**lọc theo nền tảng */
const selected_platform = ref<ISelectPlatform>('ALL_PLATFORM')
/**danh sách page sau khi được lọc */
const active_page_list = ref<PageData[]>()

class Main {
  /**sắp xếp page gắn sao lên đầu */
  getListPage() {
    // lọc ra các page thuộc về nhóm này
    active_page_list.value = sortListPage?.()?.filter(this.isVisible.bind(this))
  }
  /**có hiển thị trang không */
  isVisible(page?: PageData): boolean {
    // không có page thì không hiển thị
    if (!page?.page?.fb_page_id) return false

    // chỉ hiển thị trang của tổ chức này
    if (
      !pageStore.map_orgs?.map_org_page?.[$props.org_id]?.[
        page?.page?.fb_page_id
      ]
    )
      return false

    /**giá trị nền tảng đang được chọn */
    let current_selected_platform = selected_platform.value

    // nếu menu chọn tổng không phải là tất cả thì ghi đè theo menu ngoài
    if (selectPageStore.current_menu !== 'ALL_PLATFORM')
      current_selected_platform = selectPageStore.current_menu

    // nếu chọn nền tảng cụ thể mà trang không thuộc nền tảng đó thì không hiển thị
    if (
      current_selected_platform !== 'ALL_PLATFORM' &&
      page?.page?.type !== current_selected_platform
    )
      return false

    // cho phép hiển thị
    return true
  }
}
const $main = new Main()

// load danh sách trang khi component được tạo
onMounted(() => $main.getListPage())

// lọc danh sách page khi được tìm kiếm
watch(
  () => selectPageStore.search,
  () => $main.getListPage()
)
// nạp lại danh sách page thì có thay đổi
watch(
  () => pageStore.active_page_list,
  () => $main.getListPage()
)
// thay đổi nền tảng ở trong
watch(
  () => selected_platform.value,
  () => $main.getListPage()
)
// thay đổi nền tảng ở ngoài
watch(
  () => selectPageStore.current_menu,
  () => $main.getListPage()
)
// khi có dữ liệu tổ chức-page
watch(
  () => pageStore.map_orgs,
  () => $main.getListPage()
)
</script>
