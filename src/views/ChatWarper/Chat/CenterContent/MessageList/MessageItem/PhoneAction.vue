<template>
  <div
    v-if="message?.client_phone && message_type == 'client'"
    class="flex items-center py-1.5 gap-2"
  >
    <!-- <button
      class="w-6 h-6 flex justify-center items-center rounded-full border border-blue-700 bg-blue-100"
    >
      <Zalo class="w-3 h-3"></Zalo>
    </button> -->
    <!--  -->
    <button
      @click="$main.openCallCenter()"
      v-tooltip="$t('Gọi điện')"
      class="w-6 h-6 flex justify-center items-center rounded-full border border-green-600 bg-green-100"
    >
      <PhoneIcon class="w-3 h-3 text-green-600"></PhoneIcon>
    </button>
    <Widget
      ref="modal_widget_ref"
      :selected_widget
    />
  </div>
</template>
<script setup lang="ts">
import { computed, ref } from 'vue'
import Widget from '@/views/ChatWarper/Chat/CenterContent/MessageList/MessageItem/MessageTemplate/Widget.vue'

import type { MessageInfo } from '@/service/interface/app/message'
import { Parser } from '@/utils/helper/Parser'
//* icon
import Zalo from '@/components/Icons/Zalo.vue'
import { PhoneIcon } from '@heroicons/vue/24/solid'
import type { AppInstalledInfo } from '@/service/interface/app/widget'
import { useConversationStore, usePageStore } from '@/stores'
import { copy } from '@/service/helper/format'
import { getIframeUrl } from '@/service/function'

const $props = withDefaults(
  defineProps<{
    /**dữ liệu của tin nhắn */
    message: MessageInfo
  }>(),
  {}
)

const pageStore = usePageStore()
const conversationStore = useConversationStore()

/**tin nhắn này thuộc về dạng nào */
const message_type = computed(() => $props.message?.message_type)
/**kích thước của file đầu tiên */
const attachment_size = computed(() => $props.message?.attachment_size?.[0])
/**thời gian tin nhắn được gửi */
const message_time = computed(
  () => $props.message?.time || $props.message?.createdAt
)
/**tin nhắn được trả lời */
const reply_message = computed(() => $props.message?.snap_replay_message)
/**dữ liệu đính kèm của tin nhắn */
const meta = computed(() => $props.message?.message_metadata)
/**nội dung văn bản thuần tuý */
const text = computed(() => $props.message?.message_text)
/**tiêu đề nút bắt đầu */
const postback_title = computed(() => $props.message?.postback_title)
/**danh sách file đính kèm */
const attachments = computed(() => $props.message?.message_attachments)
/**cảm xúc chính của tin nhắn */
const primary_emotion = computed(() => $props.message?.ai?.[0]?.emotion)
/**AI đánh dấu tin này bị rep chậm */
const is_ai_slow_reply = computed(() => $props.message?.is_ai_slow_reply)

/**ref của modal widget */
const modal_widget_ref = ref<InstanceType<typeof Widget>>()
/**dữ liệu của widget được chọn */
const selected_widget = ref<AppInstalledInfo>()

class Main {
  /**mở modal call center */
  openCallCenter() {
    // tạm thời fix cứng
    /**id của widget gọi điện */
    const CALL_CENTER_WIDGET_ID = '680f3335ff2c365808e08ec0'

    /**dữ liệu của widget */
    const WIDGET = pageStore.market_widgets?.[CALL_CENTER_WIDGET_ID]

    /**dữ liệu của widget theo luồng mới */
    const NEW_PARAM = Parser.toQueryString({
      partner_token:
        pageStore.selected_page_list_info?.[
          conversationStore.select_conversation?.fb_page_id!
        ]?.partner_token,
      client_id: conversationStore.select_conversation?.fb_client_id,
      message_id: $props.message?._id,
      message_phone: $props.message?.client_phone
      // comment_id: $props.comment_id,
    })

    // tạo dữ liệu giống như app đã cài
    selected_widget.value = {
      url: WIDGET?.url_app + `?${NEW_PARAM}`,
      snap_app: WIDGET,
    }

    // mở modal
    modal_widget_ref.value?.toggleModal()
  }
}
const $main = new Main()
</script>
