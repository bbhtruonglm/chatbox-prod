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
            <div class="h-[300px]">
                <iframe class="w-full h-full" :src="conversationStore.select_widget?.snap_app.url_app" frameborder="0" />
            </div>
        </template>
    </ModalBottom>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useCommonStore, useConversationStore } from '@/stores'
import { teleportCenterModelOnPcScreen } from '@/service/function'

import ModalBottom from '@/components/ModalBottom.vue'

import type { ComponentRef } from '@/service/interface/vue'

/** Sử dụng store */
const commonStore = useCommonStore()
const conversationStore = useConversationStore()

/** ref của modal chính */
const bottom_widget_modal_ref = ref<ComponentRef>()

watch(
    () => conversationStore.select_conversation,
    () => bottom_widget_modal_ref.value?.immediatelyHide()
)

onMounted(() => {
    teleportCenterModelOnPcScreen()
})

/** ẩn hiện modal */
function toggleModal(type?: string) {
    bottom_widget_modal_ref.value?.toggleModal()
}

defineExpose({ toggleModal })
</script>