<template>
  <DashboardLayout class_content="flex flex-col gap-3 relative">
    <template #menu><Menu /></template>
    <template #content>
      <div class="flex justify-between flex-shrink-0">
        <Search
          class="w-72"
          v-model="selectPageStore.search"
          :placeholder="$t('v1.common.page_search_placeholder')"
        />
        <SelectOrg />
      </div>
      <div
        class="relative overflow-hidden scrollbar-vertical overflow-y-auto flex flex-col gap-3 pb-16"
      >
        <!-- <div
            class="flex justify-end py-2 top-[-39px] right-[8px] pr-[8px] md:absolute"
          >
            <div
              @click="toggleSelectAllPage()"
              class="flex items-center cursor-pointer"
            >
              <div class="text-sm font-semibold">
                {{ $t('v1.view.main.dashboard.select_page.select_all_page') }}
              </div>
              <input
                :checked="
                  size(pageStore.selected_page_id_list) ===
                  size(pageStore.active_page_list)
                "
                type="checkbox"
                class="w-[15px] h-[15px] ml-1 accent-orange-600"
              />
            </div>
          </div> -->

        <div
          v-if="selectPageStore.is_loading"
          class="absolute left-1/2 -translate-x-1/2"
        >
          <Loading class="mx-auto" />
        </div>

        <GroupPage
          filter="RECENT"
          :icon="ClockIcon"
          :title="$t('v1.common.recent')"
        />
        <GroupPage
          filter="FB_MESS"
          :icon="FacebookIcon"
          :title="$t('v1.common.fb_mess')"
        />
        <GroupPage
          filter="WEBSITE"
          :icon="WebIcon"
          :title="$t('v1.common.website')"
        />
        <GroupPage
          filter="ZALO_OA"
          :icon="ZaloIcon"
          :title="$t('v1.common.zalo_oa')"
        />
      </div>
      <GroupPageAction />
    </template>
  </DashboardLayout>
  <RequirePricing />
</template>

<script setup lang="ts">
import { computed, inject, onMounted, provide } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  useCommonStore,
  usePageStore,
  useStaffStore,
  useSelectPageStore,
} from '@/stores'
import { flow } from '@/service/helper/async'
import {
  get_current_active_page,
  update_page,
} from '@/service/api/chatbox/n4-service'
import { mapValues, size } from 'lodash'
import { KEY_GET_CHATBOT_USER_FUNCT } from '@/views/Dashboard/symbol'
import { KEY_GO_TO_CHAT_FUNCT } from '@/views/Dashboard/SelectPage/symbol'
import { useRouter } from 'vue-router'
import { preGoToChat } from '@/service/function'

import Loading from '@/components/Loading.vue'
import Search from '@/components/Main/Dashboard/Search.vue'
import RequirePricing from '@/components/Main/RequirePricing.vue'
import DashboardLayout from '@/components/Main/Dashboard/DashboardLayout.vue'
import Menu from '@/views/Dashboard/SelectPage/Menu.vue'
import SelectOrg from '@/views/Dashboard/SelectPage/SelectOrg.vue'
import GroupPage from '@/views/Dashboard/SelectPage/GroupPage.vue'
import GroupPageAction from '@/views/Dashboard/SelectPage/GroupPageAction.vue'

import ClockIcon from '@/components/Icons/Clock.vue'
import FacebookIcon from '@/components/Icons/Facebook.vue'
import ZaloIcon from '@/components/Icons/Zalo.vue'
import WebIcon from '@/components/Icons/Web.vue'

import type { CbError } from '@/service/interface/function'

const { t: $t } = useI18n()
const pageStore = usePageStore()
const staffStore = useStaffStore()
const selectPageStore = useSelectPageStore()
const $router = useRouter()

/**hàm load lại thông tin chatbot user từ component cha */
const getMeChatbotUser = inject(KEY_GET_CHATBOT_USER_FUNCT)

computed(() => selectPageStore.current_menu)

onMounted(() => {
  //
  /**
   * load lại info của chatbot user
   * phòng trường hợp user mới được kích hoạt gói
   * nhưng sẽ bị gọi api 2 lần lúc đầu
   */
  getMeChatbotUser?.()

  // load danh sách page
  loadListPage()
})

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
/**chọn | huỷ toàn bộ các page */
function toggleSelectAllPage() {
  // nếu tất cả các page được chọn -> huỷ chọn tất cả các page
  if (
    size(pageStore.selected_page_id_list) === size(pageStore.active_page_list)
  )
    pageStore.selected_page_id_list = {}
  // nếu có một vài page đang được chọn -> chọn tất cả các page
  // nếu không có page nào được chọn -> chọn tất cả các page
  else
    pageStore.selected_page_id_list = mapValues(
      pageStore.active_page_list,
      () => true
    )
}
/**chuyển đến trang chat */
function goToChat() {
  // chuyển đến trang chat
  preGoToChat(() => $router.push('/chat'))
}

// xuất hàm cho component con sử dụng
provide(KEY_GO_TO_CHAT_FUNCT, goToChat)
</script>
