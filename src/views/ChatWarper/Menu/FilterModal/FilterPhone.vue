<template>
  <Popover
    ref="filter_popover_ref"
    position="RIGHT"
    :is_fit="false"
    width="349px"
    height="auto"
    class_content="flex flex-col gap-1"
  >
    <Phone />
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
import Phone from './Content/Phone.vue'

const conversationStore = useConversationStore()

/**ref của popover */
const filter_popover_ref = ref<InstanceType<typeof Popover>>()

/**xoá lọc này */
function clearThisFilter() {
  delete conversationStore.option_filter_page_data.have_phone
}

defineExpose({ filter_popover_ref, clearThisFilter })
</script>
