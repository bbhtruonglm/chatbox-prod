import { usePageStore } from "@/stores"
import { getIframeUrl } from "@/service/function"

import type { AppInstalledInfo } from "@/service/interface/app/widget"

/** xử lý logic với danh sách widget */
export function useWidget() {
  /** store */
  const pageStore = usePageStore()

  /**ẩn hiện widget */
  function toggleWidget(widget: AppInstalledInfo) {
    // loop danh sách widget để xử lý
    pageStore.widget_list?.forEach(item => {
      // toggle widget được chọn
      if (widget._id === item._id) {
        /**widget được toggle là hiển thị hay tắt */
        const IS_SHOW = !item.is_show

        // tạo lại token cho widget nếu
        if (
          // widget bị tắt
          !IS_SHOW &&
          // và widget này post message
          item.snap_app?.is_post_message
        )
          item.url = getIframeUrl(item)

        // gán giá trị hiển thị mới
        item.is_show = IS_SHOW
      }
      // ẩn tất cả các widget còn lại
      else item.is_show = false
    })
  }

  /** điều chỉnh trạng thái của tất cả widget */
  function toggleAllWidget() {
    /** trong danh sách widget có widget đang mở hay không */
    const IS_SHOW = pageStore.widget_list?.some(item => item.is_show)

    // nếu có thì tắt tất cả widget còn không thì mở tất cả widget
    pageStore.widget_list?.forEach(item => (item.is_show = !IS_SHOW))
  }
  return {
    toggleWidget,
    toggleAllWidget
  }
}