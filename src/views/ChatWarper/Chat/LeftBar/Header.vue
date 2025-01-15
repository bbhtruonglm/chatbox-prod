<template>
  <div class="flex-shrink-0 px-2 gap-1 flex justify-start items-center">
    <div
      v-tooltip.bottom="`v${version}`"
      class="font-semibold text-2xl truncate"
    >
      <template v-if="orgStore.selected_org_info?.org_info?.org_name">
        {{ orgStore.selected_org_info?.org_info?.org_name }}
      </template>
      <template v-else>
        {{ commonStore.partner?.name }}
      </template>
    </div>
    <!-- <Badge
      v-if="count_all_unread"
      :value="count_all_unread"
    /> -->
  </div>
  <div class="flex-shrink-0 flex items-center justify-between">
    <template v-if="!is_search">
      <div class="text-sm gap-3 flex items-center h-8">
        <button
          @click="$main.activeTab('CHAT')"
          :class="{
            'font-semibold border-b-2 border-black':
              !conversationStore.option_filter_page_data.conversation_type ||
              conversationStore.option_filter_page_data.conversation_type ===
                'CHAT',
          }"
          class="h-full"
        >
          {{ $t('Chat') }}
        </button>
        <button
          @click="$main.activeTab('POST')"
          :class="{
            'font-semibold border-b-2 border-black':
              conversationStore.option_filter_page_data.conversation_type ===
              'POST',
          }"
          class="h-ful"
        >
          {{ $t('Bài viết') }}
        </button>
      </div>
      <button
        @click="$main.toggleSearch()"
        class="w-8 h-8 bg-slate-100 rounded-full flex justify-center items-center"
      >
        <SearchIcon class="w-4 h-4 text-slate-500" />
      </button>
    </template>
    <div
    v-else
      class="relative w-full"
    >
      <SearchIcon
        class="absolute top-1/2 left-3 -translate-y-1/2 w-4 h-4 text-slate-500"
      />
      <input
        v-model="search_conversation"
        @keyup="onSearchConversation"
        @blur="$main.toggleSearch()"
        ref="ref_search_conversation"
        class="w-full bg-slate-100 placeholder-slate-500 py-1.5 px-3 pl-9 text-sm rounded-full"
        type="text"
        :placeholder="$t('v1.common.search')"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import { nextTick, onMounted, ref } from 'vue'
import { useCommonStore, useConversationStore, useOrgStore } from '@/stores'
import { debounce } from 'lodash'
import { useI18n } from 'vue-i18n'

import SearchIcon from '@/components/Icons/Search.vue'

/**tab đang kích hoạt */
type IActiveTab = 'CHAT' | 'POST'

const conversationStore = useConversationStore()
const commonStore = useCommonStore()
const orgStore = useOrgStore()
const { t: $t } = useI18n()

/**phiên bản trong package.json */
const version = npm_package_version
/**giá trị của ô tìm kiếm hội thoại */
const search_conversation = ref<string>()
/**trạng thái tìm kiếm */
const is_search = ref<boolean>(false)
/**tham chiếu đến ô tìm kiếm */
const ref_search_conversation = ref<HTMLInputElement>()

/**delay tìm kiếm hội thoại */
const onSearchConversation = debounce(($event: Event) => {
  /**lấy giá trị ô tìm kiếm */
  const INPUT = $event.target as HTMLInputElement

  // lưu giá trị search vào biến
  conversationStore.option_filter_page_data.search = INPUT.value
}, 300)

class Main {
  /**chuyển đổi tab đang kích hoạt */
  activeTab(tab: IActiveTab) {
    // thay đổi cờ
    conversationStore.option_filter_page_data.conversation_type = tab
  }
  /**chuyển đổi trạng thái tìm kiếm */
  async toggleSearch() {
    // nếu đang tìm kiếm và có giá trị ô tìm kiếm thì không cho đóng ô tìm kiếm
    if (is_search.value && search_conversation.value) return

    // toggle trạng thái tìm kiếm
    is_search.value = !is_search.value

    // nếu là mở ô tìm kiếm
    if (is_search.value) {
      // chờ render xong
      await nextTick()

      // focus vào ô tìm kiếm
      ref_search_conversation.value?.focus()
    }
  }
}
const $main = new Main()

onMounted(() => {
  if (conversationStore.option_filter_page_data.search) {
    // load giá trị search được lưu từ local vào biến khi load lại trang
    search_conversation.value = conversationStore.option_filter_page_data.search
  }
})
</script>
