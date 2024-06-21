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
      :title="$t('v1.view.main.dashboard.chat.filter.interact.title')"
    />
    <FilterRadio
      v-model="conversationStore.option_filter_page_data.display_style"
      value="INBOX"
      :icon="ChatDotIcon"
      :title="$t('v1.view.main.dashboard.chat.filter.interact.message')"
    />
    <FilterRadio
      v-model="conversationStore.option_filter_page_data.display_style"
      value="COMMENT"
      :icon="NewSpaperIcon"
      :title="$t('v1.view.main.dashboard.chat.filter.interact.comment')"
    />
  </Popover>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { useConversationStore } from '@/stores'

import Popover from '@/components/Popover.vue'
import FilterRadio from '@/views/ChatWarper/Menu/FilterModal/FilterRadio.vue'
import MenuTitle from '@/components/Main/Dashboard/MenuTitle.vue'

import ChatDotIcon from '@/components/Icons/ChatDot.vue'
import NewSpaperIcon from '@/components/Icons/NewSpaper.vue'

const conversationStore = useConversationStore()

/**ref của popover */
const filter_popover_ref = ref<InstanceType<typeof Popover>>()

/**xoá lọc */
function clearThisFilter() {
  delete conversationStore.option_filter_page_data.display_style
}

defineExpose({ filter_popover_ref, clearThisFilter })
</script>
