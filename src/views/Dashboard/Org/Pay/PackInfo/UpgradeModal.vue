<template>
  <Teleport
    to="body"
    v-if="is_open"
  >
    <Transition
      enter-active-class="transition ease-in-out duration-500"
      leave-active-class="transition ease-in-out duration-500"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0"
    >
      <div
        @click="toggleModal"
        class="absolute top-0 left-0 w-screen h-screen bg-black/10 z-20 shadow-lg"
      >
        <div
          @click.stop
          class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white max-w-[95%] h-[550px] flex flex-col shadow-lg p-3 gap-4"
        >
          <div class="px-3 text-lg font-semibold flex-shrink-0 text-center">
            {{ $t('v1.view.main.dashboard.org.pay.upgrade.title') }}
          </div>
          <div class="flex gap-3 px-10 h-48">
            <div class="w-64 item">
              <div>
                <div class="tex-xl font-bold">
                  {{ $t('v1.view.main.dashboard.org.pay.free') }}
                </div>
                <ul class="text-sm font-medium list-disc list-inside">
                  <li class="pl-2">
                    {{ $t('v1.view.main.dashboard.org.pay.upgrade.price') }}
                    <span class="font-bold">
                      {{ $t('v1.view.main.dashboard.org.pay.free') }}
                    </span>
                  </li>
                  <li class="pl-2">
                    {{ $t('v1.view.main.dashboard.org.pay.upgrade.page') }}
                    <span class="font-bold"> 2 </span>
                  </li>
                  <li class="pl-2">
                    {{ $t('v1.view.main.dashboard.org.pay.upgrade.member') }}
                    <span class="font-bold"> 5 </span>
                  </li>
                  <li class="pl-2">
                    ... ({{
                      $t('v1.view.main.dashboard.org.pay.upgrade.more')
                    }})
                  </li>
                </ul>
              </div>
              <button
                @click="downgradeFreePack"
                :class="{
                  'cursor-not-allowed': orgStore.isFreePack(),
                }"
                class="btn bg-green-500"
              >
                <template v-if="orgStore.isFreePack()">
                  {{ $t('v1.view.main.dashboard.org.pay.upgrade.current') }}
                </template>
                <template v-else>
                  {{ $t('v1.view.main.dashboard.org.pay.upgrade.back_free') }}
                </template>
              </button>
            </div>
            <div class="w-96 item">
              <div>
                <div class="flex items-center justify-between">
                  <div class="tex-xl font-bold">
                    {{ $t('v1.view.main.dashboard.org.pay.pro') }}
                  </div>
                  <Toggle
                    v-model="is_full_year"
                    class_toggle="peer-checked:bg-black"
                  >
                    <span class="text-green-600">
                      {{
                        $t('v1.view.main.dashboard.org.pay.upgrade.discount')
                      }}
                    </span>
                  </Toggle>
                </div>
                <ul class="text-sm font-medium list-disc list-inside">
                  <li class="pl-2">
                    {{ $t('v1.view.main.dashboard.org.pay.upgrade.price') }}
                    <span class="font-bold">
                      {{ currency(480000) }}đ / {{ $t('v1.common.month') }}
                    </span>
                  </li>
                  <li class="pl-2">
                    {{ $t('v1.view.main.dashboard.org.pay.upgrade.page') }}
                    <span class="font-bold"> 5 </span>
                  </li>
                  <li class="pl-2">
                    {{ $t('v1.view.main.dashboard.org.pay.upgrade.member') }}
                    <span class="font-bold"> 20 </span>
                  </li>
                  <li class="pl-2">
                    ... ({{
                      $t('v1.view.main.dashboard.org.pay.upgrade.more')
                    }})
                  </li>
                </ul>
              </div>
              <button
                @click="activeTrialOrProPack"
                :class="{
                  'cursor-not-allowed': orgStore.isProPack(),
                }"
                class="btn bg-blue-600"
              >
                <template
                  v-if="
                    orgStore.isFreePack() &&
                    !orgStore.selected_org_info?.org_package?.org_has_trial
                  "
                >
                  {{ $t('v1.view.main.dashboard.org.pay.upgrade.trial_day_7') }}
                </template>
                <template v-else-if="orgStore.isProPack()">
                  {{ $t('v1.view.main.dashboard.org.pay.upgrade.current') }}
                </template>
                <template v-else>
                  {{ $t('v1.view.main.dashboard.org.pay.upgrade.pro') }}
                </template>
              </button>
            </div>
            <div class="w-64 item">
              <div>
                <div class="tex-xl font-bold">
                  {{ $t('v1.view.main.dashboard.org.pay.upgrade.company') }}
                </div>
                <ul class="text-sm font-medium list-disc list-inside">
                  <li class="pl-2">
                    {{ $t('v1.view.main.dashboard.org.pay.upgrade.price') }}
                    {{ $t('v1.view.main.dashboard.org.pay.upgrade.contact') }}
                  </li>
                  <li class="pl-2">
                    {{ $t('v1.view.main.dashboard.org.pay.upgrade.page') }}
                    <span class="font-bold"> 5 </span>
                  </li>
                  <li class="pl-2">
                    {{ $t('v1.view.main.dashboard.org.pay.upgrade.staff') }}
                    <span class="font-bold"> 20 </span>
                  </li>
                  <li class="pl-2">
                    ... ({{
                      $t('v1.view.main.dashboard.org.pay.upgrade.more')
                    }})
                  </li>
                </ul>
              </div>
              <button
                :class="{
                  'cursor-not-allowed': orgStore.isBusinessPack(),
                }"
                @click="contactUs"
                class="btn bg-slate-500"
              >
                <template v-if="orgStore.isBusinessPack()">
                  {{ $t('v1.view.main.dashboard.org.pay.upgrade.current') }}
                </template>
                <template v-else>
                  {{ $t('v1.view.main.dashboard.org.pay.upgrade.contact_us') }}
                </template>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
