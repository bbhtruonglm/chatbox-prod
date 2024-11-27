<template>
  <div
    v-if="$main.isVisible()"
    id="chat__alert-header"
    class="bg-white rounded-lg py-1 px-3 shadow-sm top-2 left-2 flex items-center gap-3"
  >
    <BellAlertIcon class="w-5 h-5 flex-shrink-0" />
    <div class="flex-grow">
      <div class="font-medium text-[10px] flex items-center gap-1">
        {{ $t('v1.view.main.dashboard.chat.message.header.note') }}
        <Badge :value="2" />
      </div>
      <div class="text-xs font-medium truncate">
        <div>
          {{ $main.formatDate() }}
          - Nhắc khách thanh toán
        </div>
      </div>
    </div>
    <ArrowDown class="-rotate-90 w-3 text-slate-500 flex-shrink-0 mr-1" />
  </div>
</template>
<script setup lang="ts">
import { EnvManage, type IEnvManage } from '@/utils/base/EnvManage'
import { container } from 'tsyringe'
import { DateHandle, type IDateHandle } from '@/utils/helper/DateHandle'

import Badge from '@/components/Badge.vue'

import BellAlertIcon from '@/components/Icons/BellAlert.vue'
import ArrowDown from '@/components/Icons/ArrowDown.vue'

class Main {
  /**
   * @param SERVICE_ENV dịch vụ quản lý biến môi trường
   * @param SERVICE_DATE dịch vụ xử lý thời gian
   */
  constructor(
    private readonly SERVICE_ENV: IEnvManage = container.resolve(EnvManage),
    private readonly SERVICE_DATE: IDateHandle = container.resolve(DateHandle)
  ) {}

  /**tạm thời chỉ hiển thị component này ở bản non prod */
  isVisible(): boolean {
    // nếu là production thì không hiển thị
    if (this.SERVICE_ENV.NODE_ENV === 'production') return false

    // nếu là non production thì hiển thị
    return true
  }
  /**định dạng thời gian */
  formatDate() {
    // tạm thời trả về hiện tại
    return this.SERVICE_DATE.format(new Date(), 'HH:mm dd/MM')
  }
}
const $main = new Main()
</script>
