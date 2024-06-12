import { read_me_chatbot_user } from '@/service/api/chatbox/n4-service'
import { flow } from '@/service/helper/async'
import { useChatbotUserStore } from '@/stores'
import { onMounted } from 'vue'
import { signout } from '@/service/helper/oauth'

import type { CbError } from '@/service/interface/function'

/**load các dữ liệu cần thiết của giao diện */
export function initRequireData() {
  const chatbotUserStore = useChatbotUserStore()

  // init các dữ liệu cần thiết
  onMounted(() => getMeChatbotUser())

  /**đọc các thông tin của user hiện tại đang đăng nhập */
  function getMeChatbotUser() {
    flow(
      [
        // * call api
        (cb: CbError) =>
          read_me_chatbot_user((e, r) => {
            // * call api
            if (e) {
              // nếu call api thất bại thì redirect qua login
              signout()

              return cb(e)
            }

            // lưu vào store
            chatbotUserStore.chatbot_user = r
            cb()
          }),
      ],
      undefined
    )
  }

  return { getMeChatbotUser }
}
