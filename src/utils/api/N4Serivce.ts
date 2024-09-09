import { Botx } from '@/utils/api/Botx'

/**gọi API lên server n4 của chatbox */
export class N4Serivce extends Botx {
  constructor(path: string) {
    // gọi API lên server của chatbox
    super(`${$env.host.n4_service_v2}/${path}`)
  }
}

/**gọi API lên module của app */
export class N4SerivceApp extends N4Serivce {
  /**id trang */
  readonly #PAGE_ID: string

  constructor(page_id: string, path: string) {
    // gọi API lên module của app
    super(`app/${path}`)

    // lưu lại id trang
    this.#PAGE_ID = page_id
  }

  /**gọi api post lên app chatbot */
  protected post(path: string, body?: Record<string, any>): Promise<any> {
    return super.post(path, { page_id: this.#PAGE_ID, ...body })
  }
}

/**gọi API module conversation của chatbox */
export class N4SerivceAppConversation extends N4SerivceApp {
  constructor(page_id: string) {
    // gọi API module page của chatbot
    super(page_id, `conversation`)
  }
}

/**gọi API thao tác 1 hội thoại */
export class N4SerivceAppOneConversation extends N4SerivceAppConversation {
  /**id khách hàng */
  protected readonly CLIENT_ID?: string

  constructor(page_id: string, client_id?: string) {
    // gọi API module page của chatbot
    super(page_id)

    // lưu lại id khách hàng
    this.CLIENT_ID = client_id
  }

  /**gọi api post lên app chatbot */
  protected post(path: string, body?: Record<string, any>): Promise<any> {
    return super.post(path, { client_id: this.CLIENT_ID, ...body })
  }

  /**sửa tên khách hàng */
  async updateClientName(client_name: string): Promise<void> {
    // gọi api
    return this.post('edit_client_name', { client_name })
  }
}