<script setup lang="ts">
import { currency } from '@/service/helper/format'
import { ref } from 'vue'
import { useOrgStore } from '@/stores'
import { openNewTab } from '@/service/function'
import { BBH_PAGE_MESS } from '@/configs/constants/botbanhang'
// import { BBH_PAGE_MESS } from '@/service/constant/botbanhang'
import { toast, toastError } from '@/service/helper/alert'
import {
  active_discount,
  purchase_package,
  read_wallet,
} from '@/service/api/chatbox/billing'
import { useI18n } from 'vue-i18n'

import Toggle from '@/components/Toggle.vue'

const orgStore = useOrgStore()
const { t: $t } = useI18n()

/**ẩn hiện modal */
const is_open = ref(false)
/**mua gói Pro 1 năm */
const is_full_year = ref(false)

/**ẩn hiện modal */
function toggleModal() {
  is_open.value = !is_open.value
}
/**liên hệ với chúng tôi */
function contactUs() {
  // nếu đang ở gói doanh nghiệp thì không mở tab
  if (orgStore.isBusinessPack()) return

  // mở tab liên hệ với chúng tôi
  openNewTab(BBH_PAGE_MESS)
}
/**kích hoạt gói dùng thử hoặc gói pro */
async function activeTrialOrProPack() {
  // nếu chưa chọn org thì không làm gì
  if (!orgStore.selected_org_id || orgStore.is_loading) return

  // kích hoạt loading
  orgStore.is_loading = true

  try {
    /**
     * tính toán gói cần mua
     * - nếu chưa mua bao giờ thì cho dùng thử trước
     * - nếu đã dùng thử rồi thì mua gói pro
     */
    const PACKAGE = orgStore.selected_org_info?.org_package?.org_has_trial
      ? 'PRO'
      : 'TRIAL'

    /**dữ liệu của ví */
    const WALLET = await read_wallet(orgStore.selected_org_id)

    // nếu không có ví thì thông báo lỗi
    if (!WALLET?.wallet_id)
      throw $t('v1.view.main.dashboard.org.pay.recharge.wrong_wallet_id')

    // TODO nếu ví không đủ tiền thì redirect qua trang nạp tiền

    // nếu chọn mua gói pro 1 năm thì kích hoạt giảm giá
    if (is_full_year.value)
      try {
        // thử kích hoạt giảm giá
        await active_discount(
          orgStore.selected_org_id,
          WALLET?.wallet_id,
          PACKAGE
        )
      } catch (e) {
        // TODO nếu thất bại thì tạm thời không xử lý gì
      }

    // yêu cầu mua gói
    await purchase_package(orgStore.selected_org_id, WALLET?.wallet_id, PACKAGE)

    // thông báo mua gói thành công
    toast('success', $t('v1.view.main.dashboard.org.pay.upgrade.success'))

    // chờ 1s
    await new Promise(cb => setTimeout(cb, 1000))

    // reload lại trang
    window.location.reload()
  } catch (e) {
    if (e === 'WALLET.NOT_ENOUGH_MONEY')
      toastError($t('v1.view.main.dashboard.org.pay.upgrade.not_enough_money'))
    // nếu có lỗi thì hiện thông báo lỗi
    else toastError(e)
  }

  // tắt loading
  orgStore.is_loading = false
}
/**hạ xuống gói free */
function downgradeFreePack() {}

defineExpose({ toggleModal })
</script>
<style scoped lang="scss">
.item {
  @apply bg-slate-100 p-2 rounded-lg flex flex-col justify-between;
}
.btn {
  @apply py-2 px-4 rounded-md text-white hover:brightness-90;
}
</style>
