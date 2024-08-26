<template>
  <div
    class="flex-grow min-w-0 bg-white rounded-md flex flex-col p-2 gap-2 overflow-y-auto"
  >
    <div class="flex justify-between items-center border-b p-2 flex-shrink-0">
      <div class="font-semibold">
        {{ conversationStore.select_conversation?.client_name }}
      </div>
      <button
        class="text-blue-700 bg-blue-100 rounded-md text-sm py-2 px-4 gap-2 flex items-center justify-center hover:brightness-90"
      >
        {{ $t('v1.view.main.dashboard.chat.client.edit') }}
      </button>
    </div>
    <div class="p-2 flex flex-col gap-2.5 flex-grow min-h-0 overflow-y-auto">
      <div
        class="p-1 bg-gray-100 rounded-md w-fit flex items-center flex-shrink-0"
      >
        <button
          class="py-1 px-3 rounded text-sm font-medium shadow-sm bg-white w-fit hover:brightness-90"
        >
          {{ $t('v1.view.main.dashboard.chat.client.info') }}
        </button>
        <button
          class="py-1 px-3 rounded text-sm font-medium w-fit text-gray-500 hover:brightness-90"
        >
          {{ $t('v1.view.main.dashboard.chat.client.attribute') }}
        </button>
        <button
          class="py-1 px-3 rounded text-sm font-medium w-fit text-gray-500 hover:brightness-90"
        >
          {{ $t('v1.view.main.dashboard.chat.client.ai_detect') }}
        </button>
      </div>
      <div class="flex-grow min-h-0 overflow-y-auto flex flex-col gap-2.5">
        <div class="flex-grow min-h-0 overflow-y-auto flex flex-col gap-2.5">
          <div
            v-for="(value, key) of conversationStore.select_conversation
              ?.client_bio?.fb_info"
            class="flex items-center text-sm"
          >
            <div class="w-28 font-semibold">
              {{ key }}
            </div>
            <div>
              {{ value }}
            </div>
          </div>
        </div>
        <div class="flex-shrink-0 flex items-center gap-2.5">
          <button
            class="flex items-center text-slate-700 bg-slate-100 rounded-md text-sm py-2 px-4 gap-2 justify-center w-fit hover:brightness-90"
          >
            <ReloadContentIcon class="text-slate-700 w-4 h-4" />
            {{ $t('v1.view.main.dashboard.chat.client.reload_info') }}
          </button>
          <InfoIcon
            v-tooltip="$t('v1.view.main.dashboard.chat.client.require_ext')"
            class="w-4 h-4 text-slate-500 cursor-pointer"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useConversationStore } from '@/stores'

import InfoIcon from '@/components/Icons/Info.vue'
import ReloadContentIcon from '@/components/Icons/ReloadContent.vue'

const conversationStore = useConversationStore()
</script>
