<template>
    <ModalBottom ref="bottom_widget_modal_ref" :left="commonStore.center_modal_left"
        :width="commonStore.center_modal_width">
        <template v-slot:header>
            <div class="flex items-center">
                <img :src="conversationStore.select_widget?.snap_app.icon" class="mr-1" width="20" height="20" />
                {{ conversationStore.select_widget?.snap_app.name }}
            </div>
        </template>
        <template v-slot:body>
            <div
                :class="conversationStore.select_widget?.app_installed_size === 'FULL' ? 'h-[calc(100vh_-_200px)]' : 'h-[300px]'">
                <iframe class="w-full h-full" :src="conversationStore.select_widget?.url" frameborder="0" />
            </div>
        </template>
    </ModalBottom>
    <Dropdown ref="bottom_widget_dropdown_ref" position="TOP" :is_fit="false" width="500px" height="320px" :back="250">
        <iframe class="w-full h-full" :src="conversationStore.select_widget?.url" frameborder="0" />
    </Dropdown>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useCommonStore, useConversationStore } from '@/stores'
import { isMobile, teleportCenterModelOnPcScreen } from '@/service/function'

import ModalBottom from '@/components/ModalBottom.vue'
import Dropdown from '@/components/Dropdown.vue'

import type { ComponentRef } from '@/service/interface/vue'

/** Sử dụng store */
const commonStore = useCommonStore()
const conversationStore = useConversationStore()

/** ref của modal chính */
const bottom_widget_modal_ref = ref<ComponentRef>()
/**ref của dropdown */
const bottom_widget_dropdown_ref = ref<ComponentRef>()

watch(
    () => conversationStore.select_conversation,
    () => bottom_widget_modal_ref.value?.immediatelyHide()
)

onMounted(() => {
    teleportCenterModelOnPcScreen()
})

/** ẩn hiện modal */
function toggleModal($event: MouseEvent) {
    // bottom_widget_modal_ref.value?.toggleModal()

    // nếu mobile thì mở bottom modal
    if (isMobile()) bottom_widget_modal_ref.value?.toggleModal()
    // nếu là pc thỉ mở dropdown
    else bottom_widget_dropdown_ref.value?.toggleDropdown($event)
}

defineExpose({ toggleModal })
</script>