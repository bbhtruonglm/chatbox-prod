<template>
  <CardItem>
    <template #icon>
      <StackIcon class="w-5 h-5" />
    </template>
    <template #title>
      {{ $t('v1.common.page') }}
      ({{ orgStore.selected_org_info?.org_package?.org_current_page }}/{{
        orgStore.selected_org_info?.org_package?.org_quota_page
      }})
    </template>
    <template #action>
      <button
        @click="openAddPageModal"
        :class="
          isReachPageQuota()
            ? 'cursor-not-allowed bg-slate-200 text-slate-500'
            : 'bg-blue-600 text-white'
        "
        class="py-1 px-4 rounded-md text-sm font-medium"
      >
        {{ $t('v1.common.more') }}
      </button>
    </template>
    <template #item>
      <div class="grid gap-6 grid-cols-4">
        <template v-for="os of list_os">
          <PageItem
            v-if="os?.page_info"
            :page_info="os?.page_info"
            :checkbox_is_visible="false"
            class="cursor-pointer"
          >
            <template #after-name>
              <div
                @click.stop="prepareInactivePage(os?.page_info)"
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
  <ConfirmInactive
    @done="doneInactivePage"
    :selected_page
    ref="confirm_inactive_modal_ref"
  />
  <ConnectPage
    @done="getOs()"
    ref="connect_page_ref"
  />
</template>
<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useOrgStore } from '@/stores'
import { read_os } from '@/service/api/chatbox/billing'
import { toastError } from '@/service/helper/alert'

import CardItem from '@/components/Main/Dashboard/CardItem.vue'
import PageItem from '@/components/Main/Dashboard/PageItem.vue'

import ConfirmInactive from '@/views/Dashboard/Org/Setting/Page/ConfirmInactive.vue'
import ConnectPage from '@/views/Dashboard/ConnectPage.vue'

import StackIcon from '@/components/Icons/Stack.vue'
import MinusOutlineIcon from '@/components/Icons/MinusOutline.vue'
import MinusIcon from '@/components/Icons/Minus.vue'

import type { PageInfo } from '@/service/interface/app/page'
import type { OwnerShipInfo } from '@/service/interface/app/billing'
import { remove } from 'lodash'

const orgStore = useOrgStore()

/**modal xác nhận huỷ trang */
const confirm_inactive_modal_ref = ref<InstanceType<typeof ConfirmInactive>>()
/**page đang được chọn */
const selected_page = ref<PageInfo>()
/**danh sách trang trong tổ chức */
const list_os = ref<OwnerShipInfo[]>()
/**ref của modal kết nối nền tảng */
const connect_page_ref = ref<InstanceType<typeof ConnectPage>>()

// nạp dữ liệu trang khi component được mount
onMounted(getOs)
// nạp dữ liệu trang khi tổ chức được chọn
watch(() => orgStore.selected_org_id, getOs)

/**chuẩn bị huỷ kích hoạt trang */
function prepareInactivePage(page?: PageInfo) {
  // chọn trang
  selected_page.value = page

  // hiển thị alert cảnh báo
  confirm_inactive_modal_ref.value?.toggleModal()
}
/**hoàn thành việc huỷ kích hoạt trang */
async function doneInactivePage() {
  // xoá trang khỏi danh sách trang đang chọn
  remove(
    list_os.value || [],
    os => os?.page_info?.fb_page_id === selected_page.value?.fb_page_id
  )

  // xoá trang đang chọn
  selected_page.value = undefined
}
/**lấy danh sách trang của tổ chức này */
async function getOs() {
  // nếu chưa chọn tổ chức thì thôi
  if (!orgStore.selected_org_id) return

  // bật loading
  orgStore.is_loading = true

  try {
    // lấy danh sách trang của tổ chức
    list_os.value = await read_os(orgStore.selected_org_id)

    // ghi đè lại tổng số trang hiện tại
    if (orgStore.selected_org_info?.org_package)
      orgStore.selected_org_info.org_package.org_current_page =
        list_os.value.length
  } catch (e) {
    // thông báo lỗi
    toastError(e)
  }

  // tắt loading
  orgStore.is_loading = false
}
/**kiểm tra xem tổ chức đã đạt tới giới hạn trang chưa */
function isReachPageQuota() {
  return (
    (orgStore.selected_org_info?.org_package?.org_current_page || 0) >=
    (orgStore.selected_org_info?.org_package?.org_quota_page || 0)
  )
}
/**mở modal thêm trang */
function openAddPageModal() {
  // nếu đã đạt tới giới hạn trang thì thôi
  if (isReachPageQuota()) return

  // mở modal thêm trang
  connect_page_ref.value?.toggleModal()
}
</script>
