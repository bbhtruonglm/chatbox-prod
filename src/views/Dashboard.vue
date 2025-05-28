<template>
  <div class="flex flex-col h-full p-3 gap-3">
    <Header class="flex-shrink-0">
      <template #right>
        <template v-if="$main.isShowSelectPageButton()">
          <button
            @click="$main.toggleDropdown"
            class="btn-custom text-sm font-semibold py-2 px-3 bg-slate-200"
          >
            <PlusCircleIcon class="size-4" />
            {{ $t('v1.view.main.dashboard.nav.select_platform') }}
            <ChevronDownIcon class="size-3" />
          </button>
          <button
            v-if="size(pageStore.active_page_list)"
            @click="$main.toggleModelGroupPage()"
            class="btn-custom text-sm font-semibold py-2 px-3 bg-slate-200"
          >
            <SquaresPlusIcon class="size-4" />
            {{ $t('v1.view.main.dashboard.select_page.group_page.title') }}
          </button>
        </template>
        <ReChargeBtn v-if="$route.path.includes('/dashboard/org/')" />
      </template>
    </Header>
    <div class="overflow-hidden h-full">
      <RouterView />
    </div>
    <DropdownPickConnectPlatform
      @done="$main.reloadPageData()"
      ref="ref_dropdown_pick_connect_platform"
      :position="pageManagerStore.position"
      :back="pageManagerStore.back"
    />
    <ConnectPage
      @done="$main.reloadPageData()"
      ref="connect_page_ref"
    />
  </div>
</template>

<script setup lang="ts">
import {
  useOrgStore,
  usePageManagerStore,
  usePageStore,
  useSelectPageStore,
} from '@/stores'
import { N4SerivceAppPage } from '@/utils/api/N4Service/Page'
import { Toast } from '@/utils/helper/Alert/Toast'
import { initRequireData } from '@/views/composable'
import {
  KEY_GET_ALL_ORG_AND_PAGE_FN,
  KEY_GET_CHATBOT_USER_FUNCT,
  KEY_GET_ORG_PAGES_FN,
  KEY_RELOAD_PAGE_DATA,
  KEY_TOGGLE_DROPDOWN_PICK_CONNECT_PLATFORM,
  KEY_TOGGLE_MODAL_CONNECT_PAGE_FUNCT,
} from '@/views/Dashboard/symbol'
import { keys, size } from 'lodash'
import { provide, toRef } from 'vue'
import { useRoute } from 'vue-router'

import ConnectPage from '@/views/Dashboard/ConnectPage.vue'
import Header from '@/views/Dashboard/Header.vue'
import ReChargeBtn from '@/views/Dashboard/Org/ReChargeBtn.vue'
import DropdownPickConnectPlatform from '@/views/Dashboard/SelectPage/DropdownPickConnectPlatform.vue'

import PlusCircleIcon from '@/components/Icons/PlusCircle.vue'
import SquaresPlusIcon from '@/components/Icons/SquaresPlus.vue'
import { read_link_org } from '@/service/api/chatbox/billing'
import type { ModalPosition } from '@/service/interface/vue'
import { error } from '@/utils/decorator/Error'
import { loading } from '@/utils/decorator/Loading'
import { ChevronDownIcon } from '@heroicons/vue/24/solid'
import { storeToRefs } from 'pinia'
import { container } from 'tsyringe'

const pageStore = usePageStore()
const selectPageStore = useSelectPageStore()
const orgStore = useOrgStore()
const pageManagerStore = usePageManagerStore()
const $route = useRoute()
const $toast = container.resolve(Toast)

const { ref_dropdown_pick_connect_platform, connect_page_ref } =
  storeToRefs(pageManagerStore)

// composable
const { getMeChatbotUser } = initRequireData()

// /**ref của modal kết nối nền tảng */
// const connect_page_ref = ref<InstanceType<typeof ConnectPage>>()
// /**ref của dropdown tiền chọn nền tảng để kết nối */
// const ref_dropdown_pick_connect_platform =
//   ref<InstanceType<typeof DropdownPickConnectPlatform>>()
// /**vị trí của dropdown */
// const position = ref<ModalPosition>()
// /**lùi lại bao nhiêu */
// const back = ref<number>()

