<template>
  <div
    @click="selectPage"
    v-if="page_info?.type === filter"
    class="p-2 flex items-center gap-2 hover:bg-slate-100 rounded-lg cursor-pointer group"
  >
    <Checkbox
      v-if="selectPageStore.is_group_page_mode"
      v-model="pageStore.selected_page_id_list[page_id]"
      class="flex-shrink-0"
    />
    <PageAvatar
      :page_info="page_info"
      class="w-8 h-8 flex-shrink-0"
    />
    <div class="w-full min-w-0">
      <div class="flex items-center gap-2">
        <div class="flex-grow min-w-0 flex gap-1 items-center">
          <StarIcon
            v-if="page_info?.is_priority"
            class="w-3 h-3 flex-shrink-0 group-hover:hidden"
          />
          <div class="truncate flex-grow min-w-0">
            {{ page_info?.name }}
          </div>
        </div>
        <div class="flex-shrink-0">
          <div class="items-center gap-2.5 hidden group-hover:flex">
            <div @click.stop="togglePagePriority()">
              <StarIcon v-if="page_info?.is_priority" />
              <StarOutlineIcon v-else />
            </div>
            <div
              @click.stop="confirm_modal_ref?.toggleModal()"
              v-tooltip="$t('v1.view.main.dashboard.select_page.cancel_page')"
              class="group/minus"
            >
              <MinusOutlineIcon class="group-hover/minus:hidden" />
              <MinusIcon class="hidden group-hover/minus:block" />
            </div>
          </div>
          <span
            v-if="!isActivePage(page_info)"
            class="text-xs text-red-500 group-hover:hidden"
          >
            {{ $t('v1.common.expired') }}
          </span>
        </div>
      </div>
      <div class="flex items-center gap-1">
        <PageTypeIcon
          :page_type="page_info?.type"
          class="flex-shrink-0 w-3.5 h-3.5"
        />
        <div class="text-xs text-slate-500 flex-grow truncate min-w-0">
          {{ page_info?.fb_page_id }}
        </div>
      </div>
    </div>
  </div>
  <Modal
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
  </Modal>
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

import Modal from '@/components/Modal.vue'
import PageAvatar from '@/components/Avatar/PageAvatar.vue'
import PageTypeIcon from '@/components/Avatar/PageTypeIcon.vue'
import Checkbox from '@/components/Checkbox.vue'

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
const confirm_modal_ref = ref<InstanceType<typeof Modal>>()

/**id trang */
const page_id = computed(() => $props.page_info?.fb_page_id)
/**đánh dấu ưu tiên */
const is_priority = computed(() => $props.page_info?.is_priority)

/**chỉ chọn 1 page này để chat */
function selectPage() {
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
<style scoped lang="scss">
.custom-checkbox {
  @apply appearance-none w-4 h-4 shadow-sm bg-white border-[1.5px] border-black rounded relative cursor-pointer;

  &:checked {
    @apply bg-black;

    &::after {
      content: '';
      @apply absolute border-white top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-45 border-r-2 border-b-2 w-1 h-2;
    }
  }

  &:disabled {
    @apply cursor-not-allowed border-gray-200 bg-gray-100;

    &::after {
      @apply border-gray-200;
    }
  }
}
.btn-custom {
  @apply justify-between text-sm font-medium py-2 px-4 rounded-md hover:brightness-90;
}
</style>
