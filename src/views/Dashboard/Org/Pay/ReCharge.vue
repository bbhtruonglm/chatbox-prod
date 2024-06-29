<template>
  <button class="flex gap-2.5 items-center w-fit">
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
              <input
                type="text"
                value="500.000"
                class="focus:outline-orange-500 py-2 px-3 rounded-md border w-[530px]"
              />
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
                  v-model="invoice_type"
                  value="NO"
                  :title="
                    $t('v1.view.main.dashboard.org.pay.recharge.no_invoice')
                  "
                />
                <Radio
                  v-model="invoice_type"
                  value="YES"
                  :title="
                    $t('v1.view.main.dashboard.org.pay.recharge.need_invoice')
                  "
                />
              </div>
              <div
                v-if="invoice_type === 'YES'"
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
                  CTCP Công nghệ Chatbot Việt Nam -
                  {{
                    $t(
                      'v1.view.main.dashboard.org.pay.recharge.invoice_info.tax_code'
                    )
                  }}: 0108514811
                </div>
                <div class="flex">
                  <div class="w-32">
                    {{
                      $t(
                        'v1.view.main.dashboard.org.setting.customer_info.address'
                      )
                    }}:
                  </div>
                  <div>Toà nhà Tây Hà Tower, Nam Từ Liêm, Hà Nội</div>
                </div>
                <div class="flex">
                  <div class="w-32">
                    {{
                      $t(
                        'v1.view.main.dashboard.org.setting.customer_info.representative'
                      )
                    }}:
                  </div>
                  <div>Lê Anh Tiến</div>
                </div>
                <div class="flex">
                  <div class="w-32">
                    {{
                      $t(
                        'v1.view.main.dashboard.org.setting.customer_info.phone'
                      )
                    }}:
                  </div>
                  <div>0988123123</div>
                </div>
                <div class="flex">
                  <div class="w-32">
                    {{
                      $t(
                        'v1.view.main.dashboard.org.setting.customer_info.email'
                      )
                    }}:
                  </div>
                  <div>minh@botbanhang.vn</div>
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
              <template v-for="payment_method of LIST_PAYMENT_METHOD">
                <Radio
                  v-if="
                    PAY_STEP === 'STEP_1' ||
                    (PAY_STEP === 'STEP_2' &&
                      selected_payment_method === payment_method.value)
                  "
                  v-model="selected_payment_method"
                  :value="payment_method.value"
                  :title="payment_method.title"
                />
              </template>
              <template v-if="PAY_STEP === 'STEP_2'">
                <template v-if="selected_payment_method === 'TRANSFER'">
                  <div
                    class="rounded-lg w-[674px] border border-slate-300 grid grid-cols-2 overflow-hidden text-sm"
                  >
                    <div
                      class="bg-slate-200 p-5 flex flex-col gap-2.5 border-r border-slate-300"
                    >
                      <div>
                        <div class="text-slate-700">
                          {{
                            $t(
                              'v1.view.main.dashboard.org.pay.recharge.transfer_info.account'
                            )
                          }}:
                        </div>
                        <div class="flex gap-3 items-center">
                          <div
                            class="border border-green-800 bg-green-50 py-2 px-3 rounded-lg font-semibold w-fit"
                          >
                            1919191919191919
                          </div>
                          <div class="text-blue-700 cursor-copy">
                            {{ $t('v1.common.copy') }}
                          </div>
                        </div>
                      </div>
                      <div>
                        <div class="text-slate-700">
                          {{
                            $t(
                              'v1.view.main.dashboard.org.pay.recharge.transfer_info.name'
                            )
                          }}:
                        </div>
                        <div
                          class="border border-green-800 bg-green-50 py-2 px-3 rounded-lg font-semibold w-fit"
                        >
                          CTCP Công nghệ Chatbot Việt Nam
                        </div>
                      </div>
                      <div>
                        <div class="text-slate-700">
                          {{
                            $t(
                              'v1.view.main.dashboard.org.pay.recharge.transfer_info.bank'
                            )
                          }}:
                        </div>
                        <div class="font-medium">
                          TCB - Ngân hàng Kỹ thương Việt Nam - Chi nhánh Hà
                          Thành
                        </div>
                      </div>
                    </div>
                    <div class="p-5 flex flex-col gap-2.5 items-center">
                      <div>
                        {{
                          $t(
                            'v1.view.main.dashboard.org.pay.recharge.transfer_info.qr'
                          )
                        }}
                      </div>
                      <img
                        src="@/assets/imgs/demo_qr.png"
                        class="w-44 h-44"
                      />
                    </div>
                  </div>
                  <div
                    v-html="
                      $t(
                        'v1.view.main.dashboard.org.pay.recharge.transfer_info.guild'
                      )
                    "
                    class="text-slate-700 w-[674px]"
                  />
                  <div
                    class="text-sm py-3 px-5 rounded-lg bg-yellow-50 w-[572px]"
                  >
                    <div class="font-semibold">
                      {{
                        $t(
                          'v1.view.main.dashboard.org.pay.recharge.transfer_info.hint'
                        )
                      }}:
                    </div>
                    <ul class="list-disc list-inside">
                      <li class="pl-3">
                        {{
                          $t(
                            'v1.view.main.dashboard.org.pay.recharge.transfer_info.hint_1'
                          )
                        }}
                        <a
                          href="javascript:;"
                          class="underline"
                          >{{
                            $t(
                              'v1.view.main.dashboard.org.pay.recharge.transfer_info.here'
                            )
                          }}</a
                        >
                      </li>
                      <li class="pl-3">
                        {{
                          $t(
                            'v1.view.main.dashboard.org.pay.recharge.transfer_info.hint_2'
                          )
                        }}
                      </li>
                      <li class="pl-3">
                        {{
                          $t(
                            'v1.view.main.dashboard.org.pay.recharge.transfer_info.hint_3'
                          )
                        }}
                      </li>
                      <li class="pl-3">
                        {{
                          $t(
                            'v1.view.main.dashboard.org.pay.recharge.transfer_info.hint_4'
                          )
                        }}
                      </li>
                    </ul>
                  </div>
                  <button
                    class="py-2 px-4 rounded-md text-sm font-semibold text-white bg-blue-600 hover:brightness-90 w-fit uppercase"
                  >
                    {{
                      $t(
                        'v1.view.main.dashboard.org.pay.recharge.transfer_info.check'
                      )
                    }}
                  </button>
                </template>
                <template v-else> Tính năng đang phát triển! </template>
              </template>
              <button
                v-if="PAY_STEP === 'STEP_1'"
                @click="nextStep"
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
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

import CardItem from '@/components/Main/Dashboard/CardItem.vue'
import Radio from '@/views/Dashboard/Org/Pay/ReCharge/Radio.vue'

import BackIcon from '@/components/Icons/Back.vue'
import WalletIcon from '@/components/Icons/Wallet.vue'

const { t: $t } = useI18n()

/**các phương thức thanh toán */
const LIST_PAYMENT_METHOD = [
  {
    title: $t('v1.view.main.dashboard.org.pay.recharge.transfer'),
    value: 'TRANSFER',
  },
  {
    title: $t('v1.view.main.dashboard.org.pay.recharge.vnpay'),
    value: 'VNPAY',
  },
  {
    title: $t('v1.view.main.dashboard.org.pay.recharge.zalopay'),
    value: 'ZALOPAY',
  },
  {
    title: $t('v1.view.main.dashboard.org.pay.recharge.momo'),
    value: 'MOMO',
  },
  {
    title: $t('v1.view.main.dashboard.org.pay.recharge.card'),
    value: 'CARD',
  },
]

/**có xuất hoá đơn không */
const invoice_type = ref<'YES' | 'NO'>('NO')
/**phương thức thanh toán đang chọn */
const selected_payment_method = ref<string>('TRANSFER')
/**bước thanh toán */
const PAY_STEP = ref<'STEP_1' | 'STEP_2'>('STEP_1')

/**tiếp tục thanh toán */
function nextStep() {
  // chuyển sang bước 2
  PAY_STEP.value = 'STEP_2'
}
</script>
