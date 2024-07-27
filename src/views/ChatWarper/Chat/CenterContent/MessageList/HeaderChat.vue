<template>
  <div
    class="absolute bg-indigo-50 z-10 rounded-lg py-1 px-3 shadow-sm top-2 left-2 w-[calc(100%_-_22px)] flex items-center gap-3"
  >
    <ListIcon class="w-5 h-5 flex-shrink-0" />
    <div class="grid grid-cols-2 gap-3 flex-grow">
      <div>
        <div class="font-medium text-[10px]">
          {{ $t('v1.view.main.dashboard.chat.message.header.note') }}
          (2)
        </div>
        <div class="text-xs truncate">
          {{ formatDate() }}
          - Nhắc khách thanh toán
        </div>
      </div>
      <div>
        <div class="font-medium text-[10px]">
          {{ $t('v1.view.main.dashboard.chat.message.header.alert') }}
          (5)
        </div>
        <div class="text-xs truncate">
          {{ formatDate() }}
          - trả lời chậm
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { format } from 'date-fns'

import ListIcon from '@/components/Icons/List.vue'

/**định dạng thời gian */
function formatDate() {
  return format(new Date(), 'HH:mm dd/MM')
}
</script>
