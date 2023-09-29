<template>
    <ModalBottom 
        @close_modal="removeEvent" 
        @open_modal="inputFocus"
        ref="quick_anser_modal_ref" 
        :left="commonStore.center_modal_left" 
        :width="commonStore.center_modal_width"
    >
        <template v-slot:header>
            {{ $t('v1.view.main.dashboard.chat.quick_answer.title') }}
        </template>
        <template v-slot:body>
            <!-- Loading -->
            <div class="h-[150px]" v-if="loading">
                <Loading type="FULL" />
            </div>

            <!-- Answers -->
            <div v-if="!loading">
                <div 
                    v-if="!isMobile()"
                    class="flex justify-between bg-green-100 text-green-500 px-1 py-1 mb-2 text-sm"
                >
                    <p>Enter hoặc click để chọn</p>
                    <p>Dùng ↑ hoặc ↓ để chọn</p>
                </div>
                <div class="max-h-[500px] overflow-y-auto border rounded-md mb-2">
                    <div 
                        v-for="(answer, index) in quick_answers" :id="answer.id"
                        class="py-2 px-1.5 cursor-pointer hover:bg-slate-100"
                        @click="selectQuickAnswer(answer.content)" :class="{
                            'text-orange-500': answer.id === answer_selected,
                            'bg-orange-100': answer.id === answer_selected,
                            'border-b': index !== (quick_answers.length - 1)
                        }"
                    >
                        <div class=" bg-gray-500 text-white w-fit px-1 rounded font-bold">
                            <p class="max-w-xs break-words text-xs">{{ answer.title }}</p>
                        </div>
                        <p class="whitespace-pre-line text-xs">{{ answer.content }}</p>
                    </div>
                </div>
            </div>

            <div class="w-full relative">
                <input
                    ref="ref_search"
                    class="focus:outline-none w-full h-9 border rounded-md pl-3 pr-7" type="text" 
                    :placeholder="$t('v1.view.main.dashboard.chat.quick_answer.search')" v-model="search_content"
                    v-on:keyup="seachQuickAnswer"
                />
                <img v-if="!loading" class="absolute top-[9px] right-[10px] cursor-pointer"
                    src="@/assets/icons/search.svg" />
            </div>

        </template>
    </ModalBottom>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useCommonStore, useConversationStore, usePageStore } from '@/stores'

import Loading from '@/components/Loading.vue'
import ModalBottom from '@/components/ModalBottom.vue'

import { isMobile } from '@/service/function'
import { nonAccentVn } from '@/service/helper/format'
import type { ComponentRef } from '@/service/interface/vue'
import { get_quick_answer } from '@/service/api/chatbox/widget'
import { teleportCenterModelOnPcScreen } from '@/service/function'
import type { QuickAnswerInfo } from '@/service/interface/app/message'


/** Sử dụng store */
const commonStore = useCommonStore()
const conversationStore = useConversationStore()
const pageStore = usePageStore()

/** ref của modal chính */
const quick_anser_modal_ref = ref<ComponentRef>()
/** Danh sách trả lời nhanh */
const quick_answers = ref<QuickAnswerInfo[]>([])
/** Danh sách trả lời nhanh */
const snap_quick_answers = ref<QuickAnswerInfo[]>([])
/** Trạng thái loading */
const loading = ref<boolean>(true)
/** Id của answer đang được chọn */
const answer_selected = ref<string>('')
/** Index của answer đang được chọn */
const answer_index = ref<number>(0)
/** Nội dung tìm kiếm trả lời nhanh */
const search_content = ref<string>('')
/** ref của seach */
const ref_search = ref()

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
        snap_quick_answers.value = r
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

        console.log("answer_index.value", answer_index.value)

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
/** Tìm kiếm quick answer */
function seachQuickAnswer(event: KeyboardEvent) {

    if(event.keyCode == 40 || event.keyCode == 38 || event.keyCode == 13) return

    if(!search_content.value) {
        quick_answers.value = snap_quick_answers.value
        setDefaultQuickAnswer()
        return
    }

    quick_answers.value = snap_quick_answers.value.filter(item => {
        let search = nonAccentVn(search_content.value)
        let content = nonAccentVn(item.content)
        let title =  nonAccentVn(item.title)

        return content.includes(search) || title.includes(search)
    })
    setDefaultQuickAnswer()
}
function inputFocus() {
    setTimeout(function() { ref_search.value.focus() }, 1000)
}


defineExpose({ toggleModal })
</script>