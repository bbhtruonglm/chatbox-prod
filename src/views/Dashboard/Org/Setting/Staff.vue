<template>
  <CardItem>
    <template #icon>
      <UsersIcon class="w-5 h-5" />
    </template>
    <template #title>
      {{ $t('v1.view.main.dashboard.org.setting.member') }}
      ({{ orgStore.selected_org_info?.org_package?.org_current_staff }}/{{
        orgStore.selected_org_info?.org_package?.org_quota_staff
      }})
    </template>
    <template #action>
      <button
        @click="activePage"
        :class="
          isReachQuotaStaff()
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
        <template v-for="staff of list_ms">
          <ActorItem class="cursor-pointer">
            <template #avatar>
              <StaffAvatar
                :id="staff.staff_id"
                class="w-8 h-8 rounded-oval"
              />
            </template>
            <template #name>
              {{ staff?.user_info?.full_name }}
            </template>
            <template #after-name>
              <div
                v-if="staff?.ms_role !== 'ADMIN'"
                @click="prepareInactiveStaff(staff)"
                v-tooltip="
                  $t('v1.view.main.dashboard.org.setting.remove_staff')
                "
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
            <template #description>
              <div class="text-xs text-slate-500 flex-grow truncate min-w-0">
                {{
                  $t('v1.view.main.dashboard.org.setting.add_history', {
                    duration: timeAgo(staff.createdAt),
                  })
                }}
              </div>
            </template>
          </ActorItem>
        </template>
      </div>
    </template>
  </CardItem>
  <ConfirmInactive
    @done="doneInactiveStaff"
    :selected_staff
    ref="confirm_inactive_modal_ref"
  />
  <MemberShip
    @done="readMs"
    ref="member_ship_ref"
  />
</template>
<script setup lang="ts">
import { useOrgStore } from '@/stores'
import { onMounted, ref, watch } from 'vue'
import { toastError } from '@/service/helper/alert'
import { read_ms } from '@/service/api/chatbox/billing'
import { formatDistanceToNow } from 'date-fns'
import vi from 'date-fns/locale/vi'
import { remove } from 'lodash'

import CardItem from '@/components/Main/Dashboard/CardItem.vue'
import StaffAvatar from '@/components/Avatar/StaffAvatar.vue'
import ActorItem from '@/components/Main/Dashboard/ActorItem.vue'
import MemberShip from '@/views/Dashboard/Org/Setting/Staff/MemberShip.vue'
import ConfirmInactive from '@/views/Dashboard/Org/Setting/Staff/ConfirmInactive.vue'

import MinusOutlineIcon from '@/components/Icons/MinusOutline.vue'
import MinusIcon from '@/components/Icons/Minus.vue'
import UsersIcon from '@/components/Icons/Users.vue'

import type { MemberShipInfo } from '@/service/interface/app/billing'

const orgStore = useOrgStore()

/**modal xác nhận huỷ trang */
const confirm_inactive_modal_ref = ref<InstanceType<typeof ConfirmInactive>>()
/**danh sách thành viên */
const list_ms = ref<MemberShipInfo[]>()
/**tham chiếu đến component MemberShip */
const member_ship_ref = ref<InstanceType<typeof MemberShip>>()
/**nhân viên đang được chọn */
const selected_staff = ref<MemberShipInfo>()

// nạp danh sách nhân viên khi component được mount
onMounted(readMs)
// nạp danh sách nhân viên khi chọn tổ chức khác
watch(() => orgStore.selected_org_id, readMs)

/**chuẩn bị huỷ kích hoạt nhân viên */
function prepareInactiveStaff(ms?: MemberShipInfo) {
  // chọn nhân viên
  selected_staff.value = ms

  // hiển thị alert cảnh báo
  confirm_inactive_modal_ref.value?.toggleModal()
}
/**hoàn thành việc huỷ kích hoạt nhân viên */
async function doneInactiveStaff() {
  // xoá nhân viên khỏi danh sách nhân viên đang chọn
  remove(
    list_ms.value || [],
    os => os?.staff_id === selected_staff.value?.staff_id
  )

  // xoá trang đang chọn
  selected_staff.value = undefined
}
/**mở modal thêm nhân viên */
function activePage() {
  // nếu đã đạt đến giới hạn nhân viên thì thôi
  if (isReachQuotaStaff()) return

  // mở modal thêm nhân viên
  member_ship_ref.value?.toggleModal()
}
/**đã đạt đến giới hạn nhân viên chưa */
function isReachQuotaStaff() {
  return (
    (orgStore.selected_org_info?.org_package?.org_current_staff || 0) >=
    (orgStore.selected_org_info?.org_package?.org_quota_staff || 0)
  )
}
/**khoảng thời gian trước đó đến hiện tại là bao nhiêu */
function timeAgo(date?: string): string {
  // nếu không có date thì trả về rỗng
  if (!date) return ''

  // trả về khoảng cách giữa date và hiện tại
  return formatDistanceToNow(new Date(date), { addSuffix: true, locale: vi })
}
/**đọc danh sách thành viên của tổ chức */
async function readMs() {
  // nếu chưa chọn org thì thôi
  if (!orgStore.selected_org_id) return

  // bật loading
  orgStore.is_loading = true

  try {
    // lấy danh sách thành viên
    list_ms.value = await read_ms(orgStore.selected_org_id)

    // ghi đè lại tổng số nhân viên hiện tại
    if (orgStore.selected_org_info?.org_package)
      orgStore.selected_org_info.org_package.org_current_staff =
        list_ms.value.length
  } catch (e) {
    // thông báo lỗi
    toastError(e)
  }

  // tắt loading
  orgStore.is_loading = false
}
</script>
