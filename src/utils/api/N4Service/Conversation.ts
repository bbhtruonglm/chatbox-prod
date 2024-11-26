import { N4Serivce } from '@/utils/api/N4Serivce'

/**gọi API module conversation của chatbox */
export class N4SerivceAppConversation extends N4Serivce {
  /**id trang */
  readonly #PAGE_ID: string

  constructor(page_id: string) {
    // gọi API module page của chatbot
    super('app/conversation')

    // lưu lại id trang
    this.#PAGE_ID = page_id
  }

  /**đính kèm id trang lên toàn bộ API */
  protected post(path: string, body?: Record<string, any>): Promise<any> {
    return super.post(path, { page_id: this.#PAGE_ID, ...body })
  }
}

/**gọi API thao tác 1 hội thoại */
export class N4SerivceAppOneConversation extends N4SerivceAppConversation {
  /**id khách hàng */
  readonly #CLIENT_ID: string

  constructor(page_id: string, client_id: string) {
    // gọi API module page của chatbot
    super(page_id)

    // lưu lại id khách hàng
    this.#CLIENT_ID = client_id
  }

  /**đính kèm id client lên toàn bộ API */
  protected post(path: string, body?: Record<string, any>): Promise<any> {
    return super.post(path, { client_id: this.#CLIENT_ID, ...body })
  }

  /**sửa tên khách hàng */
  async updateClientName(client_name: string): Promise<void> {
    // gọi api
    return this.post('edit_client_name', { client_name })
  }
  /**
   * thay đổi số tin nhắn chưa đọc
   * @param amount số lượng tin nhắn chưa đọc mới
   */
  async resetRead(amount: number = 0): Promise<void> {
    // gọi api
    return this.post('reset_read_conversation', {
      unread_message_amount: amount,
    })
  }
}
