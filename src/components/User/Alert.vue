<template>
  <Modal
    @open_modal="getNoti"
    ref="modal_alert_ref"
    class_modal="w-[881px] h-[630px]"
    class_body="py-2 flex gap-2"
    class_footer="flex justify-between items-center"
  >
    <template #header>
      {{ $t('v1.view.main.dashboard.header.noti.title') }}
      (2)
    </template>
    <template #body>
      <div
        class="bg-white rounded-md p-4 gap-2 grid grid-cols-2 relative w-full h-full"
      >
        <div class="h-full overflow-y-auto flex flex-col gap-2.5">
          <button
            v-for="i of 100"
            :class="{
              'border-2 border-blue-700': i == 1,
              'bg-slate-50': [2, 3].includes(i),
            }"
            class="border rounded-lg py-3 px-4 hover:bg-slate-50"
          >
            <div class="flex items-center gap-2.5 justify-between">
              <div
                class="text-sm font-medium min-w-0 truncate"
              >
                Chuyển sở hữu trang
              </div>
              <div
                v-if="[2, 3].includes(i)"
                class="flex-shrink-0 rounded-full w-[11px] h-[11px] bg-red-500"
              />
            </div>
            <div class="text-sm text-gray-500 flex items-center gap-2.5 justify-between">
              <div class="min-w-0 truncate">Nội dung thông báo</div>
              <div class="flex-shrink-0">15:20 4/8/2024</div>
            </div>
          </button>
        </div>
        <div
          class="h-full overflow-hidden border rounded-lg py-2 px-3 flex flex-col gap-2.5"
        >
          <div
            class="bg-slate-100 text-xs py-1 px-2 rounded flex-shrink-0 flex justify-between"
          >
            <div class="font-medium">Chuyển sở hữu trang</div>
            <div>15:20 4/8/2024</div>
          </div>
          <div class="min-h-0 overflow-y-auto text-sm">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Labore sunt eveniet voluptate alias? Magni, vitae reprehenderit aspernatur eum rerum beatae, repellendus necessitatibus, perspiciatis esse earum minima dolorem quo. Eligendi, unde?
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Labore sunt eveniet voluptate alias? Magni, vitae reprehenderit aspernatur eum rerum beatae, repellendus necessitatibus, perspiciatis esse earum minima dolorem quo. Eligendi, unde?
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Labore sunt eveniet voluptate alias? Magni, vitae reprehenderit aspernatur eum rerum beatae, repellendus necessitatibus, perspiciatis esse earum minima dolorem quo. Eligendi, unde?
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Labore sunt eveniet voluptate alias? Magni, vitae reprehenderit aspernatur eum rerum beatae, repellendus necessitatibus, perspiciatis esse earum minima dolorem quo. Eligendi, unde?
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Labore sunt eveniet voluptate alias? Magni, vitae reprehenderit aspernatur eum rerum beatae, repellendus necessitatibus, perspiciatis esse earum minima dolorem quo. Eligendi, unde?
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Labore sunt eveniet voluptate alias? Magni, vitae reprehenderit aspernatur eum rerum beatae, repellendus necessitatibus, perspiciatis esse earum minima dolorem quo. Eligendi, unde?
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Labore sunt eveniet voluptate alias? Magni, vitae reprehenderit aspernatur eum rerum beatae, repellendus necessitatibus, perspiciatis esse earum minima dolorem quo. Eligendi, unde?
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Labore sunt eveniet voluptate alias? Magni, vitae reprehenderit aspernatur eum rerum beatae, repellendus necessitatibus, perspiciatis esse earum minima dolorem quo. Eligendi, unde?
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Labore sunt eveniet voluptate alias? Magni, vitae reprehenderit aspernatur eum rerum beatae, repellendus necessitatibus, perspiciatis esse earum minima dolorem quo. Eligendi, unde?
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Labore sunt eveniet voluptate alias? Magni, vitae reprehenderit aspernatur eum rerum beatae, repellendus necessitatibus, perspiciatis esse earum minima dolorem quo. Eligendi, unde?
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Labore sunt eveniet voluptate alias? Magni, vitae reprehenderit aspernatur eum rerum beatae, repellendus necessitatibus, perspiciatis esse earum minima dolorem quo. Eligendi, unde?
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Labore sunt eveniet voluptate alias? Magni, vitae reprehenderit aspernatur eum rerum beatae, repellendus necessitatibus, perspiciatis esse earum minima dolorem quo. Eligendi, unde?
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Labore sunt eveniet voluptate alias? Magni, vitae reprehenderit aspernatur eum rerum beatae, repellendus necessitatibus, perspiciatis esse earum minima dolorem quo. Eligendi, unde?
          </div>
        </div>
      </div>
    </template>
    <template #footer>
      <button
        @click="modal_alert_ref?.toggleModal()"
        class="btn-custom bg-slate-700 text-white"
      >
        {{ $t('v1.common.close') }}
      </button>
      <button
        @click="readAllNoti"
        class="btn-custom bg-blue-700 text-white"
      >
        {{ $t('v1.view.main.dashboard.header.noti.read_all') }}
      </button>
    </template>
  </Modal>
</template>
<script setup lang="ts">
import { useConnectPageStore, useOrgStore } from '@/stores'
import { ref } from 'vue'
import { useCommonStore } from '@/stores'
import { filter, keyBy, map, mapValues, size } from 'lodash'
import {
  get_current_active_page,
  get_current_active_page_sync,
  update_page_sync,
} from '@/service/api/chatbox/n4-service'
import { eachOfLimit } from 'async'
import { nonAccentVn } from '@/service/helper/format'
import { add_os, read_os } from '@/service/api/chatbox/billing'
import { toastError } from '@/service/helper/alert'

import Loading from '@/components/Loading.vue'
import Modal from '@/components/Modal.vue'
import Search from '@/views/Dashboard/ConnectPage/Search.vue'
import Button from '@/views/Dashboard/ConnectPage/Button.vue'
import PageItem from '@/components/Main/Dashboard/PageItem.vue'
import EmptyActive from '@/views/Dashboard/ConnectPage/ActivePage/EmptyActive.vue'

import type { PageData, PageList } from '@/service/interface/app/page'

const $emit = defineEmits(['done'])

const connectPageStore = useConnectPageStore()
const commonStore = useCommonStore()
const orgStore = useOrgStore()

/**ref của modal kết nối nền tảng */
const modal_alert_ref = ref<InstanceType<typeof Modal>>()
/**danh sách các trang mới */
const list_new_page = ref<PageData[]>([])
/**danh sách id các page đã chọn */
const list_selected_page_id = ref<Record<string, boolean>>({})
/**loading */
const is_loading = ref(false)

function readAllNoti() {}
/**ẩn hiện modal của component */
function toggleModal() {
  modal_alert_ref.value?.toggleModal()
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

        // * call api kích hoạt trang
        await update_page_sync({ page_id: page_id as string, is_active: true })

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
async function getNoti() {
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
    const LIST_CURRENT_PAGE = await get_current_active_page_sync({})

    /**các trang đã nằm trong tổ chức */
    const LIST_OS = await read_os(orgStore.selected_org_id)

    /**page_id và org_id */
    const MAP_OS_ID = mapValues(keyBy(LIST_OS, 'page_id'), 'org_id')

    // lặp qua toàn bộ danh sách trang của người dùng
    map(LIST_CURRENT_PAGE?.page_list, page => {
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
<style scoped lang="scss">
.btn-custom {
  @apply text-sm font-medium rounded-md py-2 px-4 flex items-center gap-2 hover:brightness-90;
}
</style>
