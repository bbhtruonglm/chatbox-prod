<template>
  <div class="flex-grow min-h-0 overflow-y-auto flex flex-col gap-2.5">
    <div
      v-for="(value, key) of conversationStore.select_conversation?.client_bio
        ?.fb_info"
      class="flex items-center text-sm"
    >
      <div class="w-28 font-semibold ml-5">
        {{ getClientFieldName(key) }}
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
</template>
<script setup lang="ts">
import { useConversationStore } from '@/stores'
import { useI18n } from 'vue-i18n'

import InfoIcon from '@/components/Icons/Info.vue'
import ReloadContentIcon from '@/components/Icons/ReloadContent.vue'

const conversationStore = useConversationStore()
const { t: $t } = useI18n()

/**tạo ra tên của field */
function getClientFieldName(key: string) {
  /**đường dẫn i18n */
  const I18N_PATH = 'v1.view.main.dashboard.chat.client.field'

  /**tạo ra title */
  const TITLE = $t(`${I18N_PATH}.${key}`)

  // nếu chưa có i18n thì trả về key gốc
  if (TITLE?.includes(I18N_PATH)) return key

  // trả về title
  return TITLE
}
</script>
