<template>
  <CardItem>
    <template #icon>
      <ShareIcon class="size-5" />
    </template>
    <template #title>
      {{ $t('Đặt cấu hình webhook') }}
    </template>
    <template #item>
      <div class="text-sm flex flex-col gap-2">
        <div class="font-medium">
          {{ $t('Url gọi lại') }}
          <span class="text-red-500">*</span>
        </div>
        <input
          type="text"
          placeholder="https://something.com/v1/api/path"
          class="py-2 px-3.5 rounded-md border shadow-sm"
          v-model="url"
        />
        <div class="flex items-center gap-2 justify-between">
          <label class="flex items-center gap-2">
            <Toggle v-model="is_disable" />
            {{ $t('Kích hoạt') }}
          </label>
          <button
            @click="$main.saveConfig()"
            class="bg-blue-600 text-white py-2 px-4 rounded-md font-semibold w-fit"
          >
            {{ $t('Lưu lại') }}
          </button>
        </div>
      </div>
    </template>
  </CardItem>
  <CardItem class="h-full">
    <template #icon>
      <ClockIcon class="size-5" />
    </template>
    <template #title>
      {{ $t('Lịch sử cuộc gọi') }}
    </template>
    <template #item>
      <div class="overflow-x-auto text-sm">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-gray-200 text-gray-700 sticky top-0">
              <th class="py-3 px-4 font-semibold">Timestamp</th>
              <th class="py-3 px-4 font-semibold">Payload</th>
            </tr>
          </thead>
          <tbody class="text-gray-600">
            <tr
              v-for="history of histories"
              class="border-t hover:bg-gray-50"
            >
              <td class="py-3 px-4 whitespace-nowrap">
                {{ $date_handle.format(history.timestamp) }}
              </td>
              <td class="py-3 px-4">
                {{ history.payload }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>
  </CardItem>
</template>
<script setup lang="ts">
import CardItem from '@/components/Main/Dashboard/CardItem.vue'
import Toggle from '@/components/Toggle.vue'
import { useOrgStore } from '@/stores'
import { BillingAppWebhook, type IWebhookConfig } from '@/utils/api/Billing'
import { error } from '@/utils/decorator/Error'
import { loadingV2 } from '@/utils/decorator/Loading'
import { Toast } from '@/utils/helper/Alert/Toast'

import { ShareIcon, ClockIcon } from '@heroicons/vue/24/solid'
import { container } from 'tsyringe'
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import type { IWebhookHistory } from '../../../utils/api/Billing'
import { DateHandle } from '@/utils/helper/DateHandle'

const orgStore = useOrgStore()
const $toast = container.resolve(Toast)
const { t: $t } = useI18n()
const $date_handle = container.resolve(DateHandle)

/**thiết lập của webhook */
const webhook = ref<IWebhookConfig>({})
/**đường dẫn của webhook */
const url = computed({
  get() {
    return webhook.value?.url
  },
  set(val) {
    webhook.value.url = val
  },
})
/**có hủy kich hoạt không */
const is_disable = computed({
  get() {
    return !webhook.value?.disabled
  },
  set(val) {
    webhook.value.disabled = !val
  },
})
/**lịch sử */
const histories = ref<IWebhookHistory['data']>()

class Main {
  /**
   * @param API_WEBHOOK api webhook
   */
  constructor(
    private readonly API_WEBHOOK = container.resolve(BillingAppWebhook)
  ) {}

  /**đọc thiết lập hiện tại của webhook */
  @loadingV2(orgStore, 'is_loading')
  @error()
  async getWebhookInfo() {
    webhook.value = await this.API_WEBHOOK.getWebhook()
  }
  /**lưu thiết lập mới */
  @loadingV2(orgStore, 'is_loading')
  @error()
  async saveConfig() {
    webhook.value = await this.API_WEBHOOK.upsertWebhook(
      webhook.value.url || '',
      webhook.value.disabled
    )

    $toast.success($t('Đã lưu thiết lập'))
  }
  /**đọc lịch sử cuộc gọi */
  async readHistory() {
    /**kết quả */
    const RES = await this.API_WEBHOOK.getWebhookHistory()

    histories.value = RES?.data
  }
}

const $main = new Main()

// lấy dữ liệu webhook khi khởi chạy thành phần
onMounted(() => $main.getWebhookInfo())
// đọc lịch sử cuộc gọi khi khởi chạy thành phần
onMounted(() => $main.readHistory())
</script>
