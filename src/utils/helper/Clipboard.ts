import { ToastSingleton } from './Alert/Toast'
import { i18n } from '@/lang'

import type { IAlert } from './Alert/type'

/**interface quản lý bộ nhớ tạm */
export interface IClipboard {
  /**
   * sao chép text vào bộ nhớ tạm
   * @param text text cần sao chép
   * @param message thông báo sau khi sao chép
   */
  copy(text?: string, message?: string): void
}

/**tiện ích cho bộ nhớ tạm */
export class Clipboard implements IClipboard {
  /**đối tượng thông báo */
  readonly #ALERT_SERVICE: IAlert = ToastSingleton.getInst()
  /**đối tượng dịch ngôn ngữ */
  readonly #I18N_SERVICE = i18n?.global?.t

  copy(text?: string, message?: string): void {
    // nếu không có text thì không làm gì cả
    if (!text) return

    // sao chép text vào bộ nhớ tạm
    navigator.clipboard.writeText(text)

    /**thông điệp đã xử lý */
    const MESSAGE = message || this.#I18N_SERVICE('v1.common.copy_to_clipboard')

    // hiển thị thông báo đã sao chép thành công
    this.#ALERT_SERVICE.success(MESSAGE)
  }
}

/**singleton quản lý bộ nhớ tạm */
export class ClipboardSingleton extends Clipboard implements IClipboard {
  /**đối tượng bộ nhớ tạm */
  static #inst: IClipboard

  private constructor() {
    // khởi tạo bộ nhớ tạm cha bằng các thiết lập mặc định
    super()
  }

  /**lấy đối tượng bộ nhớ tạm */
  public static getInst(): IClipboard {
    // nếu chưa khởi tạo thì khởi tạo
    if (!this.#inst) this.#inst = new this()

    // trả về đối tượng bộ nhớ tạm đã khởi tạo
    return this.#inst
  }
}
