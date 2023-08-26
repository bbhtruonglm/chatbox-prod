import { defineStore } from 'pinia'
import { ref } from 'vue'
import { saveLocal, getLocal } from '@/service/helper/store'

import type {
    ConversationInfo, FilterConversation
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
    const select_conversation = ref<ConversationInfo>({
        fb_page_id: '',
        fb_client_id: '',
        last_message_type: 'page'
    })

    return {
        option_filter_page_data,
        select_conversation,
    }
})