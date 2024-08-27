import { Botx } from './Botx'

import type { BaseQuery } from '../types'

/**gọi API lên server của AI */
export class Ai extends Botx {
  constructor(path: string) {
    // gọi API lên server của chatbot
    super(`${$env.host.ai}/${path}`)
  }
}

/**gọi API lên module của app */
export class AiApp extends Ai {
  /**id trang */
  readonly #PAGE_ID: string
  /**id khách hàng */
  readonly #CLIENT_ID: string

  constructor(page_id: string, client_id: string, path: string) {
    // gọi API lên module của app
    super(`app/${path}`)

    // lưu lại id trang
    this.#PAGE_ID = page_id
    // lưu lại id khách hàng
    this.#CLIENT_ID = client_id
  }

  /**gọi api post lên AI */
  protected post(path: string, body?: Record<string, any>): Promise<any> {
    return super.post(path, {
      page_id: this.#PAGE_ID,
      client_id: this.#CLIENT_ID,
      ...body,
    })
  }
}

/**dữ liệu của 1 liên hệ */
export interface ContactInfo {
  /**id của liên hệ */
  _id?: string
  /**id của tin nhắn */
  message_id?: string
  /**loại của liên hệ */
  contact_type?: 'PHONE' | 'EMAIL' | 'ADDRESS'
  /**giá trị liên hệ */
  contact_value?: string
  /**nội dung văn bản gốc */
  contact_raw_text?: string
  /**dữ liệu chi tiết hơn nếu có*/
  contact_detail?: Record<string, any>
}

/**gọi API module page của chatbot */
export class AiAppContact extends AiApp {
  constructor(page_id: string, client_id: string) {
    // gọi API module page của chatbot
    super(page_id, client_id, 'contact')
  }

  /**đọc danh sách liên lạc của khách hàng */
  async getContact(body?: BaseQuery): Promise<ContactInfo[]> {
    // gọi api lấy danh sách liên lạc
    return this.post('get_contact', body)
  }
}
