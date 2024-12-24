<template>
  <div class="flex items-center justify-between gap-3">
    <div class="flex items-center flex-grow gap-1 min-w-0">
      <template v-if="source?.user_id || source?.fb_staff_id">
        <StaffAvatar
          v-tooltip="
            getStaffInfo(source?.fb_page_id, source?.fb_staff_id)?.name
          "
          :id="source?.user_id || source?.fb_staff_id"
          class="rounded-full w-4 h-4 flex-shrink-0"
        />
        <ArrowDown class="-rotate-90 w-2 h-2 text-slate-500 flex-shrink-0" />
      </template>
      <div
        :class="{
          'font-semibold': source?.unread_message_amount,
        }"
        class="text-left truncate text-sm flex-grow min-w-0"
      >
        {{ source?.client_name || 'No name' }}
      </div>
    </div>
    <div class="flex-shrink-0 text-xs">
      {{ $date_handle.formatCompareCurrentYear(source?.last_message_time) }}
    </div>
  </div>
</template>
<script setup lang="ts">
import { getStaffInfo } from '@/service/function'
import { container } from 'tsyringe'
import { DateHandle } from '@/utils/helper/DateHandle'

import StaffAvatar from '@/components/Avatar/StaffAvatar.vue'

import ArrowDown from '@/components/Icons/ArrowDown.vue'

import type { ConversationInfo } from '@/service/interface/app/conversation'

const $date_handle = container.resolve(DateHandle)

const $props = withDefaults(
  defineProps<{
    source?: ConversationInfo
  }>(),
  {}
)
</script>
