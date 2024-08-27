<template>
  <div class="bg-slate-100 py-1 px-5 rounded text-sm font-semibold">
    {{ $t('v1.view.main.dashboard.chat.client.attribute_detail') }}
  </div>
  <button
    @click="openChatbot"
    class="py-1 px-5 text-sm font-medium text-slate-500 flex gap-1 items-center w-fit mb-3"
  >
    {{ $t('v1.view.main.dashboard.chat.client.add_attr') }}
    <NewTabIcon class="w-3.5 h-3.5" />
  </button>
  <div class="bg-slate-100 py-1 px-5 rounded text-sm font-semibold">
    {{ $t('v1.view.main.dashboard.chat.client.system_attribute') }}
  </div>
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
</template>
<script setup lang="ts">
import { useConversationStore } from '@/stores'
import { useI18n } from 'vue-i18n'
import { getItem } from '@/service/helper/localStorage'
import { openNewTab } from '@/service/function'

import NewTabIcon from '@/components/Icons/NewTab.vue'


const conversationStore = useConversationStore()
const { t: $t } = useI18n()

const locale = localStorage.getItem('locale') || 'vn'

/**mở chatbot thiết lập thuộc tính */
function openChatbot() {
  if (!$env.host.chatbot_view) return

  // nếu đang chon nhiều page thì mở chatbot với page đầu tiên
  openNewTab(
    `${$env.host.chatbot_view}dashboard/attribute?access_token=${getItem(
      'access_token'
    )}&page_id=${
      conversationStore.select_conversation?.fb_page_id
    }&locale=${locale}`
  )
}
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
