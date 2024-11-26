import type { Ref } from 'vue'

/**
 * hàm trang trí tính năng loading cho phương thức
 * @param is_loading tên biến ref để bật tắt loading
 * @param is_block_if_loading có chặn hành động khi đang loading hay không
 */
export function loading(is_loading: Ref<boolean>, is_block_if_loading = true) {
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
      if (is_block_if_loading && is_loading.value) return

      try {
        // bật loading
        is_loading.value = true

        // chạy phương thức gốc
        await ORIGINAL_METHOD.apply(this, args)
      } finally {
        // tắt loading
        is_loading.value = false
      }
    }

    // trả về phương thức đã trang trí
    return descriptor
  }
}
