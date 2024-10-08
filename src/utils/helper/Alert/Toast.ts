import Swal from 'sweetalert2'
import { isObject } from 'lodash'

import type { IAlert } from '@/utils/helper/Alert/type'
import type { SweetAlertIcon, SweetAlertPosition } from 'sweetalert2'

/**thông báo dạng toast */
export class Toast implements IAlert {
  /**thời gian toast hiển thị */
  readonly #TIMER: number
  /**vị trí hiển thị toast */
  readonly #POSITION: SweetAlertPosition

  constructor(position: SweetAlertPosition = 'top-end', timer: number = 3000) {
    // thiết lập vị trí hiển thị toast
    this.#POSITION = position
    // thiết lập thời gian toast
    this.#TIMER = timer
  }

  /**kích hoạt thông báo dạng toast */
  #trigger(icon: SweetAlertIcon, message: any): void {
    /**thông điệp đã xử lý */
    const MESSAGE = this.#formatError(message)

    // hiển thị thông báo
    Swal.fire({
      icon,
      title: MESSAGE,
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
  /**format lỗi thành chuỗi */
  #formatError(e: any): string {
    /**nội dung thông báo */
    let message = e?.message || e

    // tự động parser obj thành string
    if (isObject(message)) message = JSON.stringify(message, null, 4)

    // trả về thông báo
    return message
  }

  public success(message: any): void {
    // hiển thị thông báo
    this.#trigger('success', message)
  }
  public error(message: any): void {
    // hiển thị thông báo
    this.#trigger('error', message)
  }
  public warning(message: any): void {
    // hiển thị thông báo
    this.#trigger('warning', message)
  }
  public question(message: any): void {
    // hiển thị thông báo
    this.#trigger('question', message)
  }
}

/**singleton quản lý toast */
export class ToastSingleton extends Toast implements IAlert {
  /**đối tượng toast */
  static #inst: IAlert

  private constructor() {
    // khởi tạo toast cha bằng các thiết lập mặc định
    super()
  }

  /**lấy đối tượng toast */
  public static getInst(): IAlert {
    // nếu chưa khởi tạo thì khởi tạo
    if (!this.#inst) this.#inst = new this()

    // trả về đối tượng toast đã khởi tạo
    return this.#inst
  }
}
