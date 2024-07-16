<template>
  <CardItem>
    <template #icon>
      <StackIcon class="w-5 h-5" />
    </template>
    <template #title>
      {{ $t('v1.common.page') }}
      (
      {{ orgStore.selected_org_info?.org_package?.org_current_page }}
      /
      {{ orgStore.selected_org_info?.org_package?.org_quota_page }}
      )
    </template>
    <template #action>
      <button
        class="bg-blue-600 text-white py-1 px-4 rounded-md text-sm font-medium"
      >
        {{ $t('v1.common.more') }}
      </button>
    </template>
    <template #item>
      <div class="grid gap-6 grid-cols-4">
        <template v-for="page of pageStore.active_page_list">
          <PageItem
            v-if="page?.page"
            :page_info="page?.page"
            :checkbox_is_visible="false"
            class="cursor-pointer"
          >
            <template #after-name>
              <div
                @click.stop="confirm_unactive_modal_ref?.toggleModal()"
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
            </template>
          </PageItem>
        </template>
      </div>
    </template>
  </CardItem>
  <Alert
    ref="confirm_unactive_modal_ref"
    class_modal="w-[507px]"
    class_body="text-zinc-500"
    class_footer="flex justify-between items-center"
  >
    <template #header>
      {{
        $t('v1.view.main.dashboard.select_page.inactive_page.title', {
          name: selected_page?.name,
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
        @click="confirm_unactive_modal_ref?.toggleModal()"
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
import { update_page } from '@/service/api/chatbox/n4-service'
import { flow } from '@/service/helper/async'
import { ref, computed } from 'vue'
import { usePageStore, useCommonStore, useOrgStore } from '@/stores'
import { set, size } from 'lodash'

import CardItem from '@/components/Main/Dashboard/CardItem.vue'
import PageItem from '@/components/Main/Dashboard/PageItem.vue'
import Alert from '@/components/Alert.vue'

import StackIcon from '@/components/Icons/Stack.vue'
import MinusOutlineIcon from '@/components/Icons/MinusOutline.vue'
import MinusIcon from '@/components/Icons/Minus.vue'

import type { CbError } from '@/service/interface/function'
import type { PageInfo } from '@/service/interface/app/page'

const pageStore = usePageStore()
const commonStore = useCommonStore()
const orgStore = useOrgStore()

/**modal xác nhận huỷ trang */
const confirm_unactive_modal_ref = ref<InstanceType<typeof Alert>>()
/**page đang được chọn */
const selected_page = ref<PageInfo>()

/**huỷ kích hoạt page này | ẩn page */
function inactivePage() {
  // tắt modal
  confirm_unactive_modal_ref.value?.toggleModal()

  /**id trang */
  const PAGE_ID = selected_page.value?.fb_page_id

  // nếu không có id trang thì thôi
  if (!PAGE_ID) return

  flow(
    [
      // * kích hoạt loading
      (cb: CbError) => {
        commonStore.is_loading_full_screen = true

        cb()
      },
      // * call api update page
      (cb: CbError) =>
        update_page({ page_id: PAGE_ID, is_active: false }, (e, r) => {
          if (e) return cb(e)

          cb()
        }),
      // * xoá page bị ẩn khỏi danh sách page và danh sách page đang chọn (nếu có)
      (cb: CbError) => {
        // xoá dữ liệu trang khỏi danh sách dữ liệu trang đang chọn
        delete pageStore.active_page_list[PAGE_ID]

        // xoá id trang khỏi danh sách id trang được chọn
        delete pageStore.selected_page_id_list[PAGE_ID]

        // TODO load lại danh sách trang sau khi xong

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
.btn-custom {
  @apply text-sm font-medium rounded-md py-2 px-4 flex items-center gap-2 hover:brightness-90;
}
</style>
