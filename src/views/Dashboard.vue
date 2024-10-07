<template>
  <div class="flex flex-col h-full p-3">
    <Header class="flex-shrink-0" />
    <div class="overflow-hidden pt-3 h-full">
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
import {
  usePageStore,
  useStaffStore,
  useSelectPageStore,
  useOrgStore,
  useChatbotUserStore,
} from '@/stores'

import Header from '@/views/Dashboard/Header.vue'
import ConnectPage from '@/views/Dashboard/ConnectPage.vue'

import { N4SerivceAppPage } from '@/utils/api/N4Service/Page'
import { Toast } from '@/utils/helper/Alert'
import { mapValues } from 'lodash'

const pageStore = usePageStore()
const staffStore = useStaffStore()
const selectPageStore = useSelectPageStore()
const orgStore = useOrgStore()
const chatbotUserStore = useChatbotUserStore()

// composable
const { getMeChatbotUser } = initRequireData()

/**ref của modal kết nối nền tảng */
const connect_page_ref = ref<InstanceType<typeof ConnectPage>>()

/**ẩn hiện modal kết nối nền tảng */
function toggleModalConnectPage() {
  connect_page_ref.value?.toggleModal?.()
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

    // lấy thông tin nhân viên hiện tại của trang
    mapValues(RES?.page_list, page => {
      page.current_staff =
        page?.staff_list?.[
          chatbotUserStore.chatbot_user?.user_id ||
            chatbotUserStore.chatbot_user?.fb_staff_id ||
            ''
        ]
    })

    // lưu lại danh sách trang
    pageStore.active_page_list = RES?.page_list || {}

    // lưu lại danh sách nhân viên của các trang
    staffStore.staff_list_of_active_page = RES?.all_staff_list
  } catch (e) {
    // nếu có lỗi thì hiển thị thông báo
    new Toast().error(e)
  } finally {
    // tắt loading
    selectPageStore.is_loading = false
  }
}

// cung cấp hàm này cho component con dùng
provide(KEY_GET_CHATBOT_USER_FUNCT, getMeChatbotUser)
provide(KEY_TOGGLE_MODAL_CONNECT_PAGE_FUNCT, toggleModalConnectPage)
provide(KEY_LOAD_LIST_PAGE_FUNCT, loadListPage)
</script>
