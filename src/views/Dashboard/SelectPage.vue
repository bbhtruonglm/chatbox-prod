<template>
  <DashboardLayout class_content="flex flex-col gap-3 relative">
    <template #menu><Menu /></template>
    <template #content>
      <HotAlert
        :codes="[
          'ALMOST_EXPIRED_PACKAGE',
          'TOPUP_WAITING',
          'ALMOST_REACH_QUOTA_AI',
          'CHANGE_PAGE_OWNER',
          'LOCK_FEATURE',
        ]"
      />
      <div class="flex justify-between flex-shrink-0">
        <Search
          class="w-72"
          v-model="selectPageStore.search"
          :placeholder="$t('v1.common.page_search_placeholder')"
        />
        <SelectOrg is_allow_all />
      </div>
      <div
        v-if="selectPageStore.is_loading"
        class="absolute left-1/2 -translate-x-1/2 top-14"
      >
        <Loading class="mx-auto" />
      </div>
      <EmptyPage
        v-if="!pageStore.countActivePage()"
        tab="PAGE"
      />
      <div
        v-else
        :class="{
          'pb-16': selectPageStore.is_group_page_mode,
        }"
        class="overflow-y-auto flex flex-col gap-3"
      >
        <GroupPage
          filter="RECENT"
          :icon="ClockIcon"
          :title="$t('v1.common.recent')"
          tab="PAGE"
        />
        <GroupPage
          filter="FB_MESS"
          :icon="FacebookIcon"
          :title="$t('v1.common.fb_mess')"
          tab="FB_MESS"
        />
        <GroupPage
          filter="WEBSITE"
          :icon="WebIcon"
          :title="$t('v1.common.website')"
          tab="WEBSITE"
        />
        <GroupPage
          filter="ZALO_OA"
          :icon="ZaloIcon"
          :title="$t('v1.common.zalo_oa')"
          tab="ZALO_OA"
        />
        <GroupPageAction />
      </div>
    </template>
  </DashboardLayout>
  <!-- <RequirePricing /> -->
</template>

<script setup lang="ts">
import { computed, inject, onMounted, provide, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  useConnectPageStore,
  useOrgStore,
  usePageStore,
  useSelectPageStore,
} from '@/stores'
import {
  KEY_GET_CHATBOT_USER_FUNCT,
  KEY_LOAD_LIST_PAGE_FUNCT,
  KEY_TOGGLE_MODAL_CONNECT_PAGE_FUNCT,
} from '@/views/Dashboard/symbol'
import { KEY_GO_TO_CHAT_FUNCT } from '@/views/Dashboard/SelectPage/symbol'
import { useRoute, useRouter } from 'vue-router'
import { preGoToChat } from '@/service/function'

import Loading from '@/components/Loading.vue'
import Search from '@/components/Main/Dashboard/Search.vue'
import DashboardLayout from '@/components/Main/Dashboard/DashboardLayout.vue'
import Menu from '@/views/Dashboard/SelectPage/Menu.vue'
import SelectOrg from '@/components/Main/Dashboard/SelectOrg.vue'
import GroupPage from '@/views/Dashboard/SelectPage/GroupPage.vue'
import GroupPageAction from '@/views/Dashboard/SelectPage/GroupPageAction.vue'
import EmptyPage from '@/views/Dashboard/SelectPage/EmptyPage.vue'
import HotAlert from '@/components/HotAlert.vue'

import ClockIcon from '@/components/Icons/Clock.vue'
import FacebookIcon from '@/components/Icons/Facebook.vue'
import ZaloIcon from '@/components/Icons/Zalo.vue'
import WebIcon from '@/components/Icons/Web.vue'

const { t: $t } = useI18n()
const pageStore = usePageStore()
const selectPageStore = useSelectPageStore()
const $router = useRouter()
const $route = useRoute()
const connectPageStore = useConnectPageStore()
const orgStore = useOrgStore()

/**hàm load lại thông tin chatbot user từ component cha */
const getMeChatbotUser = inject(KEY_GET_CHATBOT_USER_FUNCT)
/**lấy danh sách trang đã kích hoạt */
const loadListPage = inject(KEY_LOAD_LIST_PAGE_FUNCT)
/**mở modal connect page */
const toggleModalConnectPage = inject(KEY_TOGGLE_MODAL_CONNECT_PAGE_FUNCT)

computed(() => selectPageStore.current_menu)

// nếu thay đổi tổ chức, thì chọn lại danh sách trang
watch(
  () => orgStore.selected_org_id,
  () => {
    // load danh sách page
    loadListPage?.(orgStore.selected_org_id)
  }
)

onMounted(() => {
  /**
   * load lại info của chatbot user
   * phòng trường hợp user mới được kích hoạt gói
   * nhưng sẽ bị gọi api 2 lần lúc đầu
   */
  getMeChatbotUser?.()

  // load danh sách page
  loadListPage?.(orgStore.selected_org_id)

  // kích hoạt zalo nếu phát hiện
  triggerConnectZalo()
})

/**kích hoạt oauth zalo redirect nếu phát hiện */
function triggerConnectZalo() {
  // nếu không có cờ zalo thì thôi
  if ($route.query.connect_page !== 'ZALO_OA') return

  // mở modal connect zalo
  toggleModalConnectPage?.('ZALO_OA')
}
/**chuyển đến trang chat */
function goToChat() {
  // chuyển đến trang chat
  preGoToChat(() => $router.push('/chat'))
}

// xuất hàm cho component con sử dụng
provide(KEY_GO_TO_CHAT_FUNCT, goToChat)
</script>
