<template>
  <div class="flex flex-col h-full p-3 gap-3">
    <Header class="flex-shrink-0">
      <template #right>
        <template v-if="isShowSelectPageButton()">
          <button
            @click="toggleModalConnectPage?.('PAGE')"
            class="btn-custom h-7 text-xs font-medium py-1.5 px-2 bg-slate-200"
          >
            <PlusCircleIcon class="w-3 h-3" />
            {{ $t('v1.view.main.dashboard.nav.select_platform') }}
          </button>
          <button
            v-if="size(pageStore.active_page_list)"
            @click="selectPageStore.toggleGroupPageMode()"
            class="btn-custom h-7 text-xs font-medium py-1.5 px-2 bg-slate-200"
          >
            <SquaresPlusIcon class="w-3 h-3" />
            {{ $t('v1.view.main.dashboard.select_page.group_page.title') }}
          </button>
        </template>
        <ReChargeBtn v-if="$route.path.includes('/dashboard/org/')" />
      </template>
    </Header>
    <div class="overflow-hidden h-full">
      <RouterView />
    </div>
  </div>
  <ConnectPage
    @done="loadListPage?.(orgStore.selected_org_id)"
    ref="connect_page_ref"
  />
</template>

<script setup lang="ts">
import { provide, ref } from 'vue'
import { initRequireData } from '@/views/composable'
import {
  KEY_GET_CHATBOT_USER_FUNCT,
  KEY_TOGGLE_MODAL_CONNECT_PAGE_FUNCT,
  KEY_LOAD_LIST_PAGE_FUNCT,
} from '@/views/Dashboard/symbol'
import { usePageStore, useSelectPageStore, useOrgStore } from '@/stores'
import { size } from 'lodash'
import { N4SerivceAppPage } from '@/utils/api/N4Service/Page'
import { ToastSingleton } from '@/utils/helper/Alert/Toast'
import { useRoute } from 'vue-router'

import ReChargeBtn from '@/views/Dashboard/Org/ReChargeBtn.vue'
import Header from '@/views/Dashboard/Header.vue'
import ConnectPage from '@/views/Dashboard/ConnectPage.vue'

import PlusCircleIcon from '@/components/Icons/PlusCircle.vue'
import SquaresPlusIcon from '@/components/Icons/SquaresPlus.vue'

const pageStore = usePageStore()
const selectPageStore = useSelectPageStore()
const orgStore = useOrgStore()
const $route = useRoute()

// composable
const { getMeChatbotUser } = initRequireData()

/**ref của modal kết nối nền tảng */
const connect_page_ref = ref<InstanceType<typeof ConnectPage>>()

/**ẩn hiện modal kết nối nền tảng */
function toggleModalConnectPage(key?: string) {
  connect_page_ref.value?.toggleModal?.(key)
}
/**lấy toàn bộ các page đang được kích hoạt của người dùng */
async function loadListPage(org_id?: string): Promise<void> {
  try {
    // nếu không có tổ chức thì thôi
    if (!org_id) return

    // kích hoạt loading
    selectPageStore.is_loading = true

    /**danh sách trang của tổ chức đang kích hoạt */
    const RES = await new N4SerivceAppPage().getOrgActiveListPage(org_id)

    // lưu lại danh sách trang
    pageStore.active_page_list = RES?.page_list || {}
  } catch (e) {
    // nếu có lỗi thì hiển thị thông báo
    ToastSingleton.getInst().error(e)
  } finally {
    // tắt loading
    selectPageStore.is_loading = false
  }
}
/**có hiển thị các nút của trang chọn page không */
function isShowSelectPageButton() {
  return (
    // đang ở trang chọn page
    $route.path.includes('select-page') &&
    (
      // không ở chế độ chat nhiều page
      !selectPageStore.is_group_page_mode || 
      // người dùng chưa có trang nào
      !size(pageStore.active_page_list)
    )
  )
}

// cung cấp hàm này cho component con dùng
provide(KEY_GET_CHATBOT_USER_FUNCT, getMeChatbotUser)
provide(KEY_TOGGLE_MODAL_CONNECT_PAGE_FUNCT, toggleModalConnectPage)
provide(KEY_LOAD_LIST_PAGE_FUNCT, loadListPage)
</script>
<style scoped lang="scss">
.dashboard-header {
  .btn-custom {
    @apply rounded flex items-center gap-1 hover:brightness-90;
  }
}
</style>
