<template>
    <div v-if="is_show" class="absolute top-[-35vh] h-[35vh] w-full bg-white border-t z-10">
        <Loading v-if="loading" type="FULL" />
        <template v-else>
            <div v-if="!isMobile()" class="flex justify-between bg-green-50 text-green-600 px-1 py-1 text-sm h-[30px]">
                <p>Enter hoặc click để chọn</p>
                <p>Dùng ↑ hoặc ↓ để chọn</p>
            </div>
            <div :class="isMobile() ? 'h-full' : 'h-[calc(100%_-_30px)]'"
                class="overflow-hidden scrollbar-vertical overflow-y-auto">
                <div v-for="(answer, index) in quick_answers" :id="answer.id" class="py-2 px-1.5 cursor-pointer hover:bg-slate-100"
                    @click="selectQuickAnswer(answer)" :class="{
                        'text-orange-500': answer.id === answer_selected,
                        'bg-orange-100': answer.id === answer_selected,
                        'border-b': index !== (quick_answers.length - 1)
                    }">
                    <div class="text-slate-500 break-words text-xs mb-1">
                        /{{ answer.title }}
                    </div>
                    <p class="whitespace-pre-line text-xs">{{ answer.content }}</p>
                    <div class="flex flex-wrap">
                        <object v-for="url of answer.list_images" :data="url" type="image/png"
                            class="w-[30px] h-[30px] mb-1 mr-1 rounded">
                            <img src="@/assets/icons/bbh-mini.svg" class="w-[30px] h-[30px]">
                        </object>
                    </div>
                </div>
            </div>
        </template>
    </div>
</template>
<script setup lang="ts">
import { ref, watch } from 'vue'
import { useConversationStore, usePageStore, useMessageStore } from '@/stores'
import { isMobile } from '@/service/function'
import { nonAccentVn } from '@/service/helper/format'
import { get_quick_answer } from '@/service/api/chatbox/widget'
import { size } from 'lodash'

import Loading from '@/components/Loading.vue'

import type { QuickAnswerInfo } from '@/service/interface/app/message'

const conversationStore = useConversationStore()
const pageStore = usePageStore()
const messageStore = useMessageStore()

/**lưu lại danh sách câu trả lời, để không phải gọi lên sv liên tục mỗi lần click */
const CACHE_ANSWER: {
    [index: string]: QuickAnswerInfo[]
} = {}
/**gắn cờ hiển thị trả lời nhanh */
const is_show = ref(false)
/** Danh sách trả lời nhanh */
const quick_answers = ref<QuickAnswerInfo[]>([])
/** Trạng thái loading */
const loading = ref<boolean>(true)
/** Id của answer đang được chọn */
const answer_selected = ref<string>('')
/** Index của answer đang được chọn */
const answer_index = ref(0)

watch(
    () => conversationStore.select_conversation,
    () => is_show.value = false
)

