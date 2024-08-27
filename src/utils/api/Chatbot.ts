import { Botx } from './Botx'

/**gọi API lên server của chatbot */
export class Chatbot extends Botx {
  constructor(path: string) {
    // gọi API lên server của chatbot
    super(`${$env.host.chatbot}/${path}`)
  }
}

/**gọi API lên module của app */
export class ChatbotApp extends Chatbot {
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

/**gọi API module page của chatbot */
export class ChatbotAppPage extends ChatbotApp {
  constructor(page_id: string) {
    // gọi API module page của chatbot
    super(page_id, `page/`)
  }

  /**cập nhật thiết lập của trang */
  async #upsertPage(body: Record<string, any>): Promise<void> {
    // gọi api cập nhật trang
    return this.post('upsert_page', body)
  }

  /**kích hoạt | huỷ kích hoạt chatbot */
  async activePage(value: boolean): Promise<void> {
    // gọi phương thức cập nhật trang
    return this.#upsertPage({ page_is_active: value })
  }
}
