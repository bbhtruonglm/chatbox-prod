<template>
  <div
    class="bg-white rounded-lg py-1.5 px-3 flex justify-between gap-2 sticky top-0 z-10"
  >
    <div class="flex items-center gap-3">
      <div class="flex items-center gap-1 flex-shrink-0">
        <BriefCaseIcon class="w-5 h-5 text-slate-700" />
        <div class="text-sm font-medium">
          {{ pageStore.map_orgs?.map_org_info?.[org_id]?.org_info?.org_name }}
        </div>
      </div>
      <template v-if="selectPageStore.current_menu === 'ALL_PLATFORM'">
        <GripIcon class="w-5 h-5 text-slate-500 flex-shrink-0" />
        <div
          class="flex items-center gap-2 divide-x min-w-0 flex-grow overflow-x-auto"
        >
          <PageCount
            @click="model_selected_platform = 'ALL_PLATFORM'"
            :icon="SquareIcon"
            :title="$t('v1.common.all')"
            :count="count_total_page"
            :is_active="model_selected_platform === 'ALL_PLATFORM'"
            class="pr-2"
          />
          <PageCount
            v-for="platform of PLATFORMS"
            @click="model_selected_platform = platform"
            :icon="ICON_MAP?.[platform || ''] || SquareIcon"
            :title="$t(`v1.common.${platform.toLowerCase()}`)"
            :count="count_platform_page?.[platform]"
            :is_active="model_selected_platform === platform"
            class="pl-2"
          />
        </div>
      </template>
    </div>
    <div
      v-if="
        orgStore.selected_org_id === org_id &&
        countSelectedPage() &&
        selectPageStore.is_group_page_mode
      "
      class="flex items-center gap-3 flex-shrink-0"
    >
      <div class="flex items-center gap-1 py-1 px-2 rounded-md bg-blue-700">
        <div class="font-medium text-xs text-white">
          {{ $t('v1.common.selected') }}
        </div>
        <div class="font-medium text-xs px-1 rounded bg-white">
          {{ countSelectedPage() }}
        </div>
      </div>
      <div
        @click="cancelSelectPage"
        class="flex items-center gap-1 rounded-md cursor-pointer text-slate-500"
      >
        <div class="font-medium text-xs">
          {{ $t('v1.common.deselect') }}
        </div>
        <CloseBoldIcon class="w-4 h-4" />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useOrgStore, usePageStore, useSelectPageStore } from '@/stores'
import { markRaw, onMounted, ref, type Component } from 'vue'

import PageCount from '@/views/Dashboard/SelectPage/AllOrg/Org/OrgTitle/PageCount.vue'

import BriefCaseIcon from '@/components/Icons/BriefCase.vue'
import GripIcon from '@/components/Icons/Grip.vue'
import SquareIcon from '@/components/Icons/Square.vue'
import FacebookIcon from '@/components/Icons/Facebook.vue'
import ZaloIcon from '@/components/Icons/Zalo.vue'
import WebIcon from '@/components/Icons/Web.vue'
import CloseBoldIcon from '@/components/Icons/CloseBold.vue'
import { keys, set, size, values } from 'lodash'
import type { ISelectPlatform } from '../../type'
import type { PageData } from '@/service/interface/app/page'

/** Icon mặc định */
const ICON_MAP: Record<string, Component> = {
  FB_MESS: markRaw(FacebookIcon),
  ZALO_OA: markRaw(ZaloIcon),
  WEBSITE: markRaw(WebIcon),
}
/** Danh sách các nền tảng */
const PLATFORMS = $env.platform

const $props = withDefaults(
  defineProps<{
    /**id tổ chức */
    org_id: string
  }>(),
  {}
)

/**nền tảng đang chọn */
const model_selected_platform =
  defineModel<ISelectPlatform>('selected_platform')

const pageStore = usePageStore()
const orgStore = useOrgStore()
const selectPageStore = useSelectPageStore()

/**tổng số trang của tổ chức này */
const count_total_page = ref<number>(
  size(pageStore.map_orgs?.map_org_page?.[$props.org_id])
)
/**đếm số trang của các nền tảng */
const count_platform_page = ref<Record<string, number>>({})

// đếm số trang của các nền tảng khi component được mount
onMounted(countPlatformPage)

/**đếm số trang của các nền tảng */
function countPlatformPage() {
  /**các id trang của tổ chức này */
  const PAGE_IDS = keys(pageStore.map_orgs?.map_org_page?.[$props.org_id])

  // lặp qua từng trang
  PAGE_IDS?.forEach(page_id => {
    /**loại nền tảng của trang */
    const TYPE = pageStore.active_page_list?.[page_id]?.page?.type

    // nếu không có loại nền tảng thì bỏ qua
    if (!TYPE) return

    /**số trang hiện tại của nền tảng */
    const CURRENT_COUNT = count_platform_page.value?.[TYPE] || 0

    // tăng số trang của nền tảng
    set(count_platform_page.value, [TYPE], CURRENT_COUNT + 1)
  })
}

/**hủy chọn toàn bộ các trang */
function cancelSelectPage() {
  pageStore.selected_page_id_list = {}
}
/**đếm số trang đã chọn */
function countSelectedPage() {
  return values(pageStore.selected_page_id_list)?.filter(Boolean)?.length
}
</script>
