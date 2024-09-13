/**các tiện ích liên quan đến định dạng dữ liệu */
export class Parser {
  /**trang có đang deploy ở retion.ai không? */
  static toQueryString(payload: Record<string, any>): string {
    return new URLSearchParams(payload).toString()
  }
}
