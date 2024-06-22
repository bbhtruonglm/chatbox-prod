<template>
  <div
    class="w-[400px] h-full flex-shrink-0 overflow-y-auto flex flex-col gap-3"
  >
    <UserInfo @toggle_change_assign_staff="toggleChangeAssignStaff" />
    <template v-for="widget of widget_list">
      <div
        v-if="!widget.is_hidden"
        class="rounded-lg bg-white overflow-hidden flex-shrink-0"
      >
        <button
          @click="toggleWidget(widget)"
          class="w-full py-2.5 px-3 text-sm font-semibold flex items-center justify-between sticky top-0"
        >
          {{ widget.snap_app.name }}
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
              ? 'h-[calc(100vh_-_119px)]'
              : 'h-[300px]'
          "
          class="w-full border-t"
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
  <ChangeStaff ref="change_staff_ref" />
</template>
<script setup lang="ts">
import { nextTick, ref, watch } from 'vue'
import { useConversationStore } from '@/stores'
import {
  getIframeUrl,
  getPageWidget,
  getPageCurrentStaff,
} from '@/service/function'
import { intersection } from 'lodash'
import { copy } from '@/service/helper/format'

import UserInfo from '@/views/ChatWarper/Chat/CenterContent/UserInfo.vue'
import ChangeStaff from '@/views/ChatWarper/Chat/CenterContent/ChangeStaff/ChangeStaff.vue'

import ArrowDown from '@/components/Icons/ArrowDown.vue'

import type { AppInstalledInfo } from '@/service/interface/app/widget'

const conversationStore = useConversationStore()

/**danh sách widget */
const widget_list = ref<AppInstalledInfo[]>([])
/**danh sách widget */
const snap_widget_list = ref<AppInstalledInfo[]>([])
/**modal assign nhân viên */
const change_staff_ref = ref<InstanceType<typeof ChangeStaff>>()
/** Tên widget đang được chọn */
const widget_selected = ref<string>('all')

watch(
  () => conversationStore.list_widget_token?.data,
  () => getListWidget()
)

/**ẩn hiện modal */
function toggleChangeAssignStaff($event: MouseEvent) {
  change_staff_ref.value?.toggle($event)
}
/**lọc ra các widget bên phải */
function getWidgetRight() {
  return widget_list.value?.filter(widget => widget.position === 'RIGHT')
}
/**ẩn hiện widget */
function toggleWidget(widget: AppInstalledInfo) {
  widget.is_show = !widget.is_show
}
/**đọc danh sách các widget của trang này */
function getListWidget() {
  /**id trang */
  const PAGE_ID = conversationStore.select_conversation?.fb_page_id

  if (!PAGE_ID) return

  /**các nhóm mà nhân viên này được phép truy cập dữ liệu */
  const GROUP_STAFF = getPageCurrentStaff(PAGE_ID)?.group_staff

  // nếu khác trang, hoặc widget chưa tồn tại, thì render lại danh sách
  if (
    conversationStore.list_widget_token.new_page_id !==
      conversationStore.list_widget_token.old_page_id ||
    !widget_list.value?.length
  )
    nextTick(() => {
      widget_list.value = copy(
        getPageWidget(PAGE_ID)
          ?.filter(widget => {
            /**kiểm tra user có quyền xem widget này không */
            const IS_ACCESSIBLE = intersection(
              widget.access_group,
              GROUP_STAFF
            )?.length

            /**chỉ hiển thị widget cho bên phải */
            const IS_RIGHT = widget.position === 'RIGHT'

            // chỉ hiển thị widget được kích hoạt và có quyền xem
            return widget.active_widget && IS_ACCESSIBLE && IS_RIGHT
          })
          ?.map(widget => {
            // mặc định ẩn tất cả các widget
            widget.is_show = false
            // // nếu dạng nhỏ nhất thì auto ẩn luôn
            // if (widget.app_installed_size === 'MINIMUM') widget.is_show = false
            // // hiển thị toàn bộ widget
            // else widget.is_show = true

            // thêm token cho url
            widget.url = getIframeUrl(widget)

            return widget
          })
          ?.sort((a, b) => {
            // sort theo index từ 0 -> n
            if (a.index_position > b.index_position) return 1
            else return -1
          }) || []
      )

      // chỉ hiển thị widget đầu tiên
      if (widget_list.value?.[0]) widget_list.value[0].is_show = true

      snap_widget_list.value = widget_list.value

      filterWidget()
    })
  // nếu đổi hội thoại nhưng cùng trang
  else {
    // loop danh sách widget hiện tại để xử lý
    widget_list.value.map(widget => {
      // nếu widget là dạng post mess thì không reload iframe nữa
      if (widget.snap_app?.is_post_message) {
        /**iframe widget mục tiêu */
        const IFRAME = document.getElementById(
          `widget-${widget._id}`
        ) as HTMLIFrameElement

        // gửi sự kiện đến iframe để load lại dữ liệu cần thiết
        IFRAME?.contentWindow?.postMessage(
          {
            from: 'CHATBOX',
            type: 'RELOAD',
            payload: {
              access_token:
                conversationStore.list_widget_token?.data?.[widget._id],
            },
          },
          '*'
        )
      }
      // các widget cũ vẫn reload iframe
      else widget.url = getIframeUrl(widget)
    })
  }
}
/** Lọc widget theo tên */
function filterWidget(widget_select?: AppInstalledInfo) {
  if (!widget_select) {
    widget_selected.value = 'all'
    widget_list.value = snap_widget_list.value.map(widget => {
      widget.is_hidden = false
      return widget
    })
    return
  }
  widget_selected.value = widget_select._id
  widget_list.value = snap_widget_list.value.map(widget => {
    widget.is_hidden = true
    if (widget._id === widget_select._id) widget.is_hidden = false
    return widget
  })
}
</script>
