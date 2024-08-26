/**quản lý API của ứng dụng */
export class ApiManager {
  /**đường dẫn cần gọi */
  readonly #URI: string
  /**header cần gửi */
  readonly #HEADERS?: HeadersInit

  constructor(uri: string, headers?: HeadersInit) {
    // lưu lại đường dẫn
    this.#URI = uri

    // lưu lại header
    this.#HEADERS = headers
  }

  /**thực hiện gọi API */
  async #request(
    is_json: boolean,
    is_form: boolean,
    path: string,
    method: string,
    qs?: any,
    body?: any
  ): Promise<any> {
    try {
      /**đường dẫn cần gọi */
      let uri = `${this.#URI}/${path}`

      /**dữ liệu khởi tạo API */
      const OPTIONS: RequestInit = { method }

      // nếu có query string thì thêm vào
      if (qs) uri += `?${new URLSearchParams(qs).toString()}`

      // xử lý dữ liệu json nếu
      if (
        // thiết lập parser json
        is_json &&
        // không phải form upload
        !is_form
      ) {
        // chuyển body json thành chuỗi
        body = JSON.stringify(body)

        // thiết lập header kiểu json
        OPTIONS.headers = { 'Content-Type': 'application/json' }
      }

      // thêm header custom nếu có
      if (this.#HEADERS)
        OPTIONS.headers = { ...OPTIONS.headers, ...this.#HEADERS }

      // nếu có body thì thêm vào
      if (body) OPTIONS.body = body

      /**gọi api */
      const RES = await fetch(uri, OPTIONS)

      // nếu không phải json thì trả về dữ liệu gốc
      if (!is_json) return RES

      /**chuyển dữ liệu về json */
      const RESULT = await RES.json()

      // trả về dữ liệu
      return RESULT?.data || RESULT?.message || RESULT?.mean || RESULT
    } catch (e: any) {
      // nếu có lỗi thì ưu tiên ném ra thông báo lỗi
      throw e?.message || e
    }
  }

  /**gọi API dạng get */
  protected get(path: string, qs?: Record<string, any>): Promise<any> {
    return this.#request(true, false, path, 'GET', qs)
  }
  /**gọi API dạng post */
  protected post(path: string, body?: Record<string, any>): Promise<any> {
    return this.#request(true, false, path, 'POST', undefined, body)
  }
  /**gọi API dạng form upload */
  protected upload(
    path: string,
    qs?: Record<string, any>,
    body?: FormData
  ): Promise<any> {
    return this.#request(true, true, path, 'POST', qs, body)
  }
}
