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
                  v-if="page?.page?.fb_page_id && filterPage(page)"
                  @click="selectPage(page)"
                  v-model:checkbox="
                    list_selected_page_id[page?.page?.fb_page_id]
                  "
                  :checkbox_is_visible="true"
                  :checkbox_is_disabled="!isPageAdmin(page)"
                  :page_info="page?.page"
                  :class="
                    isPageAdmin(page)
                      ? 'cursor-pointer'
                      : 'grayscale cursor-not-allowed'
                  "
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
import {
  useConnectPageStore,
  useOrgStore,
  useCommonStore,
  useChatbotUserStore,
} from '@/stores'
import { ref } from 'vue'
import { filter, keyBy, map, mapValues, size } from 'lodash'
import { update_page_sync } from '@/service/api/chatbox/n4-service'
import { eachOfLimit } from 'async'
import { nonAccentVn } from '@/service/helper/format'
import { add_os, read_link_org, read_os } from '@/service/api/chatbox/billing'
import { confirmSync, toastError } from '@/service/helper/alert'
import { useI18n } from 'vue-i18n'

import Loading from '@/components/Loading.vue'
import Modal from '@/components/Modal.vue'
import Search from '@/views/Dashboard/ConnectPage/Search.vue'
import Button from '@/views/Dashboard/ConnectPage/Button.vue'
import PageItem from '@/components/Main/Dashboard/PageItem.vue'
import EmptyActive from '@/views/Dashboard/ConnectPage/ActivePage/EmptyActive.vue'

import type { PageData } from '@/service/interface/app/page'
import type { PageOrgInfoMap } from '@/service/interface/app/billing'
import {
  N4SerivceAppPage,
  type CurrentPageData,
} from '@/utils/api/N4Service/Page'
import { Toast } from '@/utils/helper/Alert'

const $emit = defineEmits(['done'])

const connectPageStore = useConnectPageStore()
const commonStore = useCommonStore()
const orgStore = useOrgStore()
const chatbotUserStore = useChatbotUserStore()
const { t: $t } = useI18n()

/**ref của modal kết nối nền tảng */
const modal_org_page_ref = ref<InstanceType<typeof Modal>>()
/**danh sách các trang mới */
const list_new_page = ref<PageData[]>([])
/**danh sách id các page đã chọn */
const list_selected_page_id = ref<Record<string, boolean>>({})
/**loading */
const is_loading = ref(false)
/**liên kết dữ liệu giữa tổ chức khác và trang */
const map_another_org_page = ref<PageOrgInfoMap>()
/**toàn bộ các trang khả thi */
const list_current_page = ref<CurrentPageData>()

/**kiểm tra xem user có phải là admin trang không */
function isPageAdmin(page: PageData) {
  return page?.current_staff?.role === 'MANAGE'
}
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

  /**danh sách các trang được chọn */
  const SELECTED_PAGE_ID: string[] = []

  map(list_selected_page_id.value, (is_selected, page_id) => {
    if (!is_selected || !page_id) return

    SELECTED_PAGE_ID.push(page_id)
  })

  /**danh sách tên các trang đã có tổ chức */
  const LIST_NAME = SELECTED_PAGE_ID
    // lọc các trang có tổ chức khác
    ?.filter(page_id => map_another_org_page.value?.map_page_org?.[page_id])
    // lọc tên trang
    ?.map(page_id => list_current_page.value?.page_list?.[page_id]?.page?.name)

  // cảnh báo lấy trang của tổ chức khác
  if (LIST_NAME?.length) {
    /**xác nhận có chuyển trang không */
    const IS_ALLOW = await confirmSync(
      'warning',
      $t('v1.common.warning'),
      $t('v1.view.main.dashboard.org_page.warning_move', {
        page: LIST_NAME?.join(', '),
      })
    )

    // nếu không chuyển thì bỏ qua
    if (!IS_ALLOW) return
  }

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
async function getAnotherOrgPage() {
  try {
    // hiển thị loading
    is_loading.value = true

    // nếu không có id tổ chức thì thôi
    if (!orgStore.selected_org_id) return

    // xóa toàn bộ danh sách trang cũ
    list_new_page.value = []
    // xóa toàn bộ trang đã chọn
    list_selected_page_id.value = {}

    /**toàn bộ các trang của người dùng có quyền truy cập */
    list_current_page.value = await new N4SerivceAppPage().getListPage()

    /**các trang đã nằm trong tổ chức */
    const LIST_OS = await read_os(orgStore.selected_org_id)

    /**page_id và org_id */
    const MAP_OS_ID = mapValues(keyBy(LIST_OS, 'page_id'), 'org_id')

    // lặp qua toàn bộ danh sách trang của người dùng
    map(list_current_page.value?.page_list, page => {
      // nếu không có id trang thì thôi
      if (!page?.page?.fb_page_id) return

      // lọc ra trang đã ở trong tổ chức rồi
      if (MAP_OS_ID[page?.page?.fb_page_id] === orgStore.selected_org_id) return

      // lấy thông tin nhân viên hiện tại của trang
      page.current_staff =
        page?.staff_list?.[
          chatbotUserStore.chatbot_user?.user_id ||
            chatbotUserStore.chatbot_user?.fb_staff_id ||
            ''
        ]

      // thêm trang chưa kích hoạt vào danh sách
      list_new_page.value.push(page)
    })

    // lấy dữ liệu tổ chức khác
    map_another_org_page.value = await read_link_org(
      list_new_page.value?.map(page => page?.page?.fb_page_id || '')
    )
  } catch (e) {
    // thông báo lỗi
    new Toast().error(e)
  } finally {
    // ẩn loading
    is_loading.value = false
  }
}
/**toggle trang */
function selectPage(page: PageData) {
  // nếu không phải là admin thì bỏ qua
  if (!isPageAdmin(page)) return

  /**id của trang */
  const PAGE_ID = page?.page?.fb_page_id || ''

  // toggle trang
  list_selected_page_id.value[PAGE_ID] = !list_selected_page_id.value[PAGE_ID]
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
