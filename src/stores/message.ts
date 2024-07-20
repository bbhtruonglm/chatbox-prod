import { defineStore } from 'pinia'
import { ref } from 'vue'
import { remove } from 'lodash'

import type {
  AttachmentCacheList,
  AttachmentInfo,
  MessageInfo,
  TempSendMessage,
} from '@/service/interface/app/message'
import type { UploadFile } from '@/service/interface/app/album'

export const useMessageStore = defineStore('message_store', () => {
  /**danh sách tin nhắn hiện tại */
  const list_message = ref<MessageInfo[]>([])

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

  /**gắn cờ hiện nút đi scroll xuống bottom */
  const is_show_to_bottom = ref(false)

  /**cập nhật giá trị của tin nhắn tạm */
  function updateTempMessage(
    id: string,
    field: keyof TempSendMessage,
    value: TempSendMessage[keyof TempSendMessage]
  ) {
    // lặp qua toàn bộ tin nhắn tạm
    send_message_list.value.forEach(message => {
      // cập nhật tin nhắn trùng id
      if (message.temp_id === id) message[field] = value as never
    })
  }
  /**xoá tin nhắn tạm */
  function removeTempMessage(id: string) {
    remove(send_message_list.value, message => message.temp_id === id)
  }

  return {
    list_message,
    send_message_list,
    attachment_list,
    select_attachment,
    select_staff_read_id,
    upload_file_list,
    is_send_file,
    is_show_to_bottom,

    updateTempMessage,
    removeTempMessage,
  }
})
