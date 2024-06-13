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
      <div class="text-sm font-medium">
        {{ title }}
      </div>
      <div
        v-if="filter === 'RECENT'"
        class="text-center text-blue-500 text-sm"
      >
        {{ $t('v1.common.upcoming_feature') }}
      </div>
      <div class="grid gap-6 grid-cols-4">
        <template v-for="page of active_page_list">
          <div
            @click="selectOnlyThisPage(page?.page?.fb_page_id)"
            v-if="page?.page?.type === filter"
            class="p-2 flex items-center gap-2 hover:bg-slate-100 rounded-lg cursor-pointer group"
          >
            <input
              v-if="is_active_checkbox"
              type="checkbox"
              class="custom-checkbox flex-shrink-0"
            />
            <PageAvatar
              :page_info="page?.page"
              class="w-8 h-8 flex-shrink-0"
            />
            <div class="w-full min-w-0">
              <div class="flex items-center gap-2">
                <div class="flex-grow min-w-0 flex gap-1 items-center">
                  <StarIcon
                    v-if="page.page?.is_priority"
                    class="w-3 h-3 flex-shrink-0"
                  />
                  <div class="truncate flex-grow min-w-0">
                    {{ page?.page?.name }}
                  </div>
                </div>
                <div class="flex-shrink-0">
                  <div class="items-center gap-2.5 hidden group-hover:flex">
                    <div
                      @click.stop="
                        togglePagePriority(
                          page.page?.fb_page_id,
                          !page.page?.is_priority
                        )
                      "
                    >
                      <StarIcon v-if="page.page?.is_priority" />
                      <StarOutlineIcon v-else />
                    </div>
                    <MinusOutlineIcon
                      @click.stop="inactivePage(page.page?.fb_page_id)"
                      v-tooltip="
                        $t('v1.view.main.dashboard.select_page.cancel_page')
                      "
                    />
                  </div>
                  <span
                    v-if="!isActivePage(page?.page)"
                    class="text-xs text-red-500 group-hover:hidden"
                  >
                    {{ $t('v1.common.expired') }}
                  </span>
                </div>
              </div>
              <div class="flex items-center gap-1">
                <PageTypeIcon
                  :page_type="page?.page?.type"
                  class="flex-shrink-0"
                />
                <div class="text-xs text-slate-500 flex-grow truncate min-w-0">
                  {{ page?.page?.fb_page_id }}
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { usePageStore, useSelectPageStore, useCommonStore } from '@/stores'
import { isActivePage } from '@/service/helper/pricing'
import { preGoToChat } from '@/service/function'
import { useRouter } from 'vue-router'
import { ref, watch, type Component } from 'vue'
import { map, set } from 'lodash'
import { nonAccentVn } from '@/service/helper/format'
import { update_page } from '@/service/api/chatbox/n4-service'
import { confirm } from '@/service/helper/alert'
import { useI18n } from 'vue-i18n'
import { flow } from '@/service/helper/async'

import PageAvatar from '@/components/Avatar/PageAvatar.vue'
import PageTypeIcon from '@/components/Avatar/PageTypeIcon.vue'

import StarIcon from '@/components/Icons/Star.vue'
import StarOutlineIcon from '@/components/Icons/StarOutline.vue'
import MinusOutlineIcon from '@/components/Icons/MinusOutline.vue'

import type { PageData, PageType } from '@/service/interface/app/page'
import type { CbError } from '@/service/interface/function'

const $props = withDefaults(
  defineProps<{
    /**tiêu đề của nền tảng */
    title: string
    /**icon của nền tảng */
    icon: Component
    /**lọc hiển thị nền tảng */
    filter: string
    /**có hiển thị checkbox không */
    is_active_checkbox?: boolean
  }>(),
  {}
)

const { t: $t } = useI18n()
const pageStore = usePageStore()
const $router = useRouter()
const selectPageStore = useSelectPageStore()
const commonStore = useCommonStore()

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

/**huỷ kích hoạt page này | ẩn page */
function inactivePage(page_id?: string) {
  flow(
    [
      // * hỏi trước khi thực hiện hành động
      (cb: CbError) =>
        confirm(
          'question',
          $t('v1.view.main.dashboard.select_page.inactive_page.title'),
          '',
          (e, r) => {
            if (e) return

            cb()
          }
        ),
      // * kích hoạt loading
      (cb: CbError) => {
        commonStore.is_loading_full_screen = true

        cb()
      },
      // * call api update page
      (cb: CbError) =>
        update_page({ page_id, is_active: false }, (e, r) => {
          if (e) return cb(e)

          cb()
        }),
      // * xoá page bị ẩn khỏi danh sách page và danh sách page đang chọn (nếu có)
      (cb: CbError) => {
        if (!page_id) return cb()

        delete pageStore.active_page_list[page_id]

        delete pageStore.selected_page_id_list[page_id]

        sortListPage()

        cb()
      },
    ],
    e => {
      // tắt loading
      commonStore.is_loading_full_screen = false
    }
  )
}
/**đánh dấu sao page ưu tiên lên đầu */
function togglePagePriority(page_id?: string, is_priority?: boolean) {
  flow(
    [
      // * call api update page
      (cb: CbError) =>
        update_page({ page_id, is_priority }, (e, r) => {
          if (e) return cb(e)

          cb()
        }),
      // * sort lại danh sách page
      (cb: CbError) => {
        if (!page_id) return cb()

        cb()

        set(
          pageStore.active_page_list,
          [page_id, 'page', 'is_priority'],
          is_priority
        )

        sortListPage()
      },
    ],
    undefined,
    true
  )
}
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
/**chỉ chọn 1 page này để chat */
function selectOnlyThisPage(page_id?: string) {
  if (!page_id) return

  let temp: {
    [index: string]: boolean
  } = {}

  temp[page_id] = true

  pageStore.selected_page_id_list = temp

  preGoToChat(() => $router.push('/chat'))
}
</script>
<style scoped lang="scss">
.custom-checkbox {
  @apply appearance-none w-4 h-4 shadow-sm bg-white border-[1.5px] border-black rounded relative cursor-pointer;

  &:checked {
    @apply bg-black;

    &::after {
      content: '';
      @apply absolute border-white top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-45 border-r-2 border-b-2 w-1 h-2;
    }
  }

  &:disabled {
    @apply cursor-not-allowed border-gray-200 bg-gray-100;

    &::after {
      @apply border-gray-200;
    }
  }
}
</style>
