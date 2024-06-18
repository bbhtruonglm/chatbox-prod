<template>
  <PageItem
    v-model:checkbox="pageStore.selected_page_id_list[page_id]"
    :checkbox_is_visible="selectPageStore.is_group_page_mode"
    :checkbox_is_disabled="!isActivePage(page_info)"
    :page_info="page_info"
    @click="selectPage"
    v-if="page_info?.type === filter"
    :class="isActivePage(page_info) ? 'cursor-pointer' : 'cursor-not-allowed'"
    class="border border-slate-200"
  >
    <template #after-name>
      <div :class="{
        'hidden group-hover:flex': !isActivePage(page_info)
      }" class="cursor-pointer items-center gap-2.5 flex">
        <div
          @click.stop="confirm_modal_ref?.toggleModal()"
          v-tooltip="$t('v1.view.main.dashboard.select_page.cancel_page')"
          class="group/minus hidden group-hover:flex"
        >
          <MinusOutlineIcon
            class="w-4 h-4 text-slate-500 group-hover/minus:hidden"
          />
          <MinusIcon
            class="w-4 h-4 text-slate-900 hidden group-hover/minus:block"
          />
        </div>
        <div @click.stop="togglePagePriority()">
          <StarIcon
            class="w-4 h-4 text-yellow-500"
            v-if="page_info?.is_priority"
          />
          <StarOutlineIcon
            class="w-4 h-4 text-slate-500"
            v-else
          />
        </div>
      </div>
      <span
        v-if="!isActivePage(page_info)"
        class="text-xs text-red-500 group-hover:hidden"
      >
        {{ $t('v1.common.expired') }}
      </span>
    </template>
  </PageItem>
  <Alert
    ref="confirm_modal_ref"
    class_body="text-zinc-500"
    class_footer="flex justify-between items-center"
  >
    <template #header>
      {{
        $t('v1.view.main.dashboard.select_page.inactive_page.title', {
          name: page_info?.name,
        })
      }}
    </template>
    <template #body>
      <div>
        {{ $t('v1.view.main.dashboard.select_page.inactive_page.explain') }}
      </div>
      <div
        v-html="
          $t('v1.view.main.dashboard.select_page.inactive_page.active_guild')
        "
      />
    </template>
    <template #footer>
      <button
        @click="confirm_modal_ref?.toggleModal()"
        class="btn-custom bg-slate-100 text-slate-500"
      >
        {{ $t('v1.common.close') }}
      </button>
      <button
        @click="inactivePage"
        class="btn-custom bg-red-100 text-red-500"
      >
        {{ $t('v1.common.ok') }}
      </button>
    </template>
  </Alert>
</template>
<script setup lang="ts">
import { usePageStore, useCommonStore, useSelectPageStore } from '@/stores'
import { isActivePage } from '@/service/helper/pricing'
import { set } from 'lodash'
import { update_page } from '@/service/api/chatbox/n4-service'
import { useI18n } from 'vue-i18n'
import { flow } from '@/service/helper/async'
import { computed, inject, ref } from 'vue'
import { KEY_SORT_LIST_PAGE_FUNCT } from '@/views/Dashboard/SelectPage/symbol'
import { KEY_GO_TO_CHAT_FUNCT } from '@/views/Dashboard/SelectPage/symbol'

import Alert from '@/components/Alert.vue'
import PageItem from '@/components/Main/Dashboard/PageItem.vue'

import StarIcon from '@/components/Icons/Star.vue'
import StarOutlineIcon from '@/components/Icons/StarOutline.vue'
import MinusOutlineIcon from '@/components/Icons/MinusOutline.vue'
import MinusIcon from '@/components/Icons/Minus.vue'

import type { CbError } from '@/service/interface/function'
import type { PageInfo } from '@/service/interface/app/page'

const $props = withDefaults(
  defineProps<{
    /**dữ liệu của trang */
    page_info: PageInfo
    /**lọc hiển thị nền tảng */
    filter: string
  }>(),
  {}
)

const { t: $t } = useI18n()
const pageStore = usePageStore()
const commonStore = useCommonStore()
const selectPageStore = useSelectPageStore()

/**hàm sort lại danh sách trang của component cha */
const sortListPage = inject(KEY_SORT_LIST_PAGE_FUNCT)
/**hàm đi đến trang chat */
const goToChat = inject(KEY_GO_TO_CHAT_FUNCT)

/**modal xác nhận huỷ trang */
const confirm_modal_ref = ref<InstanceType<typeof Alert>>()

/**id trang */
const page_id = computed(() => $props.page_info?.fb_page_id)
/**đánh dấu ưu tiên */
const is_priority = computed(() => $props.page_info?.is_priority)

/**chỉ chọn 1 page này để chat */
function selectPage() {
  // nếu trang đã hết hạn thì thôi
  if (!isActivePage($props.page_info)) return

  // nếu đang ở chế độ chat 1 page bấm vào page sẽ chọn luôn page đó
  if (!selectPageStore.is_group_page_mode) return selectOnePage()

  // nếu ở chế độ chat nhiều page thì toggle lựa chọn
  toggleSelectThisPage()
}
/**thay đổi giá trị lựa chọn page để chat */
function toggleSelectThisPage() {
  // xoá flag khi page không được chọn
  if (isSelectedThisPage())
    delete pageStore.selected_page_id_list[page_id.value]
  // set flag khi page được chọn
  else pageStore.selected_page_id_list[page_id.value] = true
}
/**kiểm tra xem page có được chọn để chat hay không */
function isSelectedThisPage() {
  // format boolean
  return !!pageStore.selected_page_id_list?.[page_id.value]
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
/**huỷ kích hoạt page này | ẩn page */
function inactivePage() {
  // tắt modal
  confirm_modal_ref.value?.toggleModal()

  // nếu không có id trang thì thôi
  if (!page_id.value) return

  flow(
    [
      // * kích hoạt loading
      (cb: CbError) => {
        commonStore.is_loading_full_screen = true

        cb()
      },
      // * call api update page
      (cb: CbError) =>
        update_page({ page_id: page_id.value, is_active: false }, (e, r) => {
          if (e) return cb(e)

          cb()
        }),
      // * xoá page bị ẩn khỏi danh sách page và danh sách page đang chọn (nếu có)
      (cb: CbError) => {
        // xoá dữ liệu trang khỏi danh sách dữ liệu trang đang chọn
        delete pageStore.active_page_list[page_id.value]

        // xoá id trang khỏi danh sách id trang được chọn
        delete pageStore.selected_page_id_list[page_id.value]

        // sort lại danh sách trang
        sortListPage?.()

        cb()
      },
    ],
    e => {
      // tắt loading
      commonStore.is_loading_full_screen = false
    }
  )
}
</script>