class Main {
  /**nạp lại dữ liệu trang */
  reloadPageData() {
    // nếu chọn tất cả tổ chức
    if (orgStore.is_selected_all_org) this.getALlOrgAndPage()
    // nếu chọn 1 tổ chức
    else this.getOrgPages(orgStore.selected_org_id)
  }
  /**vào chế độ chat nhiều trang */
  toggleModelGroupPage() {
    // reset lại danh sách trang đã chọn nếu đang ở chế độ nhiều tổ chức
    if (orgStore.is_selected_all_org) pageStore.selected_page_id_list = {}

    // toggle chế độ chat nhiều page
    selectPageStore.toggleGroupPageMode()
  }
  /**ẩn hiện modal kết nối nền tảng */
  toggleModalConnectPage(key?: string) {
    pageManagerStore.connect_page_ref?.toggleModal?.(key)
  }
  /**lấy toàn bộ các page đang được kích hoạt của 1 tổ chức */
  @loading(toRef(selectPageStore, 'is_loading'))
  @error($toast)
  async getOrgPages(org_id?: string): Promise<void> {
    // nếu không có tổ chức thì thôi
    if (!org_id) return

    // nếu chọn tất cả tổ chức thì thôi
    if (orgStore.is_selected_all_org) return

    /**danh sách trang của tổ chức đang kích hoạt, có lọc theo nhóm nếu cần */
    const RES = await new N4SerivceAppPage().getOrgActiveListPage(
      org_id,
      orgStore.selected_org_group[orgStore.selected_org_id || '']
    )

    // lưu lại danh sách trang
    pageStore.active_page_list = RES?.page_list || {}
  }
  /**có hiển thị các nút của trang chọn page không */
  isShowSelectPageButton() {
    return (
      // đang ở trang chọn page
      $route.path.includes('select-page') &&
      // không ở chế độ chat nhiều page
      (!selectPageStore.is_group_page_mode ||
        // người dùng chưa có trang nào
        !size(pageStore.active_page_list))
    )
  }
  /**lấy toàn bộ dữ liệu tổ chức và trang */
  @loading(toRef(selectPageStore, 'is_loading'))
  @error($toast)
  async getALlOrgAndPage(): Promise<void> {
    // xóa toàn bộ trang hiện tại
    pageStore.active_page_list = {}

    /**toàn bộ các trang của người dùng */
    const PAGE_DATA = await new N4SerivceAppPage().getListPage({
      // org_group: orgStore.selected_org_group,
    })

    // nếu không có dữ liệu trang thì thôi
    if (!PAGE_DATA?.page_list) return

    // lưu trữ danh sách trang hiện tại
    pageStore.active_page_list = PAGE_DATA?.page_list

    // lấy dữ liệu mapping tổ chức và trang
    pageStore.map_orgs = await read_link_org(keys(pageStore.active_page_list))
  }
  /**ẩn hiện dropdown */
  toggleDropdown(
    $event?: MouseEvent,
    _position?: ModalPosition,
    _back?: number
  ) {
    // truyền vị trí và lùi lại
    pageManagerStore.position = _position || 'BOTTOM'
    pageManagerStore.back = _back || 236

    // sử dùng hàm của dropdown
    pageManagerStore.ref_dropdown_pick_connect_platform?.toggleDropdown($event)
  }
}
const $main = new Main()

// cung cấp hàm này cho component con dùng
provide(KEY_GET_CHATBOT_USER_FUNCT, getMeChatbotUser)
provide(KEY_TOGGLE_MODAL_CONNECT_PAGE_FUNCT, $main.toggleModalConnectPage)
provide(KEY_GET_ORG_PAGES_FN, $main.getOrgPages)
provide(KEY_GET_ALL_ORG_AND_PAGE_FN, $main.getALlOrgAndPage)
provide(
  KEY_TOGGLE_DROPDOWN_PICK_CONNECT_PLATFORM,
  $main.toggleDropdown.bind($main)
)
provide(KEY_RELOAD_PAGE_DATA, $main.reloadPageData.bind($main))
</script>
<style scoped lang="scss">
.dashboard-header {
  .btn-custom {
    @apply rounded items-center gap-2 hidden md:flex;
  }
}
</style>
