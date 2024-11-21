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
      <template v-if="orgStore.is_selected_all_org">
        <AllOrg />
        <GroupPageAction />
      </template>
      <template v-else>
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
import { KEY_SORT_LIST_PAGE_FUNCT } from '@/views/Dashboard/SelectPage/symbol'
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
import AllOrg from '@/views/Dashboard/SelectPage/AllOrg.vue'

import ClockIcon from '@/components/Icons/Clock.vue'
import FacebookIcon from '@/components/Icons/Facebook.vue'
import ZaloIcon from '@/components/Icons/Zalo.vue'
import WebIcon from '@/components/Icons/Web.vue'
import { nonAccentVn } from '@/service/helper/format'
import { map } from 'lodash'
import type { PageData } from '@/service/interface/app/page'

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

// xử lý khi thay đổi từ tất cả tổ chức xuống 1 tổ chức
watch(
  [() => orgStore.is_selected_all_org, () => orgStore.selected_org_id],
  (
    [new_is_selected_all_org, new_selected_org_id],
    [old_is_selected_all_org, old_selected_org_id]
  ) => {
    // nếu chọn tất cả tổ chức thỉ thôi
    if (new_is_selected_all_org) return

    // nếu cờ chọn tất cả tổ chức không đổi thì thôi
    if (new_is_selected_all_org === old_is_selected_all_org) return

    // nếu chọn 1 tổ chức nhưng khác tổ chức cũ thì thôi (chạy ở watch khác)
    if (new_selected_org_id !== old_selected_org_id) return

    // load danh sách page
    loadListPage?.(orgStore.selected_org_id)
  }
)

// nếu thay đổi tổ chức, thì chọn lại danh sách trang
watch(
  () => orgStore.selected_org_id,
  () => {
    // nếu đang chọn all thì thôi
    if (orgStore.is_selected_all_org) return

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
/**sắp xếp page gắn sao lên đầu */
function sortListPage(): PageData[] {
  // object -> array
  let array_page_list = map(pageStore.active_page_list, page_data => {
    // tạo data key cho vitual scroll
    page_data.data_key = page_data.page?.fb_page_id

    return page_data
  })

  /**
   * lọc các page phù hợp điều kiện tìm kiếm
   * - tìm kiếm theo tên hoặc id
   */
  array_page_list = array_page_list.filter(page_data => {
    // chuyển dữ liệu tìm kiếm về tiếng việt không dấu
    let formated_page_name = nonAccentVn(page_data.page?.name || '')
    let page_id = page_data.page?.fb_page_id || ''
    let formated_search_value = nonAccentVn(selectPageStore.search)

    // tìm kiếm theo tên hoặc id
    if (
      formated_page_name.includes(formated_search_value) ||
      page_id.includes(formated_search_value)
    )
      return true

    return false
  })

  /**
   * sắp xếp lại mảng theo quy tắc:
   * - ưu tiên sắp xếp các page được chọn trước
   * - sau đó sắp xếp theo các page được đánh dấu sao
   */
  let sort_priority_page_list = array_page_list.sort((page_a, page_b) => {
    /**sắp xếp các page có gắn dấu sao */
    const sortPriority = () => {
      const priority_a = page_a.page?.is_priority
      const priority_b = page_b.page?.is_priority

      // nếu cả 2 page đều gắn dấu sao thì giữ nguyên vị trí
      if (priority_a && priority_b) return 0

      // nếu chỉ page 1 gắn dấu sao thì ưu tiên page 1
      if (priority_a) return 1

      // nếu chỉ page 2 gắn dấu sao thì ưu tiên page 2
      if (priority_b) return -1

      // nếu không có page nào gắn sao thì giữ nguyên vị trí
      return 0
    }

    /**sắp xếp các page được chọn */
    const sortPageIsSelected = () => {
      const selected_a =
        pageStore.selected_page_id_list?.[page_a.page?.fb_page_id || '']
      const selected_b =
        pageStore.selected_page_id_list?.[page_b.page?.fb_page_id || '']

      // nếu cả 2 page được chọn thì tính dấu sao
      if (selected_a && selected_b) return sortPriority()

      // nếu chỉ page 1 được chọn thì chọn page 1
      if (selected_a) return 1

      // nếu chỉ page 2 được chọn thì chọn page 2
      if (selected_b) return -1

      // nếu không có page nào được chọn thì tính độ ưu tiên
      return sortPriority()
    }

    return sortPageIsSelected()
  })

  // đảo chiều mảng, vì hàm sort chạy theo ASC
  return sort_priority_page_list.reverse()
}

// xuất hàm cho component con sử dụng
provide(KEY_GO_TO_CHAT_FUNCT, goToChat)
provide(KEY_SORT_LIST_PAGE_FUNCT, sortListPage)
</script>