/** ẩn hiện modal */
function toggleModal() {
    is_show.value = !is_show.value

    // chọn lại vào chat
    focusChat()

    // nếu mở thì lấy dữ liệu trả lời nhanh
    if (is_show.value) getQuickAnswer()
}
/** Lấy dữ liệu trả lời nhanh theo page */
function getQuickAnswer() {
    /**id trang đang chọn */
    const page_id: string = conversationStore.select_conversation?.fb_page_id as string

    // nếu đã có dữ liệu rồi thì thôi không gọi api nữa
    if (CACHE_ANSWER[page_id]) return quick_answers.value = CACHE_ANSWER[page_id]

    get_quick_answer({
        fb_page_id: page_id,
        skip: 0,
        limit: 200 // chỉ lấy 200 câu trả lời nhanh
    }, (e, r) => {
        loading.value = false

        CACHE_ANSWER[page_id] = r

        quick_answers.value = r

        setDefaultQuickAnswer()
    })
}
/** Lựa chọn trả lời nhanh */
function selectQuickAnswer(answer: QuickAnswerInfo) {
    let { content, list_images } = answer

    const input_chat = document.getElementById('chat-text-input-message')

    if (!content || !input_chat) return

    // thay đổi nội dung template
    content = replaceTemplateMessage(content)

    // gán giá trị vào input
    input_chat.innerText = content

    // tắt modal
    is_show.value = false

    // load ảnh từ trả lời nhanh
    if (list_images && size(list_images))
        messageStore.upload_file_list = list_images?.map(url => {
            return {
                type: 'image',
                is_done: false,
                is_loading: false,
                preview: url,
                url,
            }
        })

    focusChat()
}
/**focus vào input chat */
function focusChat() {
    if (!isMobile()) document.getElementById('chat-text-input-message')?.focus()
}
/** Gán câu trả lời nhanh mặc định */
function setDefaultQuickAnswer() {
    if (isMobile()) return

    if (!quick_answers.value?.length) return

    answer_selected.value = quick_answers.value?.[0]?.id
    answer_index.value = 0
}
/** Cuộn tới vị trí trả lời nhanh đang chọn */
function scrollIntoView(id: string): void {
    /**
     * hàm scrollIntoViewIfNeeded không phải là hàm tiêu chuẩn, nên bị thiếu
     * type
     */
    // @ts-ignore
    document.getElementById(id)?.scrollIntoViewIfNeeded()
}
/** thay thế template message thành data của conversation */
function replaceTemplateMessage(content: string): string {
    content = content.replace(
        /#{FULL_NAME}/g,
        conversationStore.select_conversation?.client_name || ''
    )
    content = content.replace(
        /#{STAFF_NAME}/g,
        pageStore.selected_page_list_info?.[
            conversationStore.select_conversation?.fb_page_id || ''
        ]?.staff_list?.[
            conversationStore.select_conversation?.fb_staff_id || ''
        ]?.name || ''
    )
    content = content.replace(
        /#{PHONE}/g,
        conversationStore.select_conversation?.client_phone || ''
    )
    content = content.replace(
        /#{EMAIL}/g,
        conversationStore.select_conversation?.client_email || ''
    )
    content = content.replace(
        /#{PAGE_NAME}/g,
        pageStore.selected_page_list_info[
            conversationStore.select_conversation?.fb_page_id || ''
        ].page?.name || ''
    )
    return content
}
/**xử lý khi nội dung input chat thay đổi */
function handleChatValue($event: KeyboardEvent) {
    // * bấm mũi tên xuống
    if ($event.key === 'ArrowDown') {
        // nếu hết rồi thì quay lại ban đầu
        if (answer_index.value >= quick_answers.value.length - 1) answer_index.value = -1

        // chọn câu trả lời tiếp theo
        answer_selected.value = quick_answers.value[++answer_index.value].id

        // scroll đến vị trí
        return scrollIntoView(answer_selected.value)
    }

    // * bấm Mũi tên lên
    if ($event.key === 'ArrowUp') {
        // nếu là câu đầu thì chạy xuống cuối
        if (!answer_index.value) answer_index.value = quick_answers.value.length

        // chọn câu trả lời tiếp theo
        answer_selected.value = quick_answers.value[--answer_index.value].id

        // scroll đến vị trí
        return scrollIntoView(answer_selected.value)
    }

    // bấm Enter thì chọn câu trả lời nhanh đang được select
    if (
        $event.key === 'Enter' &&
        is_show.value
    ) return selectQuickAnswer(quick_answers.value[answer_index.value])

    /**nội dung chat */
    let input_value = document.getElementById('chat-text-input-message')?.innerText

    // nếu gõ gạch thì mở modal
    if (input_value === '/' && !is_show.value) return toggleModal()

    // nếu xoá hết nội dung thì tắt modal
    if (!input_value && is_show.value) return toggleModal()

    // tìm kiếm câu trả lời nhanh nếu đang mở modal
    if (input_value?.indexOf('/') === 0 && is_show.value) seachQuickAnswer(input_value?.slice(1))
}
/** Tìm kiếm quick answer */
function seachQuickAnswer(search_value?: string) {
    /**id trang đang chọn */
    let page_id = conversationStore.select_conversation?.fb_page_id as string

    // nếu không tìm kiếm thì hiển thị đủ dữ liệu
    if (!search_value) quick_answers.value = CACHE_ANSWER?.[page_id] || []
    // nếu không thì lọc
    else quick_answers.value = CACHE_ANSWER?.[page_id]?.filter(item => {
        let search = nonAccentVn(search_value)
        let title = nonAccentVn(item.title)

        return title.includes(search)
    })

    // tự động chọn câu đầu đầu tiên
    setDefaultQuickAnswer()
}

defineExpose({ toggleModal, handleChatValue, is_show })
</script>