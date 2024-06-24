<template>
  <Popover
    ref="filter_popover_ref"
    position="RIGHT"
    :is_fit="false"
    width="349px"
    height="auto"
    class_content="flex flex-col gap-1"
  >
    <MenuTitle :title="$t('v1.view.main.dashboard.chat.filter.phone.title')" />
    <FilterCheckbox
      true_value="YES"
      :false_value="undefined"
      v-model="conversationStore.option_filter_page_data.have_phone"
      :icon="PhoneIcon"
      :title="$t('v1.view.main.dashboard.chat.filter.phone.include_phone')"
    />
    <FilterCheckbox
      true_value="NO"
      :false_value="undefined"
      v-model="conversationStore.option_filter_page_data.have_phone"
      :icon="MinusIcon"
      :title="$t('v1.view.main.dashboard.chat.filter.phone.exclude_phone')"
    />
  </Popover>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { useConversationStore } from '@/stores'

import Popover from '@/components/Popover.vue'
import FilterCheckbox from '@/views/ChatWarper/Menu/FilterModal/FilterCheckbox.vue'
import MenuTitle from '@/components/Main/Dashboard/MenuTitle.vue'

import PhoneIcon from '@/components/Icons/Phone.vue'
import MinusIcon from '@/components/Icons/Minus.vue'

const conversationStore = useConversationStore()

/**ref của popover */
const filter_popover_ref = ref<InstanceType<typeof Popover>>()

/**xoá lọc này */
function clearThisFilter() {
  delete conversationStore.option_filter_page_data.have_phone
}

defineExpose({ filter_popover_ref, clearThisFilter })
</script>
