<template>
  <button
    @click="$router.back()"
    class="flex gap-2.5 items-center w-fit"
  >
    <BackIcon class="w-5 h-5" />
    <span class="text-sm font-medium">
      {{ $t('v1.common.back') }}
    </span>
  </button>
  <CardItem>
    <template #icon>
      <WalletIcon class="w-5 h-5" />
    </template>
    <template #title>
      {{ $t('v1.view.main.dashboard.org.recharge') }}
    </template>
    <template #item>
      <div class="py-3">
        <div
          class="py-1 px-5 flex flex-col gap-3 rounded-lg border border-gray-200"
        >
          <div>
            <div class="p-4 font-medium">
              {{ $t('v1.view.main.dashboard.org.pay.recharge.amount') }}
            </div>
            <div class="p-4 pt-0 flex flex-col gap-2">
              <Cleave
                v-if="pay_step === 'STEP_1'"
                v-model="amount"
                :options="{
                  numeral: true,
                  numeralThousandsGroupStyle: 'thousand',
                  delimiter: '.',
                  numeralDecimalMark: ',',
                  numeralIntegerScale: 9,
                }"
                class="focus:outline-orange-500 py-2 px-3 rounded-md border w-[530px]"
              />
              <div
                v-else
                class="py-2 px-3 rounded-md border w-[530px]"
              >
                {{ currency(Number(amount)) }}
              </div>
              <div class="text-sm text-slate-500">
                {{
                  $t(
                    'v1.view.main.dashboard.org.pay.recharge.amount_description'
                  )
                }}
              </div>
            </div>
            <hr />
          </div>
          <div>
            <div class="p-4 font-medium">
              {{ $t('v1.view.main.dashboard.org.pay.recharge.invoice') }}
            </div>
            <div class="p-4 pt-0 flex flex-col gap-5">
              <div class="flex gap-5">
                <Radio
                  v-model="is_issue_invoice"
                  :value="false"
                  :title="
                    $t('v1.view.main.dashboard.org.pay.recharge.no_invoice')
                  "
                  :disabled="pay_step === 'STEP_2'"
                />
                <!-- <Radio
                  v-model="is_issue_invoice"
                  :value="true"
                  :title="
                    $t('v1.view.main.dashboard.org.pay.recharge.need_invoice')
                  "
                  :disabled="pay_step === 'STEP_2'"
                /> -->
              </div>
              <div
                v-if="is_issue_invoice"
                class="flex flex-col gap-1 text-sm"
              >
                <div class="font-semibold">
                  {{
                    $t(
                      'v1.view.main.dashboard.org.pay.recharge.invoice_info.title'
                    )
                  }}
                </div>
                <div class="font-semibold">
                  {{ orgStore.selected_org_info?.org_info?.org_company_name }}
                  -
                  {{
                    $t(
                      'v1.view.main.dashboard.org.pay.recharge.invoice_info.tax_code'
                    )
                  }}
                  :
                  {{ orgStore.selected_org_info?.org_info?.org_tax_code }}
                </div>
                <div class="flex">
                  <div class="w-32">
                    {{
                      $t(
                        'v1.view.main.dashboard.org.setting.customer_info.address'
                      )
                    }}:
                  </div>
                  <div>
                    {{ orgStore.selected_org_info?.org_info?.org_address }}
                  </div>
                </div>
                <div class="flex">
                  <div class="w-32">
                    {{
                      $t(
                        'v1.view.main.dashboard.org.setting.customer_info.representative'
                      )
                    }}:
                  </div>
                  <div>
                    {{
                      orgStore.selected_org_info?.org_info?.org_representative
                    }}
                  </div>
                </div>
                <div class="flex">
                  <div class="w-32">
                    {{
                      $t(
                        'v1.view.main.dashboard.org.setting.customer_info.phone'
                      )
                    }}:
                  </div>
                  <div>
                    {{ orgStore.selected_org_info?.org_info?.org_phone }}
                  </div>
                </div>
                <div class="flex">
                  <div class="w-32">
                    {{
                      $t(
                        'v1.view.main.dashboard.org.setting.customer_info.email'
                      )
                    }}:
                  </div>
                  <div>
                    {{ orgStore.selected_org_info?.org_info?.org_email }}
                  </div>
                </div>
              </div>
            </div>
            <hr />
          </div>
          <div>
            <div class="p-4 font-medium">
              {{ $t('v1.view.main.dashboard.org.pay.recharge.pay') }}
            </div>
            <div class="p-4 pt-0 flex flex-col gap-5">
              <template v-for="method of LIST_PAYMENT_METHOD">
                <Radio
                  v-if="
                    pay_step === 'STEP_1' ||
                    (pay_step === 'STEP_2' && payment_method === method.value)
                  "
                  v-model="payment_method"
                  :value="method.value"
                  :title="method.title"
                  :disabled="method.disabled"
                  :class="{
                    '!cursor-not-allowed': method.disabled,
                  }"
                />
              </template>
              <template v-if="pay_step === 'STEP_2'">
                <template v-if="payment_method === 'TRANSFER'">
                  <TransferInfo :txn_id="txn_info?.txn_id" />
                  <button
                    v-if="txn_info?.txn_status !== 'SUCCESS'"
                    @click="checkPayment"
                    class="py-2 px-4 rounded-md text-sm font-semibold text-white bg-blue-600 hover:brightness-90 w-fit uppercase"
                  >
                    {{
                      $t(
                        'v1.view.main.dashboard.org.pay.recharge.transfer_info.check'
                      )
                    }}
                  </button>
                  <div
                    v-else
                    class="py-2 px-4 rounded-md text-sm font-semibold text-green-600 bg-green-200 hover:brightness-90 w-fit"
                  >
                    {{ $t('v1.view.main.dashboard.org.pay.recharge.success') }}
                  </div>
                </template>
                <template v-else> Tính năng đang phát triển! </template>
              </template>
              <button
                v-if="pay_step === 'STEP_1'"
                @click="createTxn"
                class="py-2 px-4 rounded-md text-sm font-semibold text-white bg-blue-600 hover:brightness-90 w-fit"
              >
                {{ $t('v1.view.main.dashboard.org.pay.recharge.continue') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </template>
  </CardItem>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import Cleave from 'vue-cleave-component'
import { useOrgStore } from '@/stores'
import { toast, toastError } from '@/service/helper/alert'
import {
  create_txn,
  read_txn,
  read_wallet,
} from '@/service/api/chatbox/billing'
import { useRoute, useRouter } from 'vue-router'

import CardItem from '@/components/Main/Dashboard/CardItem.vue'
import Radio from '@/views/Dashboard/Org/Pay/ReCharge/Radio.vue'
import TransferInfo from '@/views/Dashboard/Org/Pay/ReCharge/TransferInfo.vue'

import BackIcon from '@/components/Icons/Back.vue'
import WalletIcon from '@/components/Icons/Wallet.vue'

import type { TransactionInfo } from '@/service/interface/app/billing'
import { currency } from '@/service/helper/format'

const { t: $t } = useI18n()
const orgStore = useOrgStore()
const $router = useRouter()
const $route = useRoute()

/**các phương thức thanh toán */
const LIST_PAYMENT_METHOD: {
  title: string
  value: TransactionInfo['txn_payment_method']
  disabled?: boolean
}[] = [
  {
    title: $t('v1.view.main.dashboard.org.pay.recharge.transfer'),
    value: 'TRANSFER',
  },
  // {
  //   title: $t('v1.view.main.dashboard.org.pay.recharge.vnpay'),
  //   value: 'VNPAY',
  //   disabled: true,
  // },
  // {
  //   title: $t('v1.view.main.dashboard.org.pay.recharge.zalopay'),
  //   value: 'ZALO_PAY',
  //   disabled: true,
  // },
  // {
  //   title: $t('v1.view.main.dashboard.org.pay.recharge.momo'),
  //   value: 'MOMO',
  //   disabled: true,
  // },
  // {
  //   title: $t('v1.view.main.dashboard.org.pay.recharge.card'),
  //   value: 'CARD',
  //   disabled: true,
  // },
]
/**bước thanh toán */
const pay_step = ref<'STEP_1' | 'STEP_2'>('STEP_1')
/**id giao dịch đang chọn để xem */
const selected_txn_id = ref<string>(String($route.query.txn_id))
/**số tiền nạp */
const amount = ref<string>('500000')
/**có xuất hoá đơn không */
const is_issue_invoice = ref<boolean>(false)
/**phương thức thanh toán đang chọn */
const payment_method = ref<TransactionInfo['txn_payment_method']>('TRANSFER')
/**thông tin giao dịch mới tạo */
const txn_info = ref<TransactionInfo>()

// khởi tạo dữ liệu của giao dịch đã chọn nếu có
onMounted(initSelectedTxn)

/**khởi tạo dữ liệu của giao dịch đã chọn */
async function initSelectedTxn() {
  // nếu không có txn_id thì thôi
  if (!selected_txn_id.value || !orgStore.selected_org_id) return

  // kích hoạt trạng thái loading
  orgStore.is_loading = true

  try {
    // chuyển sang bước 2
    pay_step.value = 'STEP_2'

    /**kết quả trả về */
    const RES = await read_txn(orgStore.selected_org_id, selected_txn_id.value)

    // nếu không tìm thấy giao dịch thì thôi
    if (!RES?.[0]) throw 'NOT_FOUND'

    // lưu thông tin giao dịch
    txn_info.value = RES?.[0]

    // đánh dấu có xuất hoá đơn hay không
    is_issue_invoice.value = txn_info.value.txn_is_issue_invoice || false

    // lấy thông tin phương thức thanh toán
    payment_method.value = txn_info.value.txn_payment_method

    // lấy số tiền
    amount.value = String(txn_info.value.txn_amount)
  } catch (e) {
    // hiển thị thông báo lỗi
    toastError(e)
  }

  // kích hoạt trạng thái loading
  orgStore.is_loading = false
}
/**tạo mới giao dịch */
async function createTxn() {
  // nếu chưa chọn tổ chức nào thì không thực hiện
  if (!orgStore.selected_org_id || orgStore.is_loading) return

  // kích hoạt trạng thái loading
  orgStore.is_loading = true

  try {
    /**số tiền nạp */
    const AMOUNT = Number(amount.value)

    // kiểm tra số tiền nạp có hợp lệ không
    if (!AMOUNT || AMOUNT < 50000 || AMOUNT > 250000000)
      throw $t('v1.view.main.dashboard.org.pay.recharge.amount_description')

    /**lấy thông tin ví hiện tại */
    const WALLET_INFO = await read_wallet(orgStore.selected_org_id)

    /**id ví */
    const WALLET_ID = WALLET_INFO?.wallet_id

    // kiểm tra ví có tồn tại không
    if (!WALLET_ID)
      throw $t('v1.view.main.dashboard.org.pay.recharge.wrong_wallet_id')

    // tạo giao dịch
    txn_info.value = await create_txn(
      orgStore.selected_org_id,
      WALLET_ID,
      AMOUNT,
      payment_method.value,
      is_issue_invoice.value
    )

    // chuyển sang bước 2
    pay_step.value = 'STEP_2'
  } catch (e) {
    // hiển thị thông báo lỗi
    toastError(e)
  }

  // tắt trạng thái loading
  orgStore.is_loading = false
}
/**kiểm tra trạng thái thanh toán đã thành công chưa */
async function checkPayment() {
  // nếu chưa chọn tổ chức nào thì không thực hiện
  if (
    !orgStore.selected_org_id ||
    !txn_info.value?.txn_id ||
    orgStore.is_loading
  )
    return

  // kích hoạt trạng thái loading
  orgStore.is_loading = true

  try {
    /**kết quả trả về */
    const RES = await read_txn(orgStore.selected_org_id, txn_info.value?.txn_id)

    // nếu giao dịch chưa được xác minh thì thôi
    if (RES?.[0]?.txn_status !== 'SUCCESS') throw 'NOT_SUCCESS'

    // thông báo thành công
    toast('success', $t('v1.view.main.dashboard.org.pay.recharge.success'))

    // quay về trang chính
    $router.push('/dashboard/org/pay/info')
  } catch (e) {
    // nếu giao dịch chưa thành công
    if (e === 'NOT_SUCCESS')
      toast(
        'warning',
        $t('v1.view.main.dashboard.org.pay.recharge.not_success')
      )
    // hiển thị thông báo lỗi
    else toastError(e)
  }

  // tắt trạng thái loading
  orgStore.is_loading = false
}
</script>
