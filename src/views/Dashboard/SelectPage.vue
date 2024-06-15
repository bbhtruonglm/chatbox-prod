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
      <EmptyPage v-if="!pageStore.countActivePage()" />
      <div
        v-else
        :class="{
          'pb-16': selectPageStore.is_group_page_mode,
        }"
        class="overflow-y-auto flex flex-col gap-3"
      >
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
        <GroupPageAction />
      </div>
    </template>
  </DashboardLayout>
  <RequirePricing />
</template>

<script setup lang="ts">
import { computed, inject, onMounted, provide } from 'vue'
import { useI18n } from 'vue-i18n'
import { usePageStore, useStaffStore, useSelectPageStore } from '@/stores'
import { flow } from '@/service/helper/async'
import { get_current_active_page } from '@/service/api/chatbox/n4-service'
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
import EmptyPage from '@/views/Dashboard/SelectPage/EmptyPage.vue'

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
/**chuyển đến trang chat */
function goToChat() {
  // chuyển đến trang chat
  preGoToChat(() => $router.push('/chat'))
}

// xuất hàm cho component con sử dụng
provide(KEY_GO_TO_CHAT_FUNCT, goToChat)
</script>
