import { isObject } from 'lodash'
import Swal from 'sweetalert2'

import type {
  SweetAlertIcon,
  SweetAlertOptions,
  SweetAlertPosition,
  SweetAlertResult,
} from 'sweetalert2'

/**module hỗ trợ quản lý thông báo */
export class Alert {
  /**kích hoạt thông báo */
  protected async fire(option: SweetAlertOptions): Promise<SweetAlertResult> {
    // sử dụng sweetalert2 để hiển thị thông báo
    return Swal.fire(option)
  }
}

/**thông báo dạng toast */
export class Toast extends Alert {
  /**thời gian toast hiển thị */
  readonly #TIMER: number
  /**vị trí hiển thị toast */
  readonly #POSITION: SweetAlertPosition

  constructor(position: SweetAlertPosition = 'top-end', timer: number = 3000) {
    // gọi hàm khởi tạo của lớp cha
    super()

    // thiết lập vị trí hiển thị toast
    this.#POSITION = position
    // thiết lập thời gian toast
    this.#TIMER = timer
  }

  /**kích hoạt thông báo */
  #trigger(icon: SweetAlertIcon, title: string): void {
    // hiển thị thông báo
    this.fire({
      icon,
      title,
      position: this.#POSITION,
      timer: this.#TIMER,
      toast: true,
      showConfirmButton: false,
      timerProgressBar: true,
      didOpen: (r: HTMLElement) => {
        r.addEventListener('mouseenter', Swal.stopTimer)
        r.addEventListener('mouseleave', Swal.resumeTimer)
      },
    })
  }

  /**thông báo thành công */
  public success(title: string): void {
    // hiển thị thông báo
    this.#trigger('success', title)
  }
  /**thông báo lỗi */
  public error(e: any): void {
    /**nội dung thông báo */
    let title = e?.message || e

    // tự động parser obj thành string
    if (isObject(title)) title = JSON.stringify(title, null, 4)

    // hiển thị thông báo
    this.#trigger('error', title)
  }
}

/**hỏi người dùng có chắc chắn muốn thực hiện không */
export class Confirm extends Alert {
  /**xác minh hành động của người dùng */
  async #trigger(
    icon: SweetAlertIcon,
    title: string,
    text?: string
  ): Promise<boolean> {
    /**kết quả xác minh */
    const { isConfirmed: IS_CONFIRM } = await this.fire({
      title,
      text,
      icon,
      showCancelButton: true,
    })

    // trả về kết quả xác minh
    return IS_CONFIRM
  }

  /**hỏi người dùng */
  public async question(title: string, text: string): Promise<boolean> {
    // hiển thị thông báo
    return this.#trigger('question', title, text)
  }
  /**cảnh báo người dùng */
  public async warning(title: string, text: string): Promise<boolean> {
    // hiển thị thông báo
    return this.#trigger('warning', title, text)
  }
}

/**kết quả của input nhập liệu */
type InputResponse = string | undefined

/**thông báo dạng input */
export class ModalInput extends Alert {
  /**kích hoạt thông báo */
  async #trigger(title: string, description?: string): Promise<InputResponse> {
    /**kết quả người dùng nhập */
    const { value: VALUE } = await this.fire({
      title,
      inputLabel: description,
      input: 'text',
      showCancelButton: true,
    })

    // trả về kết quả
    return VALUE
  }

  /**hiển thị thông báo */
  public async show(
    title: string,
    description?: string
  ): Promise<InputResponse> {
    // hiển thị thông báo
    return this.#trigger(title, description)
  }
}
