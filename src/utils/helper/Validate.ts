import { addMethod, string } from 'yup'

// khai báo thêm phương thức
declare module 'yup' {
  interface StringSchema {
    /**kiểm tra không chứa khoảng trắng */
    noWhitespace(message?: string): this
  }
}

// thêm phương thức kiểm tra không chứa khoảng trắng
addMethod(string, 'noWhitespace', function (message) {
  // trả về thông báo lỗi nếu giá trị chứa khoảng trắng
  return this.test('no-whitespace', message, function (value) {
    // lấy đường dẫn và thông báo lỗi
    const { path: PATH, createError } = this

    /**kiểm tra giá trị */
    const TEST = !/^\s*$/.test(value || '')

    /**lỗi được tạo */
    const ERROR = createError({
      path: PATH,
      message: message || 'This field cannot contain only whitespace',
    })

    // trả về kết quả
    return TEST || ERROR
  })
})
