<template>
  <div class="flex flex-col gap-1">
    <template v-for="button of list_button">
      <button
        v-if="button.type"
        @click="onClickBtn(button)"
        :class="
          isAction(button)
            ? 'bg-slate-800 text-yellow-200'
            : 'bg-slate-600 text-slate-100 cursor-not-allowed'
        "
        class="py-2 px-4 flex justify-center items-center gap-1 rounded-lg text-sm font-medium"
      >
        {{ genBtnTitle(button) }}
        <NewTabIcon
          v-if="isAction(button)"
          class="w-3.5 h-3.5"
        />
      </button>
    </template>
  </div>
  <Widget
    ref="modal_widget_ref"
    :selected_widget
    :ai="ai"
  />
</template>
<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { openNewTab } from '@/service/function'
import { getPageWidget } from '@/service/function'
import { useConversationStore } from '@/stores'

import NewTabIcon from '@/components/Icons/NewTab.vue'
import Widget from '@/views/ChatWarper/Chat/CenterContent/MessageList/MessageItem/MessageTemplate/Widget.vue'

import type {
  MessageAiData,
  MessageTemplateButton,
} from '@/service/interface/app/message'
import { ref } from 'vue'
import type { AppInstalledInfo } from '@/service/interface/app/widget'

const $props = withDefaults(
  defineProps<{
    /**Danh sách các nút bấm */
    list_button?: MessageTemplateButton[]
    /**dữ liệu của AI nếu có */
    ai?: MessageAiData
  }>(),
  {}
)

const { t: $t } = useI18n()
const conversationStore = useConversationStore()

/**ref của modal widget */
const modal_widget_ref = ref<InstanceType<typeof Widget>>()
/**dữ liệu của widget được chọn */
const selected_widget = ref<AppInstalledInfo>()

/**tạo ra tiêu đề cho nút */
function genBtnTitle(button: MessageTemplateButton) {
  // nếu có title thì trả về title
  if (button?.title) return button?.title

  // xử lý trường hợp BBH tự thêm hành động nút
  switch (button?.type) {
    case 'bbh_place_order':
      return $t('v1.view.main.dashboard.chat.message.cta.place_order')
    case 'bbh_create_transaction':
      return $t('v1.view.main.dashboard.chat.message.cta.create_transaction')
    case 'bbh_schedule_appointment':
      return $t('v1.view.main.dashboard.chat.message.cta.schedule_appointment')
    default:
      return ''
  }
}
/**kiểm tra xem button có bấm được không */
function isAction(button: MessageTemplateButton) {
  // nếu có url thì mở được tab mới
  if (button.type === 'web_url') return true

  // nếu có prefix bbh thì là AI
  if (button.type?.includes('bbh_')) return true

  // mặc định không bấm được
  return false
}
/**xử lý khi click vào nút bấm */
function onClickBtn(button: MessageTemplateButton) {
  // nếu không phải hành động thì không làm gì cả
  if (!isAction(button)) return

  /**kiểu của hành động */
  const TYPE = button.type

  // nếu không có kiểu thì không làm gì cả
  if (!TYPE) return

  // mở tab mới
  if (TYPE === 'web_url' && button?.url) openNewTab(button?.url)

  // mở modal merchant
  if (TYPE === 'bbh_create_transaction')
    openWidgetModal($env.ai.widget.create_transaction)

  // mở modal merchant
  if (TYPE === 'bbh_place_order') openWidgetModal($env.ai.widget.place_order)

  // mở modal ghi chú đặt lịch
  if (TYPE === 'bbh_schedule_appointment')
    openWidgetModal($env.ai.widget.schedule_appointment)
}
/**mở modal widget */
function openWidgetModal(widget_id: string) {
  // lấy dữ liệu của widget được chọn
  selected_widget.value = getPageWidget(
    conversationStore.select_conversation?.fb_page_id
  )?.find(widget => widget.app_id === widget_id)

  // mở modal
  modal_widget_ref.value?.toggleModal()
}
</script>
