import type { Ref } from 'vue'

/**
 * hàm trang trí tính năng loading cho phương thức
 * @param is_loading biến để bật tắt loading
 * @param is_block_if_loading có chặn hành động khi đang loading hay không
 */
export function loading(is_loading: boolean, is_block_if_loading = true) {
  return function (
    target: any,
    property_key: string,
    descriptor: PropertyDescriptor
  ) {
    /**phương thức gốc */
    const ORIGINAL_METHOD = descriptor.value

    // trang trí phương thức
    descriptor.value = async function (...args: any[]) {
      // nếu bật chặn khi đang loading
      if (is_block_if_loading && is_loading) return

      // thử chạy phương thức
      try {
        // bật loading
        is_loading = true

        // chạy phương thức gốc
        await ORIGINAL_METHOD.apply(this, args)
      } 
      // sau khi chạy xong (lỗi hoặc thành công)
      finally {
        // tắt loading khi phương thức chạy xong
        is_loading = false
      }
    }

    // trả về phương thức đã trang trí
    return descriptor
  }
}
