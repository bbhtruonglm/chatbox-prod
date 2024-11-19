/**quản lý local của trang */
export interface ILocalStorage {
  /**
   * lấy item từ local
   * @param key key của item
   * @param default_value giá trị mặc định nếu không tìm thấy
   * @param prefix tiền tố của key
   */
  getItem<T = any>(key: string, default_value?: T, prefix?: string): T
  /**
   * lưu item vào local
   * @param key key của item
   * @param value giá trị cần lưu
   * @param prefix tiền tố của key
   */
  setItem<T = any>(key: string, value: T, prefix?: string): void
}

/**quản lý local của trang */
export class LocalStorage implements ILocalStorage {
  getItem<T = any>(
    key: string,
    default_value?: T,
    prefix: string = $env.local_storage.prefix
  ) {
    try {
      /**lấy dữ liệu từ local */
      const DATA = localStorage.getItem(`${prefix}${key}`)

      // trả về giá trị mặc định nếu không có dữ liệu
      if (DATA === null) return default_value

      // nếu có dữ liệu thì trả về dữ liệu đã parse
      if (DATA) return JSON.parse(DATA)
    } catch (e) {
      // nếu có lỗi thì thôi
    }
  }
  setItem(key: string, value: any, prefix: string = $env.local_storage.prefix) {
    // lưu dữ liệu vào local
    localStorage.setItem(`${prefix}${key}`, JSON.stringify(value))
  }
}

/**quản lý local của trang */
export class SingletonLocalStorage extends LocalStorage {
  /**thực thể duy nhất */
  private static inst: ILocalStorage

  // chặn khởi tạo từ bên ngoài
  private constructor() {
    super()
  }

  /**lấy thực thể */
  static getInst(): ILocalStorage {
    // nếu chưa có thực thể thì tạo mới
    if (!this.inst) this.inst = new this()

    // trả về thực thể
    return this.inst
  }
}
