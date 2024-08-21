<template>
  <EmptyActive v-if="!size(list_my_org_page) && !size(list_another_org_page)" />
  <template v-else>
    <div class="h-full p-2 overflow-y-auto flex flex-col gap-2.5">
      <div class="grid grid-cols-2 gap-x-6 gap-y-2.5">
        <template v-for="page of list_my_org_page">
          <PageItem
            @click="selectPage(page)"
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
        <template v-for="page of list_another_org_page">
          <PageItem
            @click="selectPage(page)"
            v-if="page?.page?.fb_page_id && filterPage(page)"
            v-model:checkbox="list_selected_page_id[page?.page?.fb_page_id]"
            :checkbox_is_visible="true"
            :checkbox_is_disabled="!isPageAdmin(page)"
            :page_info="page?.page"
            :class="isPageAdmin(page) ? 'cursor-pointer' : 'grayscale cursor-not-allowed'"
          >
          </PageItem>
        </template>
      </div>
    </div>
    <div class="flex-shrink-0 flex justify-end p-2 border-t">
      <Button
        @click="beforeActivePage"
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
  <MoveToOrg
    :list_another_org_page_id
    @done="activePage()"
    ref="move_to_org_ref"
  />
</template>
<script setup lang="ts">
import { inject, onMounted, ref } from 'vue'
import {
  useCommonStore,
  useConnectPageStore,
  useOrgStore,
  useChatbotUserStore,
} from '@/stores'
import { filter, keyBy, keys, map, mapValues, size } from 'lodash'
import {
  get_current_active_page_sync,
  update_page,
} from '@/service/api/chatbox/n4-service'
import { eachOfLimit } from 'async'
import { KEY_TOGGLE_MODAL_FUNCT } from '@/views/Dashboard/ConnectPage/symbol'
import { KEY_LOAD_LIST_PAGE_FUNCT } from '@/views/Dashboard/symbol'
import { nonAccentVn } from '@/service/helper/format'
import { read_os } from '@/service/api/chatbox/billing'
import { toastError } from '@/service/helper/alert'

import Button from '@/views/Dashboard/ConnectPage/Button.vue'
import PageItem from '@/components/Main/Dashboard/PageItem.vue'
import EmptyActive from '@/views/Dashboard/ConnectPage/ActivePage/EmptyActive.vue'
import MoveToOrg from '@/views/Dashboard/ConnectPage/ActivePage/MoveToOrg.vue'

import type { PageData } from '@/service/interface/app/page'
import type { OrgInfo, OwnerShipInfo } from '@/service/interface/app/billing'

const connectPageStore = useConnectPageStore()
const commonStore = useCommonStore()
const orgStore = useOrgStore()
const chatbotUserStore = useChatbotUserStore()

/**ẩn hiện modal kết nối nền tảng */
const toggleModal = inject(KEY_TOGGLE_MODAL_FUNCT)
/**lấy danh sách trang đã kích hoạt */
const loadListPage = inject(KEY_LOAD_LIST_PAGE_FUNCT)

/**danh sách các trang thuộc tổ chức của tôi */
const list_my_org_page = ref<PageData[]>([])
/**danh sách các trang ở tổ chức khác */
const list_another_org_page = ref<PageData[]>([])
/**danh sách id các page đã chọn */
const list_selected_page_id = ref<Record<string, boolean>>({})
/**ref của modal chọn tổ chức cho trang */
const move_to_org_ref = ref<InstanceType<typeof MoveToOrg>>()
/**danh sách các trang đã chọn - org id */
const map_my_os = ref<Record<string, string | undefined>>({})
/**danh sách các trang đạng chọn mà ngoài tổ chức */
const list_another_org_page_id = ref<string[]>([])

// lấy danh sách page mới
onMounted(() => getListWattingPage())

/**kiểm tra xem user có phải là admin trang không */
function isPageAdmin(page: PageData) {
  return page?.current_staff?.role === 'MANAGE'
}
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
/**trước khi kích hoạt trang */
function beforeActivePage() {
  /**lấy danh sách các trang khác tổ chức */
  list_another_org_page_id.value = keys(list_selected_page_id.value)?.filter(
    page_id => !map_my_os.value?.[page_id]
  )

  // nếu có trang khác tổ chức thì chuyển qua modal chuyển trang vào tổ chức
  if (list_another_org_page_id.value?.length)
    move_to_org_ref.value?.toggleModal()
  // nếu không thì kích hoạt luôn
  else activePage()
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
    await loadListPage?.(orgStore.selected_org_id)
  } catch (e) {
    // thông báo lỗi
    toastError(e)
  }

  // ẩn loading
  commonStore.is_loading_full_screen = false
}
/**tính toán ra danh sách page mới và page không có quyền truy cập */
async function getListWattingPage() {
  // hiển thị loading
  connectPageStore.is_loading = true

  try {
    // xóa toàn bộ các danh sách trang đang có để làm mới
    list_my_org_page.value = []
    list_another_org_page.value = []

    /**danh sách các trang thuộc các tổ chức của tôi */
    let list_my_os: OwnerShipInfo[] = []

    // lấy toàn bộ các trang thuộc tổ chức của tôi
    await eachOfLimit(orgStore.list_org, 1, async (org: OrgInfo, i) => {
      // nếu không có id tổ chức thì bỏ qua
      if (!org.org_id) return

      /**các trang đã nằm trong tổ chức */
      const LIST_OS = await read_os(org.org_id)

      // thêm trang vào danh sách tổng
      list_my_os = [...list_my_os, ...LIST_OS]
    })

    /**page_id và org_id */
    map_my_os.value = mapValues(keyBy(list_my_os, 'page_id'), 'org_id')

    /**toàn bộ các trang của người dùng */
    const LIST_CURRENT_PAGE = await get_current_active_page_sync({})

    // lặp qua toàn bộ danh sách page của người dùng
    map(LIST_CURRENT_PAGE?.page_list, page => {
      // nếu không có id trang thì thôi
      if (!page?.page?.fb_page_id) return

      // nếu trang đã được kích hoạt ở tổ chức của mình rồi thì bỏ qua (ở tổ chức khác vẫn hiện)
      if (page.page?.is_active && map_my_os.value?.[page?.page?.fb_page_id])
        return

      // lấy thông tin nhân viên hiện tại của trang
      page.current_staff =
        page?.staff_list?.[chatbotUserStore.chatbot_user?.fb_staff_id || '']

      // thêm trang chưa kích hoạt vào danh sách

      // trang thuộc tổ chức của tôi
      if (map_my_os.value?.[page?.page?.fb_page_id])
        list_my_org_page.value.push(page)
      // trang không thuộc tổ chức của tôi
      else list_another_org_page.value.push(page)
    })
  } catch (e) {
    // thông báo lỗi
    toastError(e)
  }

  // ẩn loading
  connectPageStore.is_loading = false
}
/**toggle trang */
function selectPage(page: PageData) {
  // nếu không phải là admin thì bỏ qua
  if (!isPageAdmin(page)) return

  /**id của trang */
  const PAGE_ID = page?.page?.fb_page_id || ''

  list_selected_page_id.value[PAGE_ID] = !list_selected_page_id.value[PAGE_ID]
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
