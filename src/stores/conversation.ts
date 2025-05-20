import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { saveLocal, getLocal } from '@/service/helper/store'

import type {
  ConversationInfo,
  ConversationList,
  FilterConversation,
} from '@/service/interface/app/conversation'
import { usePageStore } from './page'
import type { AppInstalledInfo } from '@/service/interface/app/widget'
import type { ClientInfo } from '@/utils/api/Chatbot'
import type { ILabel } from '@/service/interface/app/label'
import type { IPost, IPostAnalytic } from '@/service/interface/app/message'

export const useConversationStore = defineStore('conversation_store', () => {

  const route = useRoute()

  /**lưu dữ liệu lọc hội thoại */
  const option_filter_page_data = ref<FilterConversation>(
    getOptionFilterPageData()
  )

  // lưu dữ liệu xuống local
  saveLocal(option_filter_page_data, 'option_filter_page_data')

  /**dữ liệu của 1 khách hàng khi được chọn */
  const select_conversation = ref<ConversationInfo>()
  /**dữ liệu bài post của hội thoại dạng post đang được chọn */
  const select_conversation_post = ref<IPost>()
  /**thống kê bài viết đang được chọn */
  const select_conversation_post_analytic = ref<IPostAnalytic>()

  /** lấy dữ liệu lọc hội thoại */
  function getOptionFilterPageData(): FilterConversation {
    /** dữ liệu lọc hội thoại lấy ở localstorage */
    let option_filter_page_data = getLocal('option_filter_page_data', {
      is_spam_fb: 'NO',
      conversation_type: 'CHAT',
    })

    // kiểm tra query string có tab bằng post hay không
    if (route.query.tab === 'POST') {
      option_filter_page_data.conversation_type = 'POST'
    } 
    // nếu không có thì mặc định là tab chat
    else {
      option_filter_page_data.conversation_type = 'CHAT'
    }

    return option_filter_page_data  
  }

  /**lấy thông tin nhân viên được gán cho hội thoại này */
  function getAssignStaff() {
    const pageStore = usePageStore()

    // lấy thông tin nhân viên được gán
    return pageStore.getStaff(
      select_conversation.value?.fb_page_id,
      select_conversation.value?.user_id ||
        select_conversation.value?.fb_staff_id
    )
  }
  /**kiểm tra staff hiện tại có phải là admin của page của hội thoại này không */
  function isCurrentStaffAdmin() {
    const pageStore = usePageStore()

    // trả về kết quả kiểm tra
    return pageStore.isCurrentStaffAdmin(select_conversation.value?.fb_page_id)
  }
  /**lấy dữ liệu trang của hội thoại này */
  function getPage() {
    const pageStore = usePageStore()

    // trả về dữ liệu trang
    return pageStore.getPage(select_conversation.value?.fb_page_id)?.page
  }
  /**lấy danh sách nhãn của trang của hội thoại này */
  function getLabels(): Record<string, ILabel> | undefined {
    const pageStore = usePageStore()

    // trả về danh sách nhãn
    return pageStore.getLabels(select_conversation.value?.fb_page_id)
  }
  /**
   * danh sách các id nhãn đang kích hoạt của hội thoại
   * - đã lọc ra các id nhãn đã bị xóa
   */
  function getActiveLabelIds() {
    /**các nhãn của trang của hội thoại này */
    const LABELS = getLabels()

    // lọc các id nhãn còn tồn tại của trang
    return select_conversation.value?.label_id?.filter(
      label_id => LABELS?.[label_id]
    )
  }

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
    select_conversation_post,
    select_conversation_post_analytic,
    conversation_list,
    select_widget,
    list_widget_token,
    is_edit_info,
    chatbot_client,
    is_edit_client,

    getAssignStaff,
    isCurrentStaffAdmin,
    getLabels,
    getActiveLabelIds,
    getPage,
  }
})
