<template>
  <div
    class="w-[400px] h-full flex-shrink-0 overflow-y-auto flex flex-col gap-3"
  >
    <UserInfo />
    <template v-for="widget of pageStore.widget_list">
      <div
        v-if="!widget.is_hidden"
        :class="{
          'flex-grow': widget.is_show,
        }"
        class="rounded-lg bg-white overflow-hidden flex-shrink-0 flex flex-col"
      >
        <button
          @click="toggleWidget(widget)"
          class="w-full py-2.5 px-3 text-sm font-semibold flex items-center justify-between sticky top-0 flex-shrink-0"
        >
          {{ widget.snap_app?.name }}
          <ArrowDown
            :class="{
              '-rotate-90': !widget.is_show,
            }"
            class="w-3 text-slate-500 duration-300 mr-1"
          />
        </button>
        <div
          v-if="widget.is_show"
          :class="
            widget.app_installed_size === 'FULL'
              ? 'min-h-[calc(100vh_-_132px)]'
              : 'min-h-[300px]'
          "
          class="w-full border-t flex-grow"
        >
          <iframe
            :id="`widget-${widget._id}`"
            class="w-full h-full"
            :src="widget.url"
            frameborder="0"
          />
        </div>
      </div>
    </template>
  </div>
</template>
<script setup lang="ts">
import { nextTick, watch } from 'vue'
import { useConversationStore, usePageStore } from '@/stores'
import { getIframeUrl, getPageWidget } from '@/service/function'
import { sortBy } from 'lodash'
import { copy } from '@/service/helper/format'

import UserInfo from '@/views/ChatWarper/Chat/CenterContent/UserInfo.vue'

import ArrowDown from '@/components/Icons/ArrowDown.vue'

import type { AppInstalledInfo } from '@/service/interface/app/widget'

const conversationStore = useConversationStore()
const pageStore = usePageStore()

watch(
  () => conversationStore.list_widget_token?.data,
  () => getListWidget()
)

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
/**đọc danh sách các widget của trang này */
async function getListWidget() {
  /**id trang */
  const PAGE_ID = conversationStore.select_conversation?.fb_page_id
  /**danh sách token của widget */
  const LIST_WIDGET_TOKEN = conversationStore.list_widget_token

  if (!PAGE_ID) return

  if (
    // nếu vẫn trong 1 trang và
    LIST_WIDGET_TOKEN.new_page_id === LIST_WIDGET_TOKEN.old_page_id &&
    // đã có dữ liệu widget rồi
    pageStore.widget_list?.length
  )
    // loop danh sách widget hiện tại để xử lý
    return pageStore.widget_list.map(widget => {
      // tạo lại url và trigger reload lại iframe nếu có thể khi
      if (
        // widget ở dạng cũ
        !widget.snap_app?.is_post_message ||
        // hoặc widget không hiển thị - không sợ bị reload
        !widget.is_show
      ) {
        // reload lại iframe từ đầu
        widget.url = getIframeUrl(widget)

        return
      }

      // nếu widget là dạng post mess mới thì không reload iframe nữa mà gửi sự kiện đến iframe
      sendEventToIframe(widget, {
        from: 'CHATBOX',
        type: 'RELOAD',
        payload: {
          access_token:
            conversationStore.list_widget_token?.data?.[widget._id || ''],
          partner_token:
            pageStore.selected_page_list_info?.[
              conversationStore.select_conversation?.fb_page_id!
            ]?.partner_token,
          client_id: conversationStore.select_conversation?.fb_client_id,
        },
      })
    })

  // nếu khác trang, hoặc widget chưa tồn tại

  // đợi vue render xong mới chạy tiếp
  await new Promise(resolve => nextTick(() => resolve(undefined)))

  /**danh sách widget của trang này */
  let temp_list_widget = getPageWidget(PAGE_ID) || []

  // thêm dữ liệu cần thiết cho widget sau khi lọc
  temp_list_widget = temp_list_widget?.map(widget => {
    // mặc định ẩn tất cả các widget
    widget.is_show = false

    // thêm token cho url
    widget.url = getIframeUrl(widget)

    return widget
  })

  // sắp xếp lại danh sách widget theo index
  temp_list_widget = sortBy(temp_list_widget, 'index_position')

  // chỉ hiển thị widget đầu tiên
  if (temp_list_widget?.[0]) temp_list_widget[0].is_show = true

  // render lại danh sách
  pageStore.widget_list = copy(temp_list_widget)
}
/**gửi sự kiện đến iframe được chọn */
function sendEventToIframe(widget: AppInstalledInfo, payload: any) {
  /**iframe widget mục tiêu */
  const IFRAME = document.getElementById(
    `widget-${widget._id}`
  ) as HTMLIFrameElement

  // gửi sự kiện đến iframe để load lại dữ liệu cần thiết
  IFRAME?.contentWindow?.postMessage(payload, '*')
}
</script>
