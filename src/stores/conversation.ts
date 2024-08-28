import { defineStore } from 'pinia'
import { ref } from 'vue'
import { saveLocal, getLocal } from '@/service/helper/store'

import type {
  ConversationInfo,
  ConversationList,
  FilterConversation,
} from '@/service/interface/app/conversation'
import type { AppInstalledInfo } from '@/service/interface/app/widget'
import type { ClientInfo } from '@/utils/api/Chatbot'

export const useConversationStore = defineStore('conversation_store', () => {
  /**lưu dữ liệu lọc hội thoại */
  const option_filter_page_data = ref<FilterConversation>(
    getLocal('option_filter_page_data', {
      is_spam_fb: 'NO',
    })
  )
  // lưu dữ liệu xuống local
  saveLocal(option_filter_page_data, 'option_filter_page_data')

  /**dữ liệu của 1 khách hàng khi được chọn */
  const select_conversation = ref<ConversationInfo>()

  /**danh sách hội thoại đang hiển thị */
  const conversation_list = ref<ConversationList>({})

  /**widget được chọn để mở */
  const select_widget = ref<AppInstalledInfo>()

  /**danh sách token của widget */
  const list_widget_token = ref<{
    /**id trang hiện tại */
    new_page_id?: string
    /**id trang trước đó */
    old_page_id?: string
    /**dữ liệu token */
    data?: {
      [index: string]: string
    }
  }>({})

  /**có đang bật cờ chỉnh sửa dữ liệu khách hàng không */
  const is_edit_info = ref<boolean>(false)

  /**dữ liệu của khách hàng này bên chatbot */
  const chatbot_client = ref<ClientInfo>()

  /**gắn cờ có sửa dữ liệu không */
  const is_edit_client = ref<{
    /**sửa tên */
    client_name?: boolean
    /**danh sách id liên hệ bị xoá */
    contact_remove: Record<string, 1>
    /**danh sách id liên hệ cập nhật */
    contact_update: Record<string, 1>
    /**danh sách id liên hệ thêm mới */
    contact_create: Record<string, 1>
  }>({
    contact_remove: {},
    contact_update: {},
    contact_create: {},
  })

  return {
    option_filter_page_data,
    select_conversation,
    conversation_list,
    select_widget,
    list_widget_token,
    is_edit_info,
    chatbot_client,
    is_edit_client,
  }
})
