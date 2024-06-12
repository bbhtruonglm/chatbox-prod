import { defineStore } from 'pinia'
import { ref } from 'vue'
import { saveIndexedDB, getIndexedDB } from '@/service/helper/store'
import { getItem, setItem } from '@/service/helper/localStorage'

import type {
  ChatbotUserInfo,
  PersonalSettings,
} from '@/service/interface/app/chatbot_user'

/**lưu trữ các dữ liệu liên quan đến user hiện tại đang đăng nhập */
export const useChatbotUserStore = defineStore('chatbot_user_store', () => {
  /** ------------ STAGE ----------- */
  /**lưu dữ liệu của user hiện tại đang đăng nhập */
  const chatbot_user = ref<ChatbotUserInfo>()

  // * đọc dữ liệu được lưu ở indexeddb
  getIndexedDB('chatbot_user', undefined, (e, r) => (chatbot_user.value = r))

  /** ghi đè lại setting của page */
  const personal_settings = ref<PersonalSettings>(
    getItem('personal_settings') || {
      is_hide_page_avatar: false,
      display_label_type: 'ICON_TOOLTIP',
    }
  )

  /** Có mở chế độ ghi đè setting của page hay không */
  const enable_personal_setting = ref<boolean>(
    getItem('enable_personal_setting') === 'yes' ? true : false
  )

  // lưu dữ liệu xuống indexed khi có thay đổi
  saveIndexedDB(chatbot_user, 'chatbot_user')

  /** ------------ GETTER ----------- */
  /**đọc id của nhân viên hiện tại đang đăng nhập */
  function getStaffId() {
    return chatbot_user.value?.fb_staff_id
  }

  /** ------------ ACTION ----------- */

  return {
    chatbot_user,
    personal_settings,
    enable_personal_setting,

    getStaffId,
  }
})
