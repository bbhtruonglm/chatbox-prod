import { defineStore } from 'pinia'
import { ref } from 'vue'

import type { 
    AttachmentCacheList, AttachmentInfo, TempSendMessage 
} from '@/service/interface/app/message'

export const useMessageStore = defineStore('message_store', () => {
    /**danh sách tin nhắn tạm vừa được gửi */
    const send_message_list = ref<TempSendMessage[]>([])

    /**danh sách dữ liệu file được cache để không phải gọi lại nhiều lần */
    const attachment_list = ref<AttachmentCacheList>({})

    /**dữ liệu 1 file được chọn xem chi tiết */
    const select_attachment = ref<AttachmentInfo>()

    /** Trạng thái hiển thị modal nhân viên xem tin nhắn */
    const staff_read = ref<{ show: boolean, message_time?: string }>({
        show: false
    })

    return {
        send_message_list,
        attachment_list,
        select_attachment,
        staff_read
    }
})