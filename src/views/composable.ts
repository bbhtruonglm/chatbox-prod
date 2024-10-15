import { read_me_chatbot_user } from '@/service/api/chatbox/n4-service'
import { flow } from '@/service/helper/async'
import { useChatbotUserStore, useOrgStore } from '@/stores'
import { onMounted } from 'vue'
import { signout } from '@/service/helper/oauth'
import { toastError } from '@/service/helper/alert'

import type { CbError } from '@/service/interface/function'
import { BillingAppOrganization } from '@/utils/api/Billing'
import { getCurrentOrgInfo } from '@/service/function'

/**load các dữ liệu cần thiết của giao diện */
export function initRequireData() {
  const chatbotUserStore = useChatbotUserStore()
  const orgStore = useOrgStore()

  // init các dữ liệu cần thiết
  onMounted(() => {
    getMeChatbotUser()
    getAllOrg()
  })

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
  /**lấy danh sách các tổ chức của người dùng này */
  async function getAllOrg() {
    try {
      // lấy danh sách các tổ chức
      orgStore.list_org = await new BillingAppOrganization().readOrg()

      // tự động lấy thông tin tổ chức hiện tại
      getCurrentOrgInfo()
    } catch (e) {
      // hiển thị thông báo lỗi
      toastError(e)
    }
  }

  return { getMeChatbotUser }
}
