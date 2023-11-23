import { defineStore } from 'pinia'
import { ref } from 'vue'

import type {
    AttachmentCacheList, AttachmentInfo, TempSendMessage
} from '@/service/interface/app/message'
import type { UploadFile } from '@/service/interface/app/album'

export const useMessageStore = defineStore('message_store', () => {
    /**danh sách tin nhắn tạm vừa được gửi */
    const send_message_list = ref<TempSendMessage[]>([])

    /**danh sách dữ liệu file được cache để không phải gọi lại nhiều lần */
    const attachment_list = ref<AttachmentCacheList>({})

    /**dữ liệu 1 file được chọn xem chi tiết */
    const select_attachment = ref<AttachmentInfo>()

    /** danh sách id đã chọn */
    const select_staff_read_id = ref<string[]>([])

    /**các file được chọn để gửi đi */
    const upload_file_list = ref<UploadFile[]>([])

    /**gắn cờ file đang gửi */
    const is_send_file = ref(false)

    return {
        send_message_list,
        attachment_list,
        select_attachment,
        select_staff_read_id,
        upload_file_list,
        is_send_file,
    }
})