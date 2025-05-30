<template>
  <div
    id="chat__right-bar"
    class="w-[400px] h-full flex-shrink-0 overflow-y-auto flex flex-col gap-2"
  >
    <PostRightBar
      v-if="conversationStore.select_conversation?.conversation_type === 'POST'"
    />
    <!-- <PostAnalytic
      v-if="conversationStore.select_conversation?.conversation_type === 'POST'"
    /> -->
    <template v-else>
      <AiJourney />
      <template v-for="(widget, index) of pageStore.widget_list">
        <div
          v-if="!widget.is_hidden"
          :class="{
            'flex-grow': widget.is_show,
          }"
          class="rounded-lg bg-white overflow-hidden flex-shrink-0 flex flex-col group"
          v-show="view === 'widgets'"
        >
          <button
            @click="toggleWidget(widget)"
            class="w-full py-2.5 px-3 text-sm font-semibold flex items-center justify-between sticky top-0 flex-shrink-0"
          >
            {{ widget.snap_app?.name }}
            <div class="flex gap-3">
              <button @click.stop="widget_dropdown_ref?.toggleDropdown">
                <EllipsisHorizontalIcon
                  v-if="index"
                  class="w-5 h-5 text-slate-500 hover:text-slate-900 hidden group-hover:block"
                  v-tooltip.top="$t('Thiết lập')"
                />
                <EllipsisHorizontalIcon
                  v-else
                  class="w-5 h-5 text-slate-500 hover:text-slate-900 hidden group-hover:block"
                  v-tooltip.bottom="$t('Thiết lập')"
                />
              </button>
              <ChevronDownIcon
                :class="{
                  '-rotate-90': !widget.is_show,
                }"
                class="w-5 h-5 text-slate-500 duration-300 mr-1"
              />
            </div>
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
              allow="microphone; camera; autoplay; speaker"
            />
          </div>
        </div>
      </template>
      <WidgetSorting
        :back-to-list="() => (view = 'widgets')"
        v-show="view === 'sorting'"
      />
    </template>

    <Dropdown
      ref="widget_dropdown_ref"
      width="200px"
      height="auto"
      :is_fit="false"
      position="BOTTOM"
      :back="150"
      class_content="flex flex-col gap-1 border rounded-md p-1 gap-1 font-medium text-sm"
      class_background="bg-slate-900/10"
    >
      <div
        @click="openWidgetSorting"
        class="flex gap-3 items-center cursor-pointer py-1.5 px-2 rounded-md hover:bg-slate-100"
      >
        <div class="p-1.5 rounded-full bg-gray-100">
          <Square3Stack3DIcon class="w-5 h-5" />
        </div>
        <p>{{ $t('Chỉnh sửa vị trí') }}</p>
      </div>
      <div class="border-t h-1"></div>
      <div
        @click="openWidgetStore"
        class="flex gap-3 items-center cursor-pointer py-1.5 px-2 rounded-md hover:bg-slate-100"
      >
        <div class="p-1.5 rounded-full bg-gray-100">
          <Squares2X2Icon class="w-5 h-5" />
        </div>
        <p>{{ $t('Chợ ứng dụng') }}</p>
      </div>
    </Dropdown>
  </div>
</template>
<script setup lang="ts">
import { getIframeUrl, getPageWidget } from '@/service/function'
import { copy } from '@/service/helper/format'
import { useConversationStore, usePageStore } from '@/stores'
import { sortBy } from 'lodash'
import { nextTick, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

import Dropdown from '@/components/Dropdown.vue'
import AiJourney from '@/views/ChatWarper/Chat/CenterContent/MessageList/AiJourney.vue'
import PostRightBar from '@/views/ChatWarper/Chat/RightBar/PostRightBar.vue'
import WidgetSorting from '@/views/ChatWarper/Chat/RightBar/WidgetSorting.vue'

import {
  ChevronDownIcon,
  EllipsisHorizontalIcon,
  Square3Stack3DIcon,
  Squares2X2Icon,
} from '@heroicons/vue/24/solid'

import type { AppInstalledInfo } from '@/service/interface/app/widget'

const $router = useRouter()

const conversationStore = useConversationStore()
const pageStore = usePageStore()

/** màn hình hiển thị
 * - widgets: danh sách widget
 * - sorting: sắp xếp widget
 */
const view = ref<'widgets' | 'sorting'>('widgets')

/** ref của dropdown widget */
const widget_dropdown_ref = ref<InstanceType<typeof Dropdown>>()

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

/** mở màn chợ ứng dụng */
function openWidgetStore() {
  $router.push(`/dashboard/widget`)
}

/** mở màn sắp xếp thứ tự widget */
function openWidgetSorting() {
  // lưu giá trị là màn sắp xếp thứ tự widget
  view.value = 'sorting'

  // toggle trạng thái của dropdown
  widget_dropdown_ref.value?.toggleDropdown()
}
</script>
