<template>
  <DashboardLayout>
    <template #menu><Menu /></template>
    <template #content>
      <div class="w-full h-full flex flex-col gap-3">
        <div class="flex justify-between flex-shrink-0">
          <Search
            class="w-72"
            v-model="selectPageStore.search"
            :placeholder="$t('v1.common.page_search_placeholder')"
          />
          <SelectOrg />
        </div>
        <div
          class="relative overflow-hidden scrollbar-vertical overflow-y-auto flex flex-col gap-3"
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

          <!-- <div class="grid pb-5 gap-4 grid-cols-3">
            <PageItem
              @click="toggleSelectThisPage(page.page?.fb_page_id)"
              v-for="page of active_page_list"
              :page_info="page.page"
            >
              <div
                @click.stop
                class="flex justify-end"
              >
                <div
                  @click="
                    togglePagePriority(
                      page.page?.fb_page_id,
                      !page.page?.is_priority
                    )
                  "
                >
                  <img
                    v-if="page.page?.is_priority"
                    src="@/assets/icons/star-active.svg"
                    width="15"
                    height="15"
                    class="mr-4 cursor-pointer"
                  />
                  <img
                    v-else
                    src="@/assets/icons/star-inactive.svg"
                    width="15"
                    height="15"
                    class="mr-4 cursor-pointer"
                  />
                </div>
                <img
                  @click="inactivePage(page.page?.fb_page_id)"
                  src="@/assets/icons/hide.svg"
                  width="15"
                  height="15"
                  class="mr-4 cursor-pointer"
                />
                <input
                  @click="toggleSelectThisPage(page.page?.fb_page_id)"
                  :checked="isSelectedThisPage(page.page?.fb_page_id)"
                  type="checkbox"
                  class="w-[15px] h-[15px] mr-2 accent-orange-600"
                />
              </div>
            </PageItem>
          </div> -->
        </div>
        <!-- <FooterButton
          :text="$t('v1.view.main.dashboard.select_page.munti_chat_page')"
          @click_btn="goToChat()"
          :disabled="!size(pageStore.selected_page_id_list)"
          :count="size(pageStore.selected_page_id_list)"
        /> -->
      </div>
    </template>
  </DashboardLayout>
  <RequirePricing />
</template>

<script setup lang="ts">
import { computed, getCurrentInstance, onMounted, ref, watch } from 'vue'
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
import { debounce, keyBy, map, mapValues, set, size } from 'lodash'
import { nonAccentVn } from '@/service/helper/format'
import { confirm } from '@/service/helper/alert'
import { useRouter } from 'vue-router'
import { copy } from '@/service/helper/format'
import { preGoToChat } from '@/service/function'

import Loading from '@/components/Loading.vue'
import Search from '@/components/Main/Dashboard/Search.vue'
import PlatformTab from '@/components/Main/Dashboard/PlatformTab.vue'
import PageItem from '@/components/Main/Dashboard/PageItem.vue'
import FooterButton from '@/components/Main/Dashboard/FooterButton.vue'
import RequirePricing from '@/components/Main/RequirePricing.vue'
import DashboardLayout from '@/components/Main/Dashboard/DashboardLayout.vue'
import Menu from '@/views/Dashboard/SelectPage/Menu.vue'
import SelectOrg from '@/views/Dashboard/SelectPage/SelectOrg.vue'
import PageAvatar from '@/components/Avatar/PageAvatar.vue'
import PageTypeIcon from '@/components/Avatar/PageTypeIcon.vue'
import GroupPage from '@/views/Dashboard/SelectPage/GroupPage.vue'

import ClockIcon from '@/components/Icons/Clock.vue'
import FacebookIcon from '@/components/Icons/Facebook.vue'
import ZaloIcon from '@/components/Icons/Zalo.vue'
import WebIcon from '@/components/Icons/Web.vue'

import type { CbError } from '@/service/interface/function'
import type { PageData } from '@/service/interface/app/page'
import type { TabPlatform } from '@/service/interface/app/page'

const { t: $t } = useI18n()
const $router = useRouter()
const commonStore = useCommonStore()
const pageStore = usePageStore()
const staffStore = useStaffStore()
const selectPageStore = useSelectPageStore()
const self = getCurrentInstance()

/**danh sách các tab gốc */
const ROOT_TAB = {
  ALL_PLATFORM: {
    title: $t(`v1.common.all`),
    count: 0,
  },
  ...mapValues(keyBy($env.platform), n => {
    return {
      title: $t(`v1.common.${n.toLowerCase()}`),
      count: 0,
    }
  }),
}
/**danh sách các tab */
const list_tab_select = ref<TabPlatform>(copy(ROOT_TAB))
// đọc data từ local
const current_selected_tab = computed(() => selectPageStore.current_menu)

computed(() => selectPageStore.current_menu)

/**danh sách page sau khi được lọc */
const active_page_list = ref<PageData[]>()
// /**tìm kiếm danh sách page theo tên hoặc id */
// const search = ref('')
// /**gắn cờ loading cho danh sách page */
// const is_loading_active_page_list = ref(false)

// lọc danh sách page khi được tìm kiếm
watch(
  () => selectPageStore.search,
  () => {
    // kích hoạt loading
    selectPageStore.is_loading = true

    delayFilterCurrentActivePage()
  }
)
// lọc danh sách page khi chọn tab
watch(
  () => current_selected_tab.value,
  () => filterCurrentActivePage()
)
// nạp lại danh sách page thì có thay đổi
watch(
  () => pageStore.active_page_list,
  () => filterCurrentActivePage()
)

