<template>
  <!-- :checkbox_is_disabled="!isActivePage(page_info)" -->
  <!-- :class="isActivePage(page_info) ? 'cursor-pointer' : 'cursor-not-allowed'" -->
  <PageItem
    v-model:checkbox="pageStore.selected_page_id_list[page_id || '']"
    :checkbox_is_visible="selectPageStore.is_group_page_mode"
    :page_info="page_info"
    @click="selectPage"
    class="border border-slate-200 cursor-pointer"
  >
    <template #after-name>
      <!-- nếu page hết hạn thì ẩn ngôi sao để ưu tiên block dưới -->
      <!-- :class="{
          'hidden group-hover:flex': !isActivePage(page_info),
        }" -->
      <div class="cursor-pointer items-center gap-2.5 flex">
        <!-- chỉ hiện nút xoá page khi hover -->
        <HidePage
          v-if="isPageAdmin(page)"
          :page_id
          :page_name="page_info?.name"
          :selected_page="page_info"
        />
        <div @click.stop="togglePagePriority()">
          <StarIcon
            class="w-4 h-4 text-yellow-500"
            v-if="page_info?.is_priority"
          />
          <StarOutlineIcon
            class="w-4 h-4 text-slate-500 hidden group-hover:flex"
            v-else
          />
        </div>
      </div>
      <!-- <span
        v-if="!isActivePage(page_info)"
        class="text-xs text-red-500 group-hover:hidden"
      >
        {{ $t('v1.common.expired') }}
      </span> -->
    </template>
  </PageItem>
  <ExpiredAlert ref="expired_alert_modal_ref" />
</template>
<script setup lang="ts">
import { usePageStore, useSelectPageStore } from '@/stores'
// import { isActivePage } from '@/service/helper/pricing'
import { set } from 'lodash'
import { update_page } from '@/service/api/chatbox/n4-service'
import { useI18n } from 'vue-i18n'
import { flow } from '@/service/helper/async'
import { computed, inject, ref } from 'vue'
import { KEY_SORT_LIST_PAGE_FUNCT } from '@/views/Dashboard/SelectPage/symbol'
import { KEY_GO_TO_CHAT_FUNCT } from '@/views/Dashboard/SelectPage/symbol'

import PageItem from '@/components/Main/Dashboard/PageItem.vue'
import HidePage from '@/views/Dashboard/SelectPage/PageItem/HidePage.vue'
import ExpiredAlert from '@/views/Dashboard/SelectPage/PageItem/ExpiredAlert.vue'

import StarIcon from '@/components/Icons/Star.vue'
import StarOutlineIcon from '@/components/Icons/StarOutline.vue'

import type { CbError } from '@/service/interface/function'
import type { IPage, PageData, PageInfo } from '@/service/interface/app/page'
import { Page } from '@/utils/helper/Page'

const $emit = defineEmits(['select_page'])

const $props = withDefaults(
  defineProps<{
    /**dữ liệu của trang */
    page_info: IPage
    /**dữ liệu của trang */
    page: PageData
    /**lọc hiển thị nền tảng */
    filter?: string
  }>(),
  {}
)

const { t: $t } = useI18n()
const pageStore = usePageStore()
const selectPageStore = useSelectPageStore()

/**hàm sort lại danh sách trang của component cha */
const sortListPage = inject(KEY_SORT_LIST_PAGE_FUNCT)
/**hàm đi đến trang chat */
const goToChat = inject(KEY_GO_TO_CHAT_FUNCT)

/**modal cảnh báo trang đã hết hạn */
const expired_alert_modal_ref = ref<InstanceType<typeof ExpiredAlert>>()
/**id trang */
const page_id = computed(() => $props.page_info?.fb_page_id)
/**đánh dấu ưu tiên */
const is_priority = computed(() => $props.page_info?.is_priority)

/**kiểm tra xem user có phải là admin trang không */
function isPageAdmin(page: PageData): boolean {
  return Page.isCurrentStaffIsPageAdmin(page)
}
/**click chọn vào 1 trang */
function selectPage() {
  // nếu đang ở chế độ chat 1 page bấm vào page sẽ chọn luôn page đó
  if (!selectPageStore.is_group_page_mode) return selectOnePage()

  // nếu ở chế độ chat nhiều page thì toggle lựa chọn

  // xoá flag khi page không được chọn
  if (isSelectedThisPage())
    delete pageStore.selected_page_id_list[page_id.value || '']
  // set flag khi page được chọn
  else pageStore.selected_page_id_list[page_id.value || ''] = true

  // gửi sự kiện dữ liệu của trang được chọn ra ngoài
  $emit('select_page', $props.page)
}
/**kiểm tra xem page có được chọn để chat hay không */
function isSelectedThisPage() {
  // format boolean
  return !!pageStore.selected_page_id_list?.[page_id.value || '']
}
/**chỉ chat 1 page này */
function selectOnePage() {
  // nếu không có id trang thì thôi
  if (!page_id.value) return

  // tạo ra mảng chỉ chứa 1 id trang được chọn
  let temp: {
    [index: string]: boolean
  } = {}

  // set id trang được chọn
  temp[page_id.value] = true

  // chỉ chọn 1 trang
  pageStore.selected_page_id_list = temp

  // chuyển đến trang chat
  goToChat?.()
}
/**đánh dấu sao page ưu tiên lên đầu */
function togglePagePriority() {
  /**toggle giá trị ưu tiên */
  const NEW_PRIORITY = !is_priority?.value

  flow(
    [
      // * call api update page
      (cb: CbError) =>
        update_page(
          { page_id: page_id.value, is_priority: NEW_PRIORITY },
          (e, r) => {
            if (e) return cb(e)

            cb()
          }
        ),
      // * sort lại danh sách page
      (cb: CbError) => {
        if (!page_id.value) return cb()

        cb()

        set(
          pageStore.active_page_list,
          [page_id.value, 'page', 'is_priority'],
          NEW_PRIORITY
        )

        sortListPage?.()
      },
    ],
    undefined,
    true
  )
}
</script>
