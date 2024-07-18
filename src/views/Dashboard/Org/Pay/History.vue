<template>
  <CardItem class="h-full">
    <template #icon>
      <QueueIcon class="w-5 h-5" />
    </template>
    <template #title>
      {{ $t('v1.view.main.dashboard.org.pay.history_use') }}
    </template>
    <template #item>
      <div class="flex flex-col gap-2.5 min-h-0">
        <div class="text-slate-500 text-sm font-medium">
          {{ $t('v1.view.main.dashboard.org.pay.history_use_info') }}
        </div>
        <div class="overflow-x-auto">
          <table class="text-sm min-w-[80%]">
            <thead>
              <tr class="sticky top-0 bg-white z-10 font-semibold">
                <th class="pr-2.5 fake-border-b sticky-left text-left">
                  {{ $t('v1.view.main.dashboard.org.pay.transaction_id') }}
                </th>
                <th class="px-2.5 fake-border-b whitespace-nowrap text-left">
                  {{ $t('v1.common.status') }}
                </th>
                <th class="px-2.5 fake-border-b whitespace-nowrap text-right">
                  {{ $t('v1.view.main.dashboard.org.pay.amount') }}
                </th>
                <th class="px-2.5 fake-border-b whitespace-nowrap text-left">
                  {{ $t('v1.view.main.dashboard.org.pay.date') }}
                </th>
                <th class="px-2.5 fake-border-b whitespace-nowrap text-left">
                  {{ $t('v1.view.main.dashboard.org.pay.operator') }}
                </th>
                <th class="pl-2.5 fake-border-b"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="txn of list_txn">
                <td class="pr-2.5 py-3 sticky-left text-left">
                  {{ txn.txn_id }}
                </td>
                <td class="px-2.5 whitespace-nowrap text-left text-green-600">
                  {{ $t('v1.view.main.dashboard.org.pay.status_list.paid') }}
                </td>
                <td class="px-2.5 whitespace-nowrap text-right">
                  {{ currency(txn.txn_amount) || 0 }}
                  đ
                </td>
                <td class="px-2.5 whitespace-nowrap text-left">
                  {{ formatDate(txn.createdAt) }}
                </td>
                <td class="px-2.5 whitespace-nowrap text-left">
                  {{ txn.user_id }}
                </td>
                <td
                  class="pl-2.5 text-right text-blue-700 cursor-pointer font-medium"
                >
                  {{ $t('v1.view.main.dashboard.org.pay.view') }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </template>
  </CardItem>
</template>
<script setup lang="ts">
import { currency } from '@/service/helper/format'
import { format as format_date } from 'date-fns'
import { toastError } from '@/service/helper/alert'
import { read_txn } from '@/service/api/chatbox/billing'
import { useOrgStore } from '@/stores'
import { onMounted, ref, watch } from 'vue'

import CardItem from '@/components/Main/Dashboard/CardItem.vue'

import QueueIcon from '@/components/Icons/Queue.vue'

import type { TransactionInfo } from '@/service/interface/app/billing'

const orgStore = useOrgStore()

/**danh sách giao dịch */
const list_txn = ref<TransactionInfo[]>()

// khi component được mount
onMounted(readTxn)
// khi chọn org khác
watch(() => orgStore.selected_org_id, readTxn)

/**định dạng thời gian */
function formatDate(date?: string) {
  // nếu không có thời gian
  if (!date) return ''

  // định dạng thời gian
  return format_date(new Date(date), 'dd/MM/yyyy - HH:mm')
}

/**đọc danh sách giao dịch */
async function readTxn() {
  // kiểm tra xem đã chọn org chưa
  if (!orgStore.selected_org_id) return

  // bắt đầu loading
  orgStore.is_loading = true

  try {
    // đọc danh sách giao dịch
    list_txn.value = await read_txn(orgStore.selected_org_id)
  } catch (e) {
    // thông báo lỗi
    toastError(e)
  }

  // tắt loading
  orgStore.is_loading = false
}
</script>
<style scoped lang="scss">
.sticky-left {
  @apply whitespace-nowrap sticky left-0 bg-white;
}

.fake-border-b {
  box-shadow: inset 0 -1px 0 0 rgba(0, 0, 0, 0.1);
  padding-bottom: 5px;
}
</style>