onMounted(() => {
  reloadChatbotUserInfo()
  // getCurrentActivePage()
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
/**thay đổi giá trị lựa chọn page để chat */
function toggleSelectThisPage(page_id?: string) {
  if (!page_id) return

  // xoá flag khi page không được chọn
  if (isSelectedThisPage(page_id))
    delete pageStore.selected_page_id_list[page_id]
  // set flag khi page được chọn
  else pageStore.selected_page_id_list[page_id] = true
}
/**kiểm tra xem page có được chọn để chat hay không */
function isSelectedThisPage(page_id?: string) {
  if (!page_id) return false

  // format boolean
  return !!pageStore.selected_page_id_list?.[page_id]
}
/**delay khi tìm kiếm page */
const delayFilterCurrentActivePage = debounce(
  () => filterCurrentActivePage(),
  300
)
/**lọc danh sách page để hiển thị theo các điều kiện được lựa chọn */
function filterCurrentActivePage() {
  // kích hoạt loading
  selectPageStore.is_loading = true

  // object -> array
  let array_page_list = map(pageStore.active_page_list, page_data => {
    // tạo data key cho vitual scroll
    page_data.data_key = page_data.page?.fb_page_id

    return page_data
  })

  /**
   * lọc các page phù hợp điều kiện tìm kiếm
   * - tìm kiếm theo tên hoặc id
   * - lọc theo tab
   */
  array_page_list = array_page_list.filter(page_data => {
    // chuyển dữ liệu tìm kiếm về tiếng việt không dấu
    let formated_page_name = nonAccentVn(page_data.page?.name || '')
    let page_id = page_data.page?.fb_page_id || ''
    let formated_search_value = nonAccentVn(selectPageStore.search)
    let page_type = page_data.page?.type

    if (
      // lọc theo tab
      (current_selected_tab.value === 'ALL_PLATFORM' ||
        current_selected_tab.value === page_type) &&
      // tìm kiếm theo tên hoặc id
      (formated_page_name.includes(formated_search_value) ||
        page_id.includes(formated_search_value))
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
  let reverse_page_list = sort_priority_page_list.reverse()

  active_page_list.value = reverse_page_list

  // tắt loading
  selectPageStore.is_loading = false
}
/**lấy toàn bộ các page được kích hoạt của user này */
function getCurrentActivePage() {
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
      // * tính count của từng nền tảng - chạy bất đồng bộ
      (cb: CbError) => {
        cb()

        // reset count
        list_tab_select.value = copy(ROOT_TAB)

        // loop qua từng attribute của object
        mapValues(pageStore.active_page_list, page_data => {
          const PAGE_TYPE = page_data.page?.type

          if (!PAGE_TYPE) return

          // count cho all page
          list_tab_select.value.ALL_PLATFORM.count++
          // count cho từng page type
          list_tab_select.value[PAGE_TYPE].count++
        })
      },
    ],
    e => {
      // tắt loading
      selectPageStore.is_loading = false
    }
  )
}
/**đánh dấu sao page ưu tiên lên đầu */
function togglePagePriority(page_id?: string, is_priority?: boolean) {
  flow(
    [
      // * call api update page
      (cb: CbError) =>
        update_page({ page_id, is_priority }, (e, r) => {
          if (e) return cb(e)

          cb()
        }),
      // * sort lại danh sách page
      (cb: CbError) => {
        if (!page_id) return cb()

        cb()

        set(
          pageStore.active_page_list,
          [page_id, 'page', 'is_priority'],
          is_priority
        )

        filterCurrentActivePage()
      },
    ],
    undefined,
    true
  )
}
/**huỷ kích hoạt page này | ẩn page */
function inactivePage(page_id?: string) {
  flow(
    [
      // * hỏi trước khi thực hiện hành động
      (cb: CbError) =>
        confirm(
          'question',
          $t('v1.view.main.dashboard.select_page.inactive_page.title'),
          '',
          (e, r) => {
            if (e) return

            cb()
          }
        ),
      // * kích hoạt loading
      (cb: CbError) => {
        commonStore.is_loading_full_screen = true

        cb()
      },
      // * call api update page
      (cb: CbError) =>
        update_page({ page_id, is_active: false }, (e, r) => {
          if (e) return cb(e)

          cb()
        }),
      // * xoá page bị ẩn khỏi danh sách page và danh sách page đang chọn (nếu có)
      (cb: CbError) => {
        if (!page_id) return cb()

        delete pageStore.active_page_list[page_id]

        delete pageStore.selected_page_id_list[page_id]

        filterCurrentActivePage()

        cb()
      },
    ],
    e => {
      // tắt loading
      commonStore.is_loading_full_screen = false
    }
  )
}
/**chỉ chọn 1 page này để chat */
function selectOnlyThisPage(page_id?: string) {
  if (!page_id) return

  let temp: {
    [index: string]: boolean
  } = {}

  temp[page_id] = true

  pageStore.selected_page_id_list = temp

  goToChat()
}
/**đi đến trang chat */
function goToChat() {
  preGoToChat(() => $router.push('/chat'))
}
// TODO loại bỏ cái này thành inject
/**load lại info của chatbot user - phòng trường hợp user mới được kích hoạt gói */
function reloadChatbotUserInfo() {
  self?.parent?.parent?.parent?.exposed?.getMeChatbotUser()
}
</script>
