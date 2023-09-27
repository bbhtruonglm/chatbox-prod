<template>
    <ModalBottom @close_modal="removeEvent" ref="quick_anser_modal_ref" :left="commonStore.center_modal_left" :width="commonStore.center_modal_width">
        <template v-slot:header>
            Trả lời nhanh
        </template>
        <template v-slot:body>
            <!-- Loading -->
            <div class="h-[150px]" v-if="loading">
                <Loading type="FULL" />
            </div>

            <!-- Answers -->
            <div v-if="!loading" class="pb-5">
                <div 
                    v-if="!isMobile()"
                    class="flex justify-between bg-green-100 text-green-500 px-1 py-2"
                >
                    <p>Enter hoặc click để chọn</p>
                    <p>Dùng ↑ hoặc ↓ để chọn</p>
                </div>
                <div class="h-[550px] overflow-y-auto">
                    <div v-for="(answer, index) in quick_answers" :id="answer.id"
                        class=" border-t py-2 px-1.5 cursor-pointer hover:bg-slate-100"
                        @click="selectQuickAnswer(answer.content)" :class="{
                            'text-orange-500': answer.id === answer_selected,
                            'bg-orange-100': answer.id === answer_selected
                        }">
                        <div class=" bg-gray-500 text-white w-fit px-1 rounded text-xs font-bold">
                            <p class=" max-w-xs break-words">{{ answer.title }}</p>
                        </div>
                        <p class="whitespace-pre-line text-sm">{{ answer.content }}</p>
                    </div>
                </div>
            </div>
        </template>
    </ModalBottom>
</template>

<script setup lang="ts">
import { onMounted, ref, watch, onUnmounted } from 'vue'
import { useCommonStore, useConversationStore, usePageStore } from '@/stores'
import { teleportCenterModelOnPcScreen } from '@/service/function'

import { get_quick_answer } from '@/service/api/chatbox/widget'

import ModalBottom from '@/components/ModalBottom.vue'
import Loading from '@/components/Loading.vue'

import type { ComponentRef } from '@/service/interface/vue'
import type { QuickAnswerInfo } from '@/service/interface/app/message'
import { isMobile } from '@/service/function'

/** Sử dụng store */
const commonStore = useCommonStore()
const conversationStore = useConversationStore()
const pageStore = usePageStore()

/** ref của modal chính */
const quick_anser_modal_ref = ref<ComponentRef>()
/** Danh sách trả lời nhanh */
const quick_answers = ref<QuickAnswerInfo[]>([])
/** Trạng thái loading */
const loading = ref<boolean>(true)
/** Id của answer đang được chọn */
const answer_selected = ref<string>('')
/** Index của answer đang được chọn */
const answer_index = ref<number>(0)

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

    if(isMobile()) return
    document.addEventListener('keyup', handleKeyUp)
}
/** Lấy dữ liệu trả lời nhanh theo page */
function getQuickAnswer() {
    const page_id: string = conversationStore.select_conversation?.fb_page_id as string

    get_quick_answer({
        fb_page_id: page_id
    }, (e, r) => {
        quick_answers.value = r
        loading.value = false

        setDefaultQuickAnswer()
    })
}
/** Lựa chọn trả lời nhanh */
function selectQuickAnswer(content: string) {
    if (!content) return
    const input_chat = document.getElementById('chat-text-input-message')
    if (!input_chat) return
    content = replaceTemplateMessage(content)
    input_chat.innerText = content
    quick_anser_modal_ref.value?.toggleModal()
    document.removeEventListener('keyup', handleKeyUp)
}
/** Xử lý event */
function handleKeyUp(event: KeyboardEvent) {
    if (quick_answers.value.length === 0) return

    // * Mũi tên xuống
    if (event.keyCode == 40) {
        console.log("xuống")

        if (answer_index.value === (quick_answers.value.length - 1)) {
            answer_index.value = 0
            answer_selected.value = quick_answers.value[answer_index.value].id
            scrollIntoView(answer_selected.value)
            return
        }

        answer_index.value = answer_index.value + 1
        answer_selected.value = quick_answers.value[answer_index.value].id
        scrollIntoView(answer_selected.value)
    }

    // * Mũi tên lên
    if (event.keyCode == 38) {
        console.log("lên")

        if (answer_index.value === 0) {
            answer_index.value = quick_answers.value.length - 1
            answer_selected.value = quick_answers.value[answer_index.value].id
            scrollIntoView(answer_selected.value)
            return
        }

        answer_index.value = answer_index.value - 1
        answer_selected.value = quick_answers.value[answer_index.value].id
        scrollIntoView(answer_selected.value)
    }

    // * Enter
    if (event.keyCode == 13) {
        selectQuickAnswer(quick_answers.value[answer_index.value].content)
    }
}
/** Gán câu trả lời nhanh mặc định */
function setDefaultQuickAnswer() {
    if(isMobile()) return
    if (quick_answers.value.length === 0) return
    answer_selected.value = quick_answers.value[0].id
    answer_index.value = 0
}
/** Cuộn tới vị trí trả lời nhanh đang chọn */
function scrollIntoView(id: string): void {
    const element: any = document.getElementById(id);
    if (element) element.scrollIntoViewIfNeeded();
}
/** thay thế template message thành data của conversation */
function replaceTemplateMessage(content: string): string {
    content = content.replace(
        /#{FULL_NAME}/g,
        conversationStore.select_conversation?.client_name as string
    )
    content = content.replace(
        /#{STAFF_NAME}/g,
        conversationStore.select_conversation?.snap_staff?.name as string
    )
    content = content.replace(
        /#{PHONE}/g,
        conversationStore.select_conversation?.client_phone as string
    )
    content = content.replace(
        /#{EMAIL}/g,
        conversationStore.select_conversation?.client_email as string
    )
    content = content.replace(
        /#{PAGE_NAME}/g,
        pageStore.selected_page_list_info[
            conversationStore.select_conversation?.fb_page_id as string
        ].page?.name as string
    )
    return content
}
/** Loại bỏ event keyboard khi tắt modal */
function removeEvent() {
    document.removeEventListener('keyup', handleKeyUp)
}


defineExpose({ toggleModal })
</script>