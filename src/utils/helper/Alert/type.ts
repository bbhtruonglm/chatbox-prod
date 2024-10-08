/**interface quản lý thông báo */
export interface IAlert {
  /**thông báo thành công */
  success(...arg: any[]): void
  /**thông báo lỗi */
  error(...arg: any[]): void
  /**cảnh báo người dùng */
  warning(...arg: any[]): void
  /**hỏi người dùng có chắc chắn không */
  question(...arg: any[]): void
}
