import { defineStore } from 'pinia'
import { ref } from 'vue'
import { saveLocal, getLocal } from '@/service/helper/store'

import type {
    ConversationInfo, ConversationList, FilterConversation
} from '@/service/interface/app/conversation'

export const useConversationStore = defineStore('conversation_store', () => {
    /**lưu dữ liệu lọc hội thoại */
    const option_filter_page_data = ref<FilterConversation>(getLocal(
        'option_filter_page_data',
        {
            is_spam_fb: 'NO'
        }
    ))
    // lưu dữ liệu xuống local
    saveLocal(option_filter_page_data, 'option_filter_page_data')

    /**dữ liệu của 1 khách hàng khi được chọn */
    const select_conversation = ref<ConversationInfo>()

    /**danh sách hội thoại đang hiển thị */
    const conversation_list = ref<ConversationList>({})

    return {
        option_filter_page_data,
        select_conversation,
        conversation_list,
    }
})