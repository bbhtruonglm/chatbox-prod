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
            {{ PAYMENT_INFO.account }}
          </div>
          <div
            @click="copyToClipboard(PAYMENT_INFO.account)"
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
          {{ PAYMENT_INFO.name }}
        </div>
      </div>
      <div>
        <div class="text-slate-700">
          {{
            $t('v1.view.main.dashboard.org.pay.recharge.transfer_info.bank')
          }}:
        </div>
        <div class="font-medium">
          {{ PAYMENT_INFO.bank }}
        </div>
      </div>
    </div>
    <div class="p-5 flex flex-col gap-2.5 items-center">
      <div>
        {{ $t('v1.view.main.dashboard.org.pay.recharge.transfer_info.qr') }}
      </div>
      <img
        src="@/assets/imgs/bbh-qr.jpg"
        class="w-44 h-44"
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

const $props = withDefaults(
  defineProps<{
    /**id giao dịch */
    txn_id?: string
  }>(),
  {}
)

const PAYMENT_INFO = {
  account: '19036252323010',
  name: 'CTCP Công nghệ Chatbot Việt Nam',
  bank: 'Ngân hàng TMCP Kỹ thương Việt Nam(Techcombank) CN Hà thành',
}
</script>
