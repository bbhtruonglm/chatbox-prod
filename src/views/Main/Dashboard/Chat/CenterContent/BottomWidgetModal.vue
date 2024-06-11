<template>
    <Dropdown ref="bottom_widget_dropdown_ref" position="TOP" :is_fit="false" width="500px" height="320px" :back="250">
        <iframe class="w-full h-full" :src="conversationStore.select_widget?.url" frameborder="0" />
    </Dropdown>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useConversationStore } from '@/stores'

import Dropdown from '@/components/Dropdown.vue'

import type { ComponentRef } from '@/service/interface/vue'

const conversationStore = useConversationStore()

/**ref của dropdown */
const bottom_widget_dropdown_ref = ref<ComponentRef>()

/** ẩn hiện modal */
function toggleModal($event: MouseEvent) {
    bottom_widget_dropdown_ref.value?.toggleDropdown($event)
}

defineExpose({ toggleModal })
</script>