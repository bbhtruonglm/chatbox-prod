/**các tiện ích liên quan đến chuyển hướng trang web */
export class Navigation {
  /**mở url trong một tab mới */
  static openNewTab(url?: string): void {
    // nếu không có url thì thôi
    if (!url) return

    // mở tab mới
    window.open(url, '_blank')
  }
}
