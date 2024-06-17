<template>
  <div
    v-if="!list_invite_page?.length"
    class="flex flex-col justify-center items-center gap-2.5 h-full"
  >
    <div class="p-4 bg-gray-100 rounded-full">
      <LayerIcon class="w-7 h-7 text-slate-700" />
    </div>
    <div class="font-semibold">
      {{ $t('v1.view.main.dashboard.select_platform.empty_invite') }}
    </div>
    <div class="text-sm text-slate-700 text-center w-[480px]">
      {{ $t('v1.view.main.dashboard.select_platform.empty_invite_guild') }}
    </div>
  </div>
  <template v-else>
    <div class="h-full p-2 overflow-y-auto">
      <div class="grid grid-cols-2 gap-x-6 gap-y-2.5">
        <template v-for="page of list_invite_page">
          <PageItem
            @click="selectPage(page?.page?.fb_page_id)"
            v-if="page?.page?.fb_page_id"
            v-model:checkbox="list_selected_page_id[page?.page?.fb_page_id]"
            :checkbox_is_visible="true"
            :page_info="page?.page"
            class="cursor-pointer"
          >
          </PageItem>
        </template>
      </div>
    </div>
    <div class="flex-shrink-0 flex justify-between p-2 border-t">
      <Button class="bg-red-100 text-red-500">
        {{ $t('v1.view.main.dashboard.select_platform.denied') }}
      </Button>
      <Button
        :class="{
          'contrast-50 cursor-not-allowed': !countPageSelect(),
        }"
        class="bg-black text-white"
      >
        {{ $t('v1.view.main.dashboard.select_platform.accept') }}
      </Button>
    </div>
  </template>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { usePageStore } from '@/stores'
import { filter, map, size, take } from 'lodash'

import LayerIcon from '@/components/Icons/Layer.vue'
import Button from '@/views/Dashboard/ConnectPage/Button.vue'
import PageItem from '@/components/Main/Dashboard/PageItem.vue'

import type { PageData, PageInfo } from '@/service/interface/app/page'

const pageStore = usePageStore()

/**danh sách id trang gửi lời mời */
const list_invite_page = ref<PageData[]>()
/**danh sách id các page đã chọn */
const list_selected_page_id = ref<Record<string, boolean>>({})

onMounted(() => {
  // TODO fake tạm 3 page đầu tiên vào danh sách page được mời
  list_invite_page.value = take<PageData>(map(pageStore.active_page_list), 3)
})

/**toggle trang */
function selectPage(page_id: string) {
  list_selected_page_id.value[page_id] = !list_selected_page_id.value[page_id]
}
/**đếm số trang đang chọn */
function countPageSelect() {
  /**danh sách id các trang đang chọn */
  const LIST_SELECT_PAGE_ID = filter(
    list_selected_page_id.value,
    (value, page_id) => value
  )

  return size(LIST_SELECT_PAGE_ID)
}
</script>
