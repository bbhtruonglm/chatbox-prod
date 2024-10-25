<template>
  <div
    class="rounded-lg w-[674px] border border-slate-300 grid grid-cols-2 overflow-hidden text-sm"
  >
    <div
      class="bg-slate-200 p-5 flex flex-col gap-2.5 border-r border-slate-300"
    >
      <div>
        <div class="text-slate-700">
          {{
            $t('v1.view.main.dashboard.org.pay.recharge.transfer_info.account')
          }}:
        </div>
        <div class="flex gap-3 items-center">
          <div
            class="border border-green-800 bg-green-50 py-2 px-3 rounded-lg font-semibold w-fit"
          >
            {{ payment_info?.account }}
          </div>
          <div
            @click="copyToClipboard(String(payment_info?.account))"
            class="text-blue-700 cursor-copy"
          >
            {{ $t('v1.common.copy') }}
          </div>
        </div>
      </div>
      <div v-if="txn_id">
        <div class="text-slate-700">
          {{
            $t('v1.view.main.dashboard.org.pay.recharge.transfer_info.content')
          }}:
        </div>
        <div class="flex gap-3 items-center">
          <div
            class="border border-green-800 bg-green-50 py-2 px-3 rounded-lg font-semibold w-fit"
          >
            {{ txn_id }}
          </div>
          <div
            @click="copyToClipboard(txn_id)"
            class="text-blue-700 cursor-copy"
          >
            {{ $t('v1.common.copy') }}
          </div>
        </div>
      </div>
      <div>
        <div class="text-slate-700">
          {{
            $t('v1.view.main.dashboard.org.pay.recharge.transfer_info.name')
          }}:
        </div>
        <div
          class="border border-green-800 bg-green-50 py-2 px-3 rounded-lg font-semibold w-fit"
        >
          {{ payment_info?.name }}
        </div>
      </div>
      <div>
        <div class="text-slate-700">
          {{
            $t('v1.view.main.dashboard.org.pay.recharge.transfer_info.bank')
          }}:
        </div>
        <div class="font-medium">
          {{ payment_info?.bank }}
        </div>
      </div>
    </div>
    <div class="p-5 flex flex-col gap-2.5 items-center">
      <div>
        {{ $t('v1.view.main.dashboard.org.pay.recharge.transfer_info.qr') }}
      </div>
      <BankQrCode
        :bank_bin="payment_info?.bank_bin"
        :consumer_id="payment_info?.account"
        :amount
        :message="txn_id"
      />
    </div>
  </div>
  <div
    v-html="$t('v1.view.main.dashboard.org.pay.recharge.transfer_info.guild')"
    class="text-slate-700 w-[674px]"
  />
  <div class="text-sm py-3 px-5 rounded-lg bg-yellow-50 w-[572px]">
    <div class="font-semibold">
      {{ $t('v1.view.main.dashboard.org.pay.recharge.transfer_info.hint') }}:
    </div>
    <ul class="list-disc list-inside">
      <li class="pl-3">
        {{ $t('v1.view.main.dashboard.org.pay.recharge.transfer_info.hint_1') }}
        <a
          href="javascript:;"
          class="underline"
          >{{
            $t('v1.view.main.dashboard.org.pay.recharge.transfer_info.here')
          }}</a
        >
      </li>
      <li class="pl-3">
        {{ $t('v1.view.main.dashboard.org.pay.recharge.transfer_info.hint_2') }}
      </li>
      <li class="pl-3">
        {{ $t('v1.view.main.dashboard.org.pay.recharge.transfer_info.hint_3') }}
      </li>
      <li class="pl-3">
        {{ $t('v1.view.main.dashboard.org.pay.recharge.transfer_info.hint_4') }}
      </li>
    </ul>
  </div>
</template>
<script setup lang="ts">
import { copyToClipboard } from '@/service/helper/copyWithAlert'
import type { PaymentInfo } from '@/service/interface/app/billing'

import BankQrCode from '@/views/Dashboard/Org/Pay/ReCharge/BankQrCode.vue'
import { size } from 'lodash'
import { onMounted, ref, watch } from 'vue'

const $props = withDefaults(
  defineProps<{
    /**id giao dịch */
    txn_id?: string
    /**số tiền */
    amount?: string
    /**có xuất hóa đơn không */
    is_issue_invoice?: boolean
    /**có chuyển tiền về đối tác không */
    is_pay_partner?: boolean
    /**thông tin của đối tác */
    partner_info?: PaymentInfo
  }>(),
  {}
)

/**Thông tin chuyển khoản của cty */
const BBH = {
  bank_bin: 970407,
  account: 19036252323010,
  name: 'CTCP Công nghệ Chatbot Việt Nam',
  bank: 'Ngân hàng TMCP Kỹ thương Việt Nam(Techcombank) CN Hà thành',
}
/**Thông tin chuyển khoản của a Tùng */
const A_TUNG = {
  bank_bin: 970407,
  account: 91678999999,
  name: 'Nguyễn Đình Tùng',
  bank: 'Ngân hàng TMCP Kỹ thương Việt Nam(Techcombank) CN Hà thành',
}

/**Thông tin chuyển khoản */
const payment_info = ref<PaymentInfo>()

// tính toán thông tin chuyển khoản khi khởi tạo
onMounted(() => {
  payment_info.value = calcPaymentInfo()
})

// tính toán thông tin chuyển khoản khi có thay đổi mã
watch(
  () => $props.txn_id,
  () => {
    payment_info.value = calcPaymentInfo()
  }
)

/**Tính toán thông tin chuyển khoản */
function calcPaymentInfo(): PaymentInfo {
  // nếu không có mã, hoặc mã không bật chế độ đối tác, thì chuyển về cty
  if (!$props?.is_pay_partner) return BBH

  // nếu xuất hoá đơn thì vẫn chuyển về cty
  if ($props?.is_issue_invoice) return BBH

  // nếu không có thông tin đối tác thì chuyển về a Tùng
  if (!size($props?.partner_info)) return A_TUNG

  // nếu có thông tin đối tác thì chuyển về đối tác
  return $props.partner_info || A_TUNG
}
</script>
