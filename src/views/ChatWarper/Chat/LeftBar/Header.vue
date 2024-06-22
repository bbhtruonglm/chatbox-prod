<template>
  <div class="flex-shrink-0 px-2 gap-1 flex justify-start items-center">
    <div
      v-tooltip.bottom="`v${version}`"
      class="font-semibold text-2xl"
    >
      {{ $t('v1.common.title') }}
    </div>
    <Badge
      v-if="count_all_unread"
      :value="count_all_unread"
    />
  </div>
  <div class="flex-shrink-0 px-2 relative">
    <SearchIcon
      class="absolute top-1/2 left-5 -translate-y-1/2 w-5 h-5 text-slate-500"
    />
    <input
      v-model="search_conversation"
      @keyup="onSearchConversation"
      class="w-full focus:outline-orange-500 bg-slate-100 placeholder-slate-500 py-2 px-3 pl-10 text-sm rounded-full"
      type="text"
      :placeholder="$t('v1.common.search')"
    />
  </div>
</template>
<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useConversationStore } from '@/stores'
import { debounce, sumBy, values } from 'lodash'
import { useI18n } from 'vue-i18n'

import Badge from '@/components/Badge.vue'

import SearchIcon from '@/components/Icons/Search.vue'

const conversationStore = useConversationStore()
const { t: $t } = useI18n()

/**phiên bản trong package.json */
const version = npm_package_version
/**giá trị của ô tìm kiếm hội thoại */
const search_conversation = ref<string>()
/**tổng số tin nhắn chưa đọc */
const count_all_unread = computed(countAllUnRead)

onMounted(() => {
  if (conversationStore.option_filter_page_data.search) {
    // load giá trị search được lưu từ local vào biến khi load lại trang
    search_conversation.value = conversationStore.option_filter_page_data.search
  }
})

/**delay tìm kiếm hội thoại */
const onSearchConversation = debounce(($event: Event) => {
  const INPUT = $event.target as HTMLInputElement

  conversationStore.option_filter_page_data.search = INPUT.value
}, 300)

/**tính tổng số tin nhắn chưa đọc */
function countAllUnRead() {
  return sumBy(
    values(conversationStore.conversation_list),
    'unread_message_amount'
  )
}
</script>
