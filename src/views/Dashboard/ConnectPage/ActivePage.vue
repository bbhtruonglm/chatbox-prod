<template>
  <EmptyActive v-if="!size(list_new_page)" />
  <template v-else>
    <div class="h-full p-2 overflow-y-auto flex flex-col gap-2.5">
      <div class="grid grid-cols-2 gap-x-6 gap-y-2.5">
        <template v-for="page of list_new_page">
          <PageItem
            @click="selectPage(page?.page?.fb_page_id)"
            v-if="page?.page?.fb_page_id && filterPage(page)"
            v-model:checkbox="list_selected_page_id[page?.page?.fb_page_id]"
            :checkbox_is_visible="true"
            :page_info="page?.page"
            class="cursor-pointer"
          >
          </PageItem>
        </template>
      </div>
      <div class="flex items-center gap-2.5">
        <div class="flex-grow">
          <hr />
        </div>
        <div class="flex-shrink-0 text-xs font-medium text-slate-500">
          {{ $t('v1.view.main.dashboard.select_platform.another_page') }}
        </div>
        <div class="flex-grow">
          <hr />
        </div>
      </div>
      <div class="grid grid-cols-2 gap-x-6 gap-y-2.5">
        <template v-for="page of list_new_page">
          <PageItem
            @click="selectPage(page?.page?.fb_page_id)"
            v-if="page?.page?.fb_page_id && filterPage(page)"
            v-model:checkbox="list_selected_page_id[page?.page?.fb_page_id]"
            :checkbox_is_visible="true"
            :page_info="page?.page"
            class="cursor-pointer"
          >
          </PageItem>
        </template>
      </div>
    </div>
    <div class="flex-shrink-0 flex justify-end p-2 border-t">
      <Button
        @click="activePage"
        :class="
          countPageSelect()
            ? 'bg-blue-700 text-white'
            : 'cursor-not-allowed bg-slate-200 text-slate-500'
        "
      >
        {{ $t('v1.view.main.dashboard.select_platform.active_page') }}
      </Button>
    </div>
  </template>
</template>
<script setup lang="ts">
import { inject, onMounted, ref } from 'vue'
import { useCommonStore, useConnectPageStore } from '@/stores'
import { filter, map, size } from 'lodash'
import {
  get_current_active_page,
  update_page,
} from '@/service/api/chatbox/n4-service'
import { eachOfLimit } from 'async'
import { KEY_TOGGLE_MODAL_FUNCT } from '@/views/Dashboard/ConnectPage/symbol'
import { KEY_LOAD_LIST_PAGE_FUNCT } from '@/views/Dashboard/symbol'

import Button from '@/views/Dashboard/ConnectPage/Button.vue'
import PageItem from '@/components/Main/Dashboard/PageItem.vue'
import EmptyActive from '@/views/Dashboard/ConnectPage/ActivePage/EmptyActive.vue'

import type { PageData, PageList } from '@/service/interface/app/page'
import { nonAccentVn } from '@/service/helper/format'

const connectPageStore = useConnectPageStore()
const commonStore = useCommonStore()

/**ẩn hiện modal kết nối nền tảng */
const toggleModal = inject(KEY_TOGGLE_MODAL_FUNCT)
/**lấy danh sách trang đã kích hoạt */
const loadListPage = inject(KEY_LOAD_LIST_PAGE_FUNCT)

/**danh sách các trang mới */
const list_new_page = ref<PageData[]>([])
/**danh sách các trang ở tổ chức khác */
const list_old_page = ref<PageData[]>([])
/**danh sách id các page đã chọn */
const list_selected_page_id = ref<Record<string, boolean>>({})

// lấy danh sách page mới
onMounted(() => getListWattingPage())

/**hiển thị các page theo tìm kiếm */
function filterPage(page: PageData) {
  // nếu không có giá trị tìm kiếm thì luôn hiển thị
  if (!connectPageStore.search) return true

  /**giá trị tìm kiếm đã được xử lý */
  const SEARCH = nonAccentVn(connectPageStore.search)

  return (
    page?.page?.fb_page_id?.includes(SEARCH) ||
    nonAccentVn(page?.page?.name || '')?.includes(SEARCH)
  )
}
/**kích hoạt các trang được chọn */
async function activePage() {
  // nếu không có trang nào được chọn thì bỏ qua
  if (!countPageSelect()) return

  // hiển thị loading
  commonStore.is_loading_full_screen = true

  try {
    // lặp qua từng trang được chọn
    await eachOfLimit(
      list_selected_page_id.value,
      1,
      (value, page_id, next) => {
        // nếu trang không được chọn thì bỏ qua
        if (!value) return next()

        // kích hoạt trang
        update_page(
          {
            page_id: page_id as string,
            is_active: true,
          },
          (e, r) => {
            if (e) return next(e)

            next()
          }
        )
      }
    )

    // làm mới danh sách trang được chọn
    list_selected_page_id.value = {}

    // tắt modal kết nối nền tảng
    await toggleModal?.()

    // nạp lại danh sách trang đã được kích hoạt ở UI chọn page
    await loadListPage?.()
  } catch (e) {}

  // ẩn loading
  commonStore.is_loading_full_screen = false
}
/**tính toán ra danh sách page mới và page không có quyền truy cập */
async function getListWattingPage() {
  // hiển thị loading
  connectPageStore.is_loading = true

  try {
    // xóa toàn bộ danh sách trang
    list_new_page.value = []
    list_old_page.value = []

    /**toàn bộ các trang của người dùng */
    const LIST_PAGE: PageList = await new Promise((resolve, reject) =>
      get_current_active_page({}, (e, r) => {
        if (e) return reject(e)

        resolve(r.page_list)
      })
    )

    // lặp qua toàn bộ danh sách page của người dùng
    map(LIST_PAGE, page => {
      // TODO lọc ra trang đã kích hoạt nhưng ở gói khác

      // nếu trang đã được kích hoạt rồi thì bỏ qua
      if (page.page?.is_active) return

      // thêm trang chưa kích hoạt vào danh sách
      list_new_page.value.push(page)
    })
  } catch (e) {}

  // ẩn loading
  connectPageStore.is_loading = false
}
/**toggle trang */
function selectPage(page_id: string) {
  list_selected_page_id.value[page_id] = !list_selected_page_id.value[page_id]
}
/**đếm số trang đang chọn */
function countPageSelect() {
  /**lọc ra danh sách id các trang đang chọn */
  const LIST_SELECT_PAGE_ID = filter(
    list_selected_page_id.value,
    value => value
  )

  // trả về số lượng id trang đang chọn
  return size(LIST_SELECT_PAGE_ID)
}
</script>
