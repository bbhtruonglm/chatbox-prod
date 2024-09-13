/**các tiện ích liên quan đến định dạng dữ liệu */
export class Parser {
  /**chuyển đổi object thành dạng query string trên url */
  static toQueryString(payload: Record<string, any>): string {
    return new URLSearchParams(payload).toString()
  }
}
