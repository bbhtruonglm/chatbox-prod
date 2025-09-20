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
          class="w-full h-full p-3 flex flex-grow min-h-0 overflow-y-auto justify-center items-center"
        >
          <div
            class="p-3 rounded-lg bg-slate-50 w-full flex flex-col shadow-lg gap-10 max-h-screen overflow-y-auto"
          >
            <div class="px-3 text-lg font-semibold flex-shrink-0 text-center">
              {{ $t('v1.view.main.dashboard.org.pay.upgrade.title') }}
            </div>
            <div class="grid grid-cols-4 gap-3">
              <div class="item">
                <Content :content="CONTENTS.FREE" />
                <button
                  v-if="orgStore.isFreePack() || orgStore.isTrialPack()"
                  @click="downgradeFreePack"
                  class="btn text-slate-700 bg-slate-200 cursor-not-allowed"
                >
                  {{ $t('v1.view.main.dashboard.org.pay.upgrade.current') }}
                </button>
              </div>
              <div class="item max-w-80">
                <Content
                  :content="CONTENTS.LITE"
                  :is_full_year
                >
                  <template #toggle>
                    <Toggle
                      v-model="is_full_year"
                      class_toggle="peer-checked:bg-black"
                    >
                      <span class="text-green-600">
                        {{ $t('v1.view.main.dashboard.org.pay.upgrade.year') }}
                      </span>
                    </Toggle>
                  </template>
                  <template #chat_feature>
                    (<a
                      class="underline text-blue-700"
                      href="https://retion.ai"
                      target="_blank"
                    >
                      {{
                        $t('v1.view.main.dashboard.org.pay.upgrade.more')
                      }} </a
                    >)
                  </template>
                  <template #ai_feature>
                    (<a
                      class="underline text-blue-700"
                      href="https://retion.ai"
                      target="_blank"
                    >
                      {{
                        $t('v1.view.main.dashboard.org.pay.upgrade.more')
                      }} </a
                    >)
                  </template>
                  <template #support>
                    (<a
                      class="underline text-blue-700"
                      href="https://bbh.gitbook.io/bot-ban-hang-docs"
                      target="_blank"
                    >
                      {{
                        $t('v1.view.main.dashboard.org.pay.upgrade.more')
                      }} </a
                    >)
                  </template>
                </Content>
                <button
                  v-if="!orgStore.isBusinessPack() && !orgStore.isProPack()"
                  @click="openConfirmModal('LITE')"
                  :class="{
                    'cursor-not-allowed !text-slate-700 bg-slate-200':
                      orgStore.isLitePack(),
                  }"
                  class="btn text-white bg-green-600"
                >
                  <template v-if="orgStore.isLitePack()">
                    {{ $t('v1.view.main.dashboard.org.pay.upgrade.current') }}
                  </template>
                  <template v-else>
                    {{ $t('v1.view.main.dashboard.org.pay.upgrade.lite') }}
                  </template>
                </button>
              </div>
              <div class="item max-w-80">
                <Content
                  :content="CONTENTS.PRO"
                  :is_full_year
                >
                  <template #toggle>
                    <Toggle
                      v-model="is_full_year"
                      class_toggle="peer-checked:bg-black"
                    >
                      <span class="text-green-600">
                        {{ $t('v1.view.main.dashboard.org.pay.upgrade.year') }}
                      </span>
                    </Toggle>
                  </template>
                  <template #chat_feature>
                    (<a
                      class="underline text-blue-700"
                      href="https://retion.ai"
                      target="_blank"
                    >
                      {{
                        $t('v1.view.main.dashboard.org.pay.upgrade.more')
                      }} </a
                    >)
                  </template>
                  <template #ai_feature>
                    (<a
                      class="underline text-blue-700"
                      href="https://retion.ai"
                      target="_blank"
                    >
                      {{
                        $t('v1.view.main.dashboard.org.pay.upgrade.more')
                      }} </a
                    >)
                  </template>
                </Content>
                <!-- @click="activeTrialOrProPack('PRO')" -->
                <button
                  v-if="!orgStore.isBusinessPack()"
                  @click="openConfirmModal('PRO')"
                  :class="{
                    'cursor-not-allowed !text-slate-700 bg-slate-200':
                      orgStore.isProPack(),
                    'bg-blue-600 text-white': !orgStore.hasTrial(),
                    'bg-green-600 text-white': orgStore.hasTrial(),
                  }"
                  class="btn"
                >
                  <template
                    v-if="
                      orgStore.isFreePack() &&
                      !orgStore.selected_org_info?.org_package?.org_has_trial
                    "
                  >
                    {{
                      $t('v1.view.main.dashboard.org.pay.upgrade.trial_day_7')
                    }}
                  </template>
                  <template v-else-if="orgStore.isProPack()">
                    {{ $t('v1.view.main.dashboard.org.pay.upgrade.current') }}
                  </template>
                  <template v-else>
                    {{ $t('v1.view.main.dashboard.org.pay.upgrade.pro') }}
                  </template>
                </button>
              </div>
              <div class="item max-w-80">
                <Content
                  :content="CONTENTS.COMPANY"
                  :is_full_year
                >
                  <template #toggle>
                    <Toggle
                      v-model="is_full_year"
                      class_toggle="peer-checked:bg-black"
                    >
                      <span class="text-green-600">
                        {{ $t('v1.view.main.dashboard.org.pay.upgrade.year') }}
                      </span>
                    </Toggle>
                  </template>
                </Content>
                <!-- @click="activeTrialOrProPack('BUSINESS')" -->
                <button
                  :class="{
                    'cursor-not-allowed !text-slate-700 bg-slate-200':
                      orgStore.isBusinessPack(),
                  }"
                  @click="openConfirmModal('BUSINESS')"
                  class="btn text-white bg-green-600"
                >
                  <template v-if="orgStore.isBusinessPack()">
                    {{ $t('v1.view.main.dashboard.org.pay.upgrade.current') }}
                  </template>
                  <template v-else>
                    {{ $t('v1.view.main.dashboard.org.pay.upgrade.business') }}
                  </template>
                </button>
              </div>
            </div>

            <a
              :href="`https://${commonStore.partner?.domain}/pricing`"
              target="_blank"
              class="text-slate-700 flex items-center gap-1 w-fit mx-auto"
            >
              {{ $t('v1.view.main.dashboard.org.pay.upgrade.detail') }}
              <NewTabIcon class="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
  <Teleport to="body">
    <Transition
      enter-active-class="transition ease-in-out duration-300"
      leave-active-class="transition ease-in-out duration-300"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0"
    >
      <div
        v-if="is_confirm_open"
        class="fixed top-0 left-0 w-screen h-screen py-10 bg-black/30 z-30 flex items-center justify-center"
      >
        <div
          class="bg-white rounded-lg shadow-lg p-6 w-[800px] max-h-full text-center flex flex-col gap-4"
          @click.stop
        >
          <div class="flex justify-between items-center">
            <h3 class="text-lg font-semibold">
              {{ $t('v1.view.main.dashboard.org.pay.upgrade.confirm_title') }}
            </h3>
            <div
              @click="closeConfirmModal"
              class="cursor-pointer"
            >
              <XMarkIcon class="size-4" />
            </div>
          </div>

          <div
            class="overflow-hidden min-h-0 flex-grow overflow-y-auto flex flex-col gap-2.5"
          >
            <div
              class="flex gap-2.5"
              :class="[
                pay_step === 'STEP_2'
                  ? 'border-b border-dashed border-slate-500'
                  : '',
              ]"
            >
              <div class="py-3 w-1/2 flex flex-col gap-2.5 items-start text-sm">
                <label class="font-semibold">{{ $t('Thông tin gói') }}</label>
                <p>
                  {{
                    $t('v1.view.main.dashboard.org.pay.upgrade.upgrade_package')
                  }}
                  :
                  <span class="font-semibold">
                    {{ selectedPack }}
                  </span>
                </p>
                <p>
                  {{ $t('v1.view.main.dashboard.org.pay.upgrade.time') }} :
                  <span class="font-semibold">
                    {{ $t('v1.view.main.dashboard.org.pay.upgrade.one_month') }}
                  </span>
                </p>
                <p>
                  {{ $t('v1.view.main.dashboard.org.pay.upgrade.cost') }} :
                  <span class="font-semibold">
                    {{ currency(Number(amount)) }}đ
                  </span>
                </p>
              </div>
              <div class="py-3 w-1/2 text-sm flex flex-col gap-2.5 items-start">
                <label class="font-semibold">{{
                  $t('Thông tin thanh toán')
                }}</label>
                <div class="flex gap-5">
                  <Radio
                    v-model="is_issue_invoice"
                    :value="false"
                    :title="
                      $t('v1.view.main.dashboard.org.pay.recharge.no_invoice')
                    "
                    :disabled="pay_step === 'STEP_2'"
                  />
                  <Radio
                    v-model="is_issue_invoice"
                    :value="true"
                    :title="
                      $t('v1.view.main.dashboard.org.pay.recharge.need_invoice')
                    "
                    :disabled="pay_step === 'STEP_2'"
                  />
                </div>
                <p>
                  {{
                    $t('v1.view.main.dashboard.org.pay.upgrade.total_amount')
                  }}
                  :
                  <span class="font-semibold">
                    {{ currency(Number(amount)) }}đ
                  </span>
                </p>
                <div class="w-full flex flex-col gap-2">
                  <div class="text-start">
                    {{
                      $t(
                        'v1.view.main.dashboard.org.pay.recharge.voucher.title'
                      )
                    }}
                  </div>
                  <div class="pt-0 flex flex-col gap-2">
                    <input
                      v-if="pay_step === 'STEP_1'"
                      v-model="voucher_code"
                      @keyup="debounceVerifyVoucher"
                      class="focus:outline-gray-400 py-2 px-3 rounded-md border w-full"
                      :placeholder="
                        $t(
                          'v1.view.main.dashboard.org.pay.recharge.voucher.description'
                        )
                      "
                    />
                    <div
                      v-else
                      class="py-2 px-3 rounded-md border w-full"
                    >
                      <span v-if="voucher_code">{{ voucher_code }}</span>
                      <span
                        v-else
                        class="text-slate-500"
                      >
                        {{
                          $t(
                            'v1.view.main.dashboard.org.pay.recharge.voucher.empty'
                          )
                        }}
                      </span>
                    </div>
                    <div
                      v-if="verify_voucher?.is_verify === false"
                      class="text-sm text-red-500"
                    >
                      {{
                        $t(
                          'v1.view.main.dashboard.org.pay.recharge.voucher.wrong'
                        )
                      }}
                    </div>
                    <div
                      v-else
                      class="text-sm text-green-600 text-left"
                    >
                      {{
                        getPriceChangeText(
                          Number(verify_voucher?.txn_origin_amount),
                          Number(verify_voucher?.txn_amount)
                        )
                      }}
                    </div>
                  </div>
                </div>
                <p>
                  {{
                    $t('v1.view.main.dashboard.org.pay.upgrade.payment_amount')
                  }}
                  :
                  <span class="font-semibold text-green-600">
                    {{
                      currency(Number(verify_voucher?.txn_amount || amount))
                    }}đ
                  </span>
                </p>
              </div>
            </div>
            <div
              v-if="pay_step === 'STEP_2'"
              class="text-left"
            >
              <div class="flex flex-col p-4 pt-0 gap-3">
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
                    {{
                      orgStore.selected_org_info?.org_info?.org_company_name ||
                      orgStore.selected_org_info?.org_info?.org_name
                    }}
                    <template
                      v-if="orgStore.selected_org_info?.org_info?.org_tax_code"
                    >
                      -
                      {{
                        $t(
                          'v1.view.main.dashboard.org.pay.recharge.invoice_info.tax_code'
                        )
                      }}
                      :
                      {{ orgStore.selected_org_info?.org_info?.org_tax_code }}
                    </template>
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
                <ul
                  v-if="is_issue_invoice"
                  class="list-disc list-inside text-sm text-slate-700"
                >
                  <li class="pl-4 -indent-4">
                    {{
                      $t(
                        'v1.view.main.dashboard.org.setting.customer_info.guild_1',
                        {
                          partner: commonStore.partner?.name,
                        }
                      )
                    }}
                  </li>
                  <li class="pl-4 -indent-4">
                    {{
                      $t(
                        'v1.view.main.dashboard.org.setting.customer_info.guild_3',
                        {
                          partner: commonStore.partner?.name,
                        }
                      )
                    }}
                    <!-- hotro@botbanhang.vn -->
                  </li>
                </ul>
              </div>

              <div class="px-4 py-1 font-medium">
                {{ $t('v1.view.main.dashboard.org.pay.recharge.pay') }}
              </div>
              <div class="p-4 pt-0 flex flex-col gap-5">
                <template v-for="method of LIST_PAYMENT_METHOD">
                  <Radio
                    v-if="
                      pay_step === 'STEP_2' && payment_method === method.value
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
                    <TransferInfo
                      v-model="txn_info"
                      :amount="calcBankAmount()"
                      :txn_id="txn_info?.txn_id"
                      :is_issue_invoice
                      :is_pay_partner="
                        verify_voucher?.voucher_is_pay_partner ||
                        txn_info?.txn_voucher_info?.voucher_is_pay_partner
                      "
                      :partner_info="
                        verify_voucher?.voucher_partner_info ||
                        txn_info?.txn_voucher_info?.voucher_partner_info
                      "
                    />
                    <!-- <button
                    v-if="txn_info?.txn_status !== 'SUCCESS'"
                    @click="checkPayment"
                    class="py-2 px-4 rounded-md text-sm font-semibold text-white bg-blue-600 hover:brightness-90 w-fit uppercase"
                  >
                    {{
                      $t(
                        'v1.view.main.dashboard.org.pay.recharge.transfer_info.check'
                      )
                    }}
                  </button> -->
                  </template>
                  <template v-else> Tính năng đang phát triển! </template>
                </template>
                <!-- <button
                  v-if="pay_step === 'STEP_1'"
                  @click="createTxn"
                  class="py-2 px-4 rounded-md text-sm font-semibold text-white bg-blue-600 hover:brightness-90 w-fit"
                >
                  {{ $t('v1.view.main.dashboard.org.pay.recharge.continue') }}
                </button> -->
              </div>
            </div>
          </div>

          <div class="flex justify-between gap-4 w-full text-sm">
            <button
              @click="closeConfirmModal"
              class="py-2 px-4 rounded-md bg-slate-200 hover:brightness-95"
            >
              {{ $t('v1.view.main.dashboard.org.pay.upgrade.close') }}
            </button>
            <!-- @click="confirmPayment" -->
            <!-- :disabled="pay_step === 'STEP_2'" -->
            <button
              @click="pay_step !== 'STEP_2' && createTxn()"
              :class="[
                'py-2 px-4 rounded-md ',
                pay_step === 'STEP_2'
                  ? 'bg-blue-100 cursor-not-allowed text-blue-700'
                  : 'bg-blue-700 text-white hover:brightness-95',
              ]"
            >
              {{
                pay_step === 'STEP_2'
                  ? $t(
                      'v1.view.main.dashboard.org.pay.recharge.waiting_payment'
                    )
                  : $t('v1.view.main.dashboard.org.pay.upgrade.confirm')
              }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
<script setup lang="ts">
import { currency } from '@/service/helper/format'
import { ref, watch } from 'vue'
import { useCommonStore, useOrgStore } from '@/stores'
import { openNewTab } from '@/service/function'
import { BBH_PAGE_MESS } from '@/configs/constants/botbanhang'

import TransferInfo from '@/views/Dashboard/Org/Pay/PackInfo/TransferInfo.vue'
// import { BBH_PAGE_MESS } from '@/service/constant/botbanhang'
import { toast, toastError } from '@/service/helper/alert'
import {
  active_discount,
  create_txn,
  purchase_package,
  read_wallet,
} from '@/service/api/chatbox/billing'
import { useI18n } from 'vue-i18n'

import Toggle from '@/components/Toggle.vue'
import Content from '@/views/Dashboard/Org/Pay/PackInfo/UpgradeModal/Content.vue'

import Radio from '@/views/Dashboard/Org/Pay/ReCharge/Radio.vue'
import NewTabIcon from '@/components/Icons/NewTab.vue'

import type { IContent } from './UpgradeModal/type'
import { XMarkIcon } from '@heroicons/vue/24/solid'
import {
  BillingAppVoucher,
  type ResponseVerifyVoucher,
} from '@/utils/api/Billing'
import { debounce, size } from 'lodash'
import type { TransactionInfo } from '@/service/interface/app/billing'

const commonStore = useCommonStore()
const orgStore = useOrgStore()
const { t: $t } = useI18n()

/** Hàm tính toán hiển thị text sau khi nhập mã thành công
 * @param original_price giá gốc
 * @param new_price giá sau khi add voucher
 */
function getPriceChangeText(original_price: number, new_ơrice: number): string {
  /** Tính toán chenh lệch */
  const DIFF_AMOUNT = new_ơrice - original_price
  /** Nếu tí hơn là giảm giá */
  if (DIFF_AMOUNT < 0) {
    return `Bạn được giảm giá ${Math.abs(DIFF_AMOUNT).toLocaleString()}đ`
    /** Nếu nhiều hơn là tăng giá */
  } else if (DIFF_AMOUNT > 0) {
    return `Bạn phải trả thêm ${DIFF_AMOUNT.toLocaleString()}đ`
  } else {
    return ''
  }
}

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

/**phương thức thanh toán đang chọn */
const payment_method = ref<TransactionInfo['txn_payment_method']>('TRANSFER')
/**nội dung của các gói */
const CONTENTS: Record<string, IContent> = {
  /**gói miễn phí */
  FREE: {
    title: $t('v1.view.main.dashboard.org.pay.free'),
    price: $t('v1.view.main.dashboard.org.pay.free'),
    page: '1',
    member: '1',
    ai_text: '100.000 ' + $t('v1.view.main.dashboard.org.pay.text'),
    ai_image: '100 ' + $t('v1.view.main.dashboard.org.pay.image'),
    ai_sound: '100 ' + $t('v1.view.main.dashboard.org.pay.minute'),
    fau: '1.000 ' + $t('v1.view.main.dashboard.org.pay.fau'),
    client: '600',
    chat_feature: $t('v1.view.main.dashboard.org.pay.basic'),
    ai_feature: $t('v1.view.main.dashboard.org.pay.basic'),
    company_name: $t('v1.view.main.dashboard.org.pay.none'),
    api_integrate: $t('v1.view.main.dashboard.org.pay.none'),
    domain_logo: $t('v1.view.main.dashboard.org.pay.none'),
    support: $t('v1.view.main.dashboard.org.pay.not_support'),
  },
  /** gói lite */
  LITE: {
    title: $t('v1.view.main.dashboard.org.pay.lite'),
    price: '199.000 / ' + $t('v1.view.main.dashboard.org.pay.month'),
    price_year: $t('v1.view.main.dashboard.org.pay.avarage_year', {
      amount: '2.388.000',
    }),
    price_discount:
      '<span class="line-through font-normal">199.000</span> <span class="text-green-700">199.000</span> / ' +
      $t('v1.view.main.dashboard.org.pay.month'),
    price_discount_year: $t('v1.view.main.dashboard.org.pay.avarage_year', {
      amount: '2.388.000',
    }),
    page: '3',
    member: '3',
    ai_text: '1.000.000 ' + $t('v1.view.main.dashboard.org.pay.text'),
    ai_image: '1.000 ' + $t('v1.view.main.dashboard.org.pay.image'),
    ai_sound: '1000 ' + $t('v1.view.main.dashboard.org.pay.minute'),
    fau: '10.000 ' + $t('v1.view.main.dashboard.org.pay.fau'),
    client: $t('v1.view.main.dashboard.org.pay.unlimited'),
    chat_feature: $t('v1.view.main.dashboard.org.pay.all'),
    ai_feature: $t('v1.view.main.dashboard.org.pay.basic'),
    company_name: $t('v1.view.main.dashboard.org.pay.none'),
    api_integrate: $t('v1.view.main.dashboard.org.pay.none'),
    domain_logo: $t('v1.view.main.dashboard.org.pay.none'),
    support: $t('v1.view.main.dashboard.org.pay.standard'),
    note: $t('v1.view.main.dashboard.org.pay.note'),
  },
  /**gói Pro */
  PRO: {
    title: $t('v1.view.main.dashboard.org.pay.pro'),
    price: '480.000 / ' + $t('v1.view.main.dashboard.org.pay.month'),
    price_year: $t('v1.view.main.dashboard.org.pay.avarage_year', {
      amount: '5.760.000',
    }),
    price_discount:
      '<span class="line-through font-normal">480.000</span> <span class="text-green-700">288,000</span> / ' +
      $t('v1.view.main.dashboard.org.pay.month'),
    price_discount_year: $t('v1.view.main.dashboard.org.pay.avarage_year', {
      amount: '3.456.000',
    }),
    page: '5',
    member: '10',
    ai_text: '1.000.000 ' + $t('v1.view.main.dashboard.org.pay.text'),
    ai_image: '1.000 ' + $t('v1.view.main.dashboard.org.pay.image'),
    ai_sound: '1000 ' + $t('v1.view.main.dashboard.org.pay.minute'),
    fau: '10.000 ' + $t('v1.view.main.dashboard.org.pay.fau'),
    client: $t('v1.view.main.dashboard.org.pay.unlimited'),
    chat_feature: $t('v1.view.main.dashboard.org.pay.all'),
    ai_feature: $t('v1.view.main.dashboard.org.pay.all'),
    company_name: $t('v1.view.main.dashboard.org.pay.yes'),
    api_integrate: $t('v1.view.main.dashboard.org.pay.yes'),
    domain_logo: $t('v1.view.main.dashboard.org.pay.none'),
    support: $t('v1.view.main.dashboard.org.pay.support_group'),
  },
  /**gói doanh nghiệp */
  COMPANY: {
    title: $t('v1.view.main.dashboard.org.pay.business'),
    price: '2.600.000 / ' + $t('v1.view.main.dashboard.org.pay.month'),
    price_year: $t('v1.view.main.dashboard.org.pay.avarage_year', {
      amount: '31.200.000',
    }),
    price_discount:
      '<span class="line-through font-normal">2.600.000</span> <span class="text-green-700">2.080.000</span> / ' +
      $t('v1.view.main.dashboard.org.pay.month'),
    price_discount_year: $t('v1.view.main.dashboard.org.pay.avarage_year', {
      amount: '24.960.000',
    }),
    page: '40',
    member: '40',
    ai_text: '10.000.000 ' + $t('v1.view.main.dashboard.org.pay.text'),
    ai_image: '10.000 ' + $t('v1.view.main.dashboard.org.pay.image'),
    ai_sound: '10.000 ' + $t('v1.view.main.dashboard.org.pay.minute'),
    fau: '50.000 ' + $t('v1.view.main.dashboard.org.pay.fau'),
    client: $t('v1.view.main.dashboard.org.pay.unlimited'),
    chat_feature: $t('v1.view.main.dashboard.org.pay.all'),
    ai_feature: $t('v1.view.main.dashboard.org.pay.all'),
    company_name: $t('v1.view.main.dashboard.org.pay.yes'),
    api_integrate: $t('v1.view.main.dashboard.org.pay.yes'),
    domain_logo: $t('v1.view.main.dashboard.org.pay.yes'),
    support: $t('v1.view.main.dashboard.org.pay.advanced_support'),
  },
}
/**tính ra số tiền chính xác cần quét qr */
function calcBankAmount(): string {
  // nếu không có mã giảm giá thì thôi
  if (!size(verify_voucher.value)) return amount.value

  /**số tiền mới */
  const NEW_AMOUNT = String(verify_voucher.value?.txn_origin_amount)

  // nếu tăng thì giữ nguyên số tiền
  if (amount.value == NEW_AMOUNT) return amount.value
  // nếu giảm thì lấy số tiền gốc mới
  else return NEW_AMOUNT
}

/**có xuất hoá đơn không */
const is_issue_invoice = ref<boolean>(false)
/**ẩn hiện modal */
const is_open = ref(false)
/**mua gói Pro 1 năm */
const is_full_year = ref(false)
/**dữ liệu xác thực mã khuyến mại */
const verify_voucher = ref<ResponseVerifyVoucher>({})

/**thông tin giao dịch mới tạo */
const txn_info = ref<TransactionInfo>()

const debounceVerifyVoucher = debounce(verifyVoucher, 300)
/**kiểm tra mã giảm giá */
async function verifyVoucher() {
  try {
    // nếu không có mã giảm giá thì thôi
    if (!voucher_code.value) {
      // xoá mã thì đánh dấu là hợp lệ
      verify_voucher.value = {}

      return
    }

    // kích hoạt trạng thái loading
    orgStore.is_loading = true

    /**kết quả trả về */
    verify_voucher.value = await new BillingAppVoucher().verifyVoucher(
      Number(amount.value),
      voucher_code.value
    )

    console.log(verify_voucher, 'verify_voucher')
  } catch (e) {
  } finally {
    // tắt trạng thái loading
    orgStore.is_loading = false
  }
}

/**bước thanh toán */
const pay_step = ref<'STEP_1' | 'STEP_2'>('STEP_1')

/**mã giảm giá */
const voucher_code = ref<string>()
/** modal xác nhận thanh toán */
const is_confirm_open = ref(false)

/**số tiền nạp */
const amount = ref<string>('199000')
/** Số tiền sau khi giảm giá */
const amount_after_add_voucher = ref<string>('199000')

/** gói đã chọn */
const selectedPack = ref<'LITE' | 'PRO' | 'BUSINESS' | null>(null)
/** mở modal xác nhận thanh toán */
async function openConfirmModal(pack: 'LITE' | 'PRO' | 'BUSINESS') {
  /** Trạng thái payment */
  const ON_PAYMENT = await activeTrialOrProPack(pack)
  /** Nếu ví không đủ tiền, thì mới tiếp tục, không thì bỏ qua */
  if (ON_PAYMENT !== 'WALLET.NOT_ENOUGH_MONEY') return

  selectedPack.value = pack

  if (pack === 'LITE') {
    amount.value = '199000'
  }
  if (pack === 'PRO') {
    amount.value = '480000'
  }
  if (pack === 'BUSINESS') {
    amount.value = '2600000'
  }

  is_confirm_open.value = true
}
/**tạo mới giao dịch */
async function createTxn() {
  // nếu chưa chọn tổ chức nào thì không thực hiện
  if (
    !orgStore.selected_org_id ||
    orgStore.is_loading ||
    verify_voucher.value?.is_verify === false
  )
    return

  // kích hoạt trạng thái loading
  orgStore.is_loading = true

  try {
    /**số tiền nạp */
    const AMOUNT = Number(amount.value)

    /** kiểm tra số tiền nạp có hợp lệ không */
    if (!AMOUNT || AMOUNT < 50000 || AMOUNT > 250000000)
      throw $t('v1.view.main.dashboard.org.pay.recharge.amount_description')

    /**lấy thông tin ví hiện tại */
    const WALLET_INFO = await read_wallet(orgStore.selected_org_id)

    /**id ví */
    const WALLET_ID = WALLET_INFO?.wallet_id

    /** kiểm tra ví có tồn tại không */
    if (!WALLET_ID)
      throw $t('v1.view.main.dashboard.org.pay.recharge.wrong_wallet_id')

    /** tạo giao dịch */
    txn_info.value = await create_txn(
      orgStore.selected_org_id,
      WALLET_ID,
      AMOUNT,
      payment_method.value,
      is_issue_invoice.value,
      voucher_code.value
    )

    /** chuyển sang bước 2 */
    pay_step.value = 'STEP_2'
  } catch (e) {
    // hiển thị thông báo lỗi
    toastError(e)
  }

  /** tắt trạng thái loading */
  orgStore.is_loading = false
}

/** đóng modal xác nhận thanh toán */
function closeConfirmModal() {
  is_confirm_open.value = false
  selectedPack.value = null

  verify_voucher.value = {}
  voucher_code.value = ''
}

/** gọi mua gói sau khi confirm */
async function confirmPayment() {
  if (!selectedPack.value) return
  await activeTrialOrProPack(selectedPack.value)
  closeConfirmModal()
}

/**ẩn hiện modal */
function toggleModal() {
  is_open.value = !is_open.value
}
/**liên hệ với chúng tôi */
function contactUs() {
  /** nếu đang ở gói doanh nghiệp thì không mở tab */
  if (orgStore.isBusinessPack()) return

  /** mở tab liên hệ với chúng tôi */
  openNewTab(BBH_PAGE_MESS)
}
/**kích hoạt gói dùng thử hoặc gói pro */
async function activeTrialOrProPack(pack: 'LITE' | 'PRO' | 'BUSINESS') {
  /** nếu chưa chọn org thì không làm gì */
  if (!orgStore.selected_org_id || orgStore.is_loading) return

  /** nếu đã mua gói lite thì không làm gì */
  if (orgStore.isLitePack() && pack === 'LITE') return
  /** nếu đã mua gói thì không làm gì */
  if (orgStore.isProPack() && pack === 'PRO') return
  /** nếu đã mua gói doanh nghiệp thì không làm gì */
  if (orgStore.isBusinessPack() && pack === 'BUSINESS') return

  /** kích hoạt loading */
  orgStore.is_loading = true

  try {
    /**
     * tính toán gói cần mua
     * - nếu chưa mua bao giờ mà mua gói PRO, thì cho dùng thử trước
     * - nếu đã dùng thử rồi thì mua đúng
     */
    const PACKAGE = !orgStore.hasTrial() && pack === 'PRO' ? 'TRIAL' : pack

    /**dữ liệu của ví */
    const WALLET = await read_wallet(orgStore.selected_org_id)

    /** nếu không có ví thì thông báo lỗi */
    if (!WALLET?.wallet_id)
      throw $t('v1.view.main.dashboard.org.pay.recharge.wrong_wallet_id')

    /**số tháng mua */
    const MONTHS = is_full_year.value ? 12 : 1

    /** yêu cầu mua gói */
    await purchase_package(
      orgStore.selected_org_id,
      WALLET?.wallet_id,
      PACKAGE,
      MONTHS
    )

    /** thông báo mua gói thành công */
    toast('success', $t('v1.view.main.dashboard.org.pay.upgrade.success'))

    /** chờ 1s */
    await new Promise(cb => setTimeout(cb, 1000))

    /** reload lại trang */
    window.location.reload()
  } catch (e) {
    if (e === 'WALLET.NOT_ENOUGH_MONEY') {
      /** Nếu Ví không đủ tiền, thì return text đó, không show toast nữa */
      return 'WALLET.NOT_ENOUGH_MONEY'
      // toastError($t('v1.view.main.dashboard.org.pay.upgrade.not_enough_money'))
    } else toastError(e)
    /** nếu có lỗi thì hiện thông báo lỗi */
  } finally {
    /** tắt loading */
    orgStore.is_loading = false
  }
}
/**hạ xuống gói free */
function downgradeFreePack() {}

defineExpose({ toggleModal })
</script>
<style scoped lang="scss">
.item {
  @apply bg-slate-100 p-2 rounded-lg flex flex-col justify-between gap-8;
}
.btn {
  @apply py-2 px-4 rounded-md hover:brightness-90 text-sm font-semibold;
}
</style>
