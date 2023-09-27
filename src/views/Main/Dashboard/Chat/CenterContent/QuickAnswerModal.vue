<template>
    <ModalBottom ref="quick_anser_modal_ref" :left="commonStore.center_modal_left"
        :width="commonStore.center_modal_width">
        <template v-slot:header>
           Trả lời nhanh
        </template>
        <template v-slot:body>
            <div class="h-[150px]" v-if="loading">
                <Loading type="FULL" />
            </div>
            <div class="h-[600px] overflow-y-auto" v-if="!loading">
                <div class="flex justify-between bg-green-100 text-green-500 px-1 py-2 sticky top-0">
                    <p>Enter hoặc click để chọn</p>
                    <p>Dùng ↑ hoặc ↓ để chọn</p>
                </div>
                <div v-for="answer in quick_answers" class=" border-t py-2 px-1.5 cursor-pointer hover:bg-slate-100">
                    <div 
                        class=" bg-gray-500 text-white w-fit px-1 rounded text-xs font-bold"
                    >
                       <p class= " truncate max-w-xs" >{{ answer.title }}</p>
                    </div>
                    <p>{{ answer.content }}</p>
                </div>
            </div>
        </template>
    </ModalBottom>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useCommonStore, useConversationStore, usePageStore } from '@/stores'
import { teleportCenterModelOnPcScreen } from '@/service/function'

import { get_quick_answer } from '@/service/api/chatbox/widget'

import ModalBottom from '@/components/ModalBottom.vue'
import Loading from '@/components/Loading.vue'

import type { ComponentRef } from '@/service/interface/vue'
import type { QuickAnswerInfo } from '@/service/interface/app/message'

/** Sử dụng store */
const commonStore = useCommonStore()
const conversationStore = useConversationStore()

/** ref của modal chính */
const quick_anser_modal_ref = ref<ComponentRef>()
/** Danh sách trả lời nhanh */
const quick_answers = ref<QuickAnswerInfo[]>([])
/** Trạng thái loading */
const loading = ref<boolean>(true)

watch(
    () => conversationStore.select_conversation,
    () => quick_anser_modal_ref.value?.immediatelyHide()
)

onMounted(() => {
    teleportCenterModelOnPcScreen()
})

/** ẩn hiện modal */
function toggleModal(type?: string) {
    quick_anser_modal_ref.value?.toggleModal()
    getQuickAnswer()
}

function getQuickAnswer() {
    const page_id:string = conversationStore.select_conversation?.fb_page_id as string

    get_quick_answer({
        fb_page_id: page_id
    }, (e, r) => {
        quick_answers.value = r
        loading.value = false
    })
}

defineExpose({ toggleModal })
</script>