<template>
  <div
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
        {{ formatDate() }}
        - Nhắc khách thanh toán
      </div>
    </div>
    <ArrowDown class="-rotate-90 w-3 text-slate-500 flex-shrink-0 mr-1" />
  </div>
</template>
<script setup lang="ts">
import { format } from 'date-fns'

import Badge from '@/components/Badge.vue'

import BellAlertIcon from '@/components/Icons/BellAlert.vue'
import ArrowDown from '@/components/Icons/ArrowDown.vue'

/**định dạng thời gian */
function formatDate() {
  return format(new Date(), 'HH:mm dd/MM')
}
</script>
