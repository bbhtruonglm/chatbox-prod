<template>
  <MenuTitle :title="$t('v1.view.main.dashboard.chat.filter.interact.title')" />
  <FilterCheckbox
    v-model="conversationStore.option_filter_page_data.display_style"
    true_value="INBOX"
    :false_value="undefined"
    :icon="ChatDotIcon"
    :title="$t('v1.view.main.dashboard.chat.filter.interact.message')"
  />
  <FilterCheckbox
    v-model="conversationStore.option_filter_page_data.display_style"
    true_value="COMMENT"
    :false_value="undefined"
    :icon="NewSpaperIcon"
    :title="$t('v1.view.main.dashboard.chat.filter.interact.comment')"
  />
</template>

<script setup lang="ts">
import { useConversationStore } from '@/stores'

import FilterCheckbox from '@/views/ChatWarper/Menu/FilterModal/FilterCheckbox.vue'
import MenuTitle from '@/components/Main/Dashboard/MenuTitle.vue'

import ChatDotIcon from '@/components/Icons/ChatDot.vue'
import NewSpaperIcon from '@/components/Icons/NewSpaper.vue'

const conversationStore = useConversationStore()
</script>
