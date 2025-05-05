<template>
  <div
    class="flex items-center justify-between p-2 gap-3 hover:bg-gray-100 rounded-md"
  >
    <!-- Icon thông tin -->
    <div class="flex items-center flex-1 overflow-hidden gap-3">
      <button
        class="p-1.5 flex items-center justify-center rounded-full bg-gray-100"
      >
        <InformationCircleIcon
          class="text-black size-5"
        ></InformationCircleIcon>
      </button>
      <!-- Thông tin số điện thoại và thời gian -->
      <div class="flex flex-1 flex-col overflow-hidden flex-shrink-0">
        <div class="flex items-center overflow-hidden justify-between">
          <span class="font-medium text-sm text-black">{{ phone_number }}</span>
          <span class="text-xs text-slate-500">
            {{ $t('Tạo') }} {{ formatCreatedAt(created_at) }}</span
          >
        </div>
        <span class="text-sm text-black"
          >{{ $t('Gọi lần cuối') }}:
          {{ $date_handle.format(last_call, 'HH:mm dd/MM/yyyy') }}</span
        >
      </div>
    </div>
    <!-- Các nút hành động -->
    <div class="flex flex-shrink-0 items-center py-1.5 gap-2.5">
      <!--  -->
      <button
        class="size-7 flex justify-center items-center rounded-full border border-green-600 bg-green-100"
      >
        <PhoneIcon class="size-3 flex-shrink-0 text-green-600"></PhoneIcon>
      </button>
      <button
        class="size-7 flex justify-center items-center rounded-full border border-blue-700 bg-blue-100"
      >
        <Zalo class="size-3 flex-shrink-0"></Zalo>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/vi'

import { container } from 'tsyringe'
import { DateHandle } from '@/utils/helper/DateHandle'

/**icon*/
import { InformationCircleIcon, PhoneIcon } from '@heroicons/vue/24/solid'
import Zalo from '@/components/Icons/Zalo.vue'

dayjs.extend(relativeTime)
dayjs.locale('vi')

/*Prod truyền vào từ cha**/
defineProps<{
  phone_number: string
  created_at: string
  last_call: string
}>()

//*Biến đổi thời gian
const $date_handle = container.resolve(DateHandle)

//* biến đổi thời gian 
function formatCreatedAt(DATA_STR: string) {
  const DATE = dayjs(DATA_STR)
  const NOW = dayjs()

  if (NOW.diff(DATE, 'day') >= 3) {
    // Quá 3 ngày thì hiển thị dạng chuẩn
    return DATE.format('DD/MM/YYYY')
  } else {
    // Dưới 3 ngày thì hiển thị dạng tương đối: "2 ngày trước"
    return DATE.fromNow()
  }
}
</script>
