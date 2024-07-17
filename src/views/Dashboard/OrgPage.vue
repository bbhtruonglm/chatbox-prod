<template>
  <Modal
    @open_modal="getAnotherOrgPage"
    ref="modal_org_page_ref"
    class_modal="h-[500px]"
    class_body="py-2 flex gap-2"
  >
    <template #header>
      {{ $t('v1.view.main.dashboard.org_page.title') }}
    </template>
    <template #body>
      <div class="w-[655px] bg-white rounded-md p-2 flex flex-col relative">
        <div
          v-if="is_loading"
          class="absolute top-14 left-1/2 -translate-x-1/2"
        >
          <Loading class="mx-auto" />
        </div>
        <div
          class="font-semibold p-2 border-b border-slate-200 flex-shrink-0 flex items-center justify-between"
        >
          <div class="flex-shrink-0 text-xs font-medium text-slate-500">
            {{ $t('v1.view.main.dashboard.org_page.guild') }}
          </div>
          <Search />
        </div>
        <EmptyActive v-if="!size(list_new_page)" />
        <template v-else>
          <div class="h-full p-2 overflow-y-auto flex flex-col gap-2.5">
            <div class="grid grid-cols-2 gap-x-6 gap-y-2.5">
              <template v-for="page of list_new_page">
                <PageItem
                  @click="selectPage(page?.page?.fb_page_id)"
                  v-if="page?.page?.fb_page_id && filterPage(page)"
                  v-model:checkbox="
                    list_selected_page_id[page?.page?.fb_page_id]
                  "
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
                isAllowAction()
                  ? 'bg-blue-700 text-white'
                  : 'cursor-not-allowed bg-slate-200 text-slate-500'
              "
            >
              {{ $t('v1.common.more') }}
            </Button>
          </div>
        </template>
      </div>
    </template>
  </Modal>
</template>
<script setup lang="ts">
import { useConnectPageStore, useOrgStore } from '@/stores'
import { ref } from 'vue'
import { useCommonStore } from '@/stores'
import { filter, keyBy, map, mapValues, size } from 'lodash'
import { get_current_active_page } from '@/service/api/chatbox/n4-service'
import { eachOfLimit } from 'async'
import { nonAccentVn } from '@/service/helper/format'
import { add_os, read_os } from '@/service/api/chatbox/billing'

import Loading from '@/components/Loading.vue'
import Modal from '@/components/Modal.vue'
import Search from '@/views/Dashboard/ConnectPage/Search.vue'
import Button from '@/views/Dashboard/ConnectPage/Button.vue'
import PageItem from '@/components/Main/Dashboard/PageItem.vue'
import EmptyActive from '@/views/Dashboard/ConnectPage/ActivePage/EmptyActive.vue'

import type { PageData, PageList } from '@/service/interface/app/page'
import { toastError } from '@/service/helper/alert'

const $emit = defineEmits(['done'])

const connectPageStore = useConnectPageStore()
const commonStore = useCommonStore()
const orgStore = useOrgStore()

/**ref của modal kết nối nền tảng */
const modal_org_page_ref = ref<InstanceType<typeof Modal>>()
/**danh sách các trang mới */
const list_new_page = ref<PageData[]>([])
/**danh sách id các page đã chọn */
const list_selected_page_id = ref<Record<string, boolean>>({})
/**loading */
const is_loading = ref(false)

/**ẩn hiện modal của component */
function toggleModal() {
  modal_org_page_ref.value?.toggleModal()
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
/**thêm các trang được chọn vào tổ chức */
async function activePage() {
  // nếu không có trang nào được chọn thì bỏ qua
  if (!isAllowAction()) return

  // hiển thị loading
  commonStore.is_loading_full_screen = true

  try {
    // lặp qua từng trang được chọn
    await eachOfLimit(
      list_selected_page_id.value,
      1,
      async (value, page_id) => {
        // nếu trang không được chọn thì bỏ qua
        if (!value || !page_id || !orgStore.selected_org_id) return

        // thêm trang vào tổ chức
        await add_os(orgStore.selected_org_id, page_id as string)
      }
    )

    // làm mới danh sách trang được chọn
    list_selected_page_id.value = {}

    // thông báo thành công
    $emit('done')

    // tắt modal
    toggleModal()
  } catch (e) {
    // thông báo lỗi
    toastError(e)
  }

  // ẩn loading
  commonStore.is_loading_full_screen = false
}
/**lấy danh sách các trang không thuộc tổ chức hiện tại */
async function getAnotherOrgPage() {
  // hiển thị loading
  is_loading.value = true

  try {
    // nếu không có id tổ chức thì thôi
    if (!orgStore.selected_org_id) return

    // xóa toàn bộ danh sách trang cũ
    list_new_page.value = []
    // xóa toàn bộ trang đã chọn
    list_selected_page_id.value = {}

    /**toàn bộ các trang của người dùng có quyền truy cập */
    const LIST_PAGE: PageList = await new Promise((resolve, reject) =>
      get_current_active_page({}, (e, r) => {
        if (e) return reject(e)

        resolve(r.page_list)
      })
    )

    /**các trang đã nằm trong tổ chức */
    const LIST_OS = await read_os(orgStore.selected_org_id)

    /**page_id và org_id */
    const MAP_OS_ID = mapValues(keyBy(LIST_OS, 'page_id'), 'org_id')

    // lặp qua toàn bộ danh sách trang của người dùng
    map(LIST_PAGE, page => {
      // nếu không có id trang thì thôi
      if (!page?.page?.fb_page_id) return

      // lọc ra trang đã ở trong tổ chức rồi
      if (MAP_OS_ID[page?.page?.fb_page_id] === orgStore.selected_org_id) return

      // thêm trang chưa kích hoạt vào danh sách
      list_new_page.value.push(page)
    })
  } catch (e) {
    // thông báo lỗi
    toastError(e)
  }

  // ẩn loading
  is_loading.value = false
}
/**toggle trang */
function selectPage(page_id: string) {
  list_selected_page_id.value[page_id] = !list_selected_page_id.value[page_id]
}
/**có cho phép thực hiện hành động không */
function isAllowAction(): boolean {
  /**lọc ra danh sách id các trang đang chọn */
  const LIST_SELECT_PAGE_ID = filter(
    list_selected_page_id.value,
    value => value
  )

  /**
   * trả về số lượng id trang đang chọn
   * phải chọn trang thì mới cho phép thực hiện hành động
   */
  const COUNT_SELECTED_PAGE = size(LIST_SELECT_PAGE_ID)
  /**tổng số trang của tổ chức sau khi thêm */
  const NEW_TOTAL_PAGE =
    COUNT_SELECTED_PAGE +
    (orgStore.selected_org_info?.org_package?.org_current_page || 0)
  /**số lượng trang sau khi thêm có vượt mức giới hạn không */
  const IS_NOT_REACH_QUOTA =
    NEW_TOTAL_PAGE <=
    (orgStore.selected_org_info?.org_package?.org_quota_page || 0)

  // phải chọn trang, nhưng không được quá giới hạn
  return !!COUNT_SELECTED_PAGE && IS_NOT_REACH_QUOTA
}

// cung cấp hàm toggle modal cho component cha
defineExpose({ toggleModal })
</script>
