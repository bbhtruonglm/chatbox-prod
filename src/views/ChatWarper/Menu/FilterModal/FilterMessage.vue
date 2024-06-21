<template>
  <Popover
    ref="filter_popover_ref"
    position="RIGHT"
    :is_fit="false"
    width="349px"
    height="auto"
    class_content="flex flex-col gap-1"
  >
    <MenuTitle
      :title="$t('v1.view.main.dashboard.chat.filter.message.title')"
    />
    <FilterCheckbox
      v-model="conversationStore.option_filter_page_data.unread_message"
      true_value="true"
      :false_value="undefined"
      :icon="ChatDotIcon"
      :title="$t('v1.view.main.dashboard.chat.filter.message.unread')"
    />
    <FilterCheckbox
      v-model="conversationStore.option_filter_page_data.not_response_client"
      true_value="true"
      :false_value="undefined"
      :icon="ChatIcon"
      :title="$t('v1.view.main.dashboard.chat.filter.message.not_reply')"
    />
    <FilterCheckbox
      v-model="conversationStore.option_filter_page_data.not_exist_label"
      true_value="true"
      :false_value="undefined"
      :icon="TagNotIcon"
      :title="$t('v1.view.main.dashboard.chat.filter.message.not_tag')"
    />
    <FilterCheckbox
      true_value="YES"
      false_value="NO"
      v-model="conversationStore.option_filter_page_data.is_spam_fb"
      :icon="MinusIcon"
      :title="$t('v1.view.main.dashboard.chat.filter.message.spam')"
    />
  </Popover>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { useConversationStore } from '@/stores'

import Popover from '@/components/Popover.vue'
import FilterCheckbox from '@/views/ChatWarper/Menu/FilterModal/FilterCheckbox.vue'
import MenuTitle from '@/components/Main/Dashboard/MenuTitle.vue'

import ChatDotIcon from '@/components/Icons/ChatDot.vue'
import ChatIcon from '@/components/Icons/Chat.vue'
import TagNotIcon from '@/components/Icons/TagNot.vue'
import MinusIcon from '@/components/Icons/Minus.vue'

import type { ComponentRef } from '@/service/interface/vue'

const conversationStore = useConversationStore()

/**ref của popover */
const filter_popover_ref = ref<ComponentRef>()

/**loại bỏ lọc */
function clearThisFilter() {
  delete conversationStore.option_filter_page_data.unread_message
  delete conversationStore.option_filter_page_data.not_response_client
  delete conversationStore.option_filter_page_data.not_exist_label
  conversationStore.option_filter_page_data.is_spam_fb = 'NO'
}

defineExpose({ filter_popover_ref, clearThisFilter })
</script>
