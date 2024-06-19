<template>
  <div class="flex flex-col h-full">
    <Header class="flex-shrink-0" />
    <div class="overflow-hidden pt-3 h-full">
      <RouterView />
    </div>
  </div>
  <ConnectPage ref="connect_page_ref" />
</template>

<script setup lang="ts">
import { provide, ref } from 'vue'
import { initRequireData } from '@/views/composable'
import { flow } from '@/service/helper/async'
import {
  KEY_GET_CHATBOT_USER_FUNCT,
  KEY_TOGGLE_MODAL_CONNECT_PAGE_FUNCT,
  KEY_LOAD_LIST_PAGE_FUNCT
} from '@/views/Dashboard/symbol'
import { usePageStore, useStaffStore, useSelectPageStore } from '@/stores'
import { get_current_active_page } from '@/service/api/chatbox/n4-service'

import Header from '@/views/Dashboard/Header.vue'
import ConnectPage from '@/views/Dashboard/ConnectPage.vue'

import type { CbError } from '@/service/interface/function'

const pageStore = usePageStore()
const staffStore = useStaffStore()
const selectPageStore = useSelectPageStore()

// composable
const { getMeChatbotUser } = initRequireData()

/**ref của modal kết nối nền tảng */
const connect_page_ref = ref<InstanceType<typeof ConnectPage>>()

/**ẩn hiện modal kết nối nền tảng */
function toggleModalConnectPage() {
  connect_page_ref.value?.toggleModal?.()
}
/**lấy toàn bộ các page đang được kích hoạt của người dùng */
function loadListPage() {
  flow(
    [
      // * kích hoạt loading
      (cb: CbError) => {
        selectPageStore.is_loading = true

        cb()
      },
      // * gọi api lấy danh sách page
      (cb: CbError) =>
        get_current_active_page({ is_active: true }, (e, r) => {
          if (e) return cb(e)

          pageStore.active_page_list = r.page_list
          staffStore.staff_list_of_active_page = r.all_staff_list
          cb()
        }),
    ],
    e => {
      // tắt loading
      selectPageStore.is_loading = false
    }
  )
}

// cung cấp hàm này cho component con dùng
provide(KEY_GET_CHATBOT_USER_FUNCT, getMeChatbotUser)
provide(KEY_TOGGLE_MODAL_CONNECT_PAGE_FUNCT, toggleModalConnectPage)
provide(KEY_LOAD_LIST_PAGE_FUNCT, loadListPage)
</script>
