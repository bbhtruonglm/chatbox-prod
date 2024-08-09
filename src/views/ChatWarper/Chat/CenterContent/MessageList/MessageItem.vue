<template>
  <div class="w-fit max-w-96 group relative">
    <MessageDate
      :class="{
        'right-0': message_type !== 'client',
      }"
      :time="message_time"
      :meta="meta"
    />
    <ReplyMessage
      v-if="reply_message"
      :message="reply_message"
    />
    <AttachmentMessage
      v-if="isSpecialCase()"
      :message="message"
      :type="message_type === 'client' ? 'CLIENT' : 'PAGE'"
    />
    <SliderWarper
      v-else
      :count_element="message_source?.length"
    >
      <MessageTemplate
        v-for="data_source of message_source"
        :class="addOnClassTemplate()"
        :data_source
        :is_fix_size="message_source?.length > 1"
        :message_type="message?.message_type"
      />
    </SliderWarper>
    <SlowReply
      v-if="
        calcIsClientRepSlow(page_id, message_time, message_index) &&
        message_type === 'client'
      "
      :now_message="message"
      :next_message="messageStore.list_message?.[message_index + 1]"
    />
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import { calcIsClientRepSlow } from '@/service/function'
import { useMessageStore } from '@/stores'
import { useI18n } from 'vue-i18n'

import SlowReply from '@/views/ChatWarper/Chat/CenterContent/MessageList/SlowReply.vue'
import ReplyMessage from '@/views/ChatWarper/Chat/CenterContent/MessageList/ReplyMessage.vue'
import MessageDate from '@/views/ChatWarper/Chat/CenterContent/MessageList/MessageDate.vue'
import MessageTemplate from '@/views/ChatWarper/Chat/CenterContent/MessageList/MessageItem/MessageTemplate.vue'
import SliderWarper from '@/views/ChatWarper/Chat/CenterContent/MessageList/MessageItem/SliderWarper.vue'
import AttachmentMessage from '@/views/ChatWarper/Chat/CenterContent/MessageList/AttachmentMessage.vue'

import type {
  ChatbotButton,
  MessageInfo,
  MessageTemplateInput,
} from '@/service/interface/app/message'

const messageStore = useMessageStore()
const { t: $t } = useI18n()

const $props = withDefaults(
  defineProps<{
    /**dữ liệu của tin nhắn */
    message: MessageInfo
    /**vị trí của tin nhắn trong mảng */
    message_index: number
  }>(),
  {}
)

/**tin nhắn này thuộc về dạng nào */
const message_type = computed(() => $props.message?.message_type)
/**id trang */
const page_id = computed(() => $props.message?.fb_page_id)
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
/**danh sách file đính kèm */
const list_attachment = computed(() => $props.message?.message_attachments)
/**dữ liệu của tin nhắn */
const message_source = computed<MessageTemplateInput[]>(() => {
  /**
   * - chỉ lấy dữ liệu của attr đầu tiên
   * - nếu có nhiều attr thì xử lý kiểu khác
   */
  const SOURCE = list_attachment.value?.[0]

  /**kết quả trả về */
  let result: MessageTemplateInput[] = []

  // nếu không attr -> văn bản thuần tuý | nếu không có thì báo lỗi
  if (!SOURCE?.payload)
    result.push({ content: text.value || $t('v1.common.unsupport_message') })

  // nếu chỉ có các nút bấm -> chỉ tạo 1 record
  if (SOURCE?.payload?.buttons)
    result.push({
      // nút bấm sẽ kèm theo một nội dung tin nhắn nào đó
      content: text.value,
      // map lại dữ liệu nút bấm
      list_button: formatButton(SOURCE.payload.buttons),
    })

  // nếu là dạng element (slider, file đã xử lý AI) -> tạo 1 mảng dữ liệu
  if (SOURCE?.payload?.elements)
    result.push(
      ...SOURCE?.payload?.elements?.map((element, index) => {
        /**dữ liệu của 1 template */
        let res: MessageTemplateInput = {}

        // tạm thời chỉ hiện AI với image
        if ($props.message?.ai?.[0]?.ocr) res.is_ai = true

        // thêm dữ liệu AI nếu có
        if ($props.message?.ai?.[index]) res.ai = $props.message?.ai?.[index]

        // tiêu đề
        res.title = element.title
        // nội dung văn bản, hoặc url file fb không hiển thị được
        res.content = element.subtitle || text.value || element.url
        // danh sách nút bấm
        if (element?.buttons) res.list_button = formatButton(element?.buttons)

        // hình ảnh của slider
        if (element.image_url) res.image = { url: element.image_url }

        // video của AI
        if (element.video_url) res.video = { url: element.video_url }
        // âm thanh của AI
        if (element.audio_url) res.audio = { url: element.audio_url }
        // file của AI
        if (element.file_url) res.file = { url: element.file_url }

        // trả về dữ liệu
        return res
      })
    )

  // nếu chỉ có url (là file nhưng chưa xử lý AI) -> tạo 1 record
  if (SOURCE?.payload?.url && !SOURCE?.payload?.elements) {
    /**dữ liệu của 1 template */
    let res: MessageTemplateInput = {}

    // hình ảnh
    if (SOURCE?.type === 'image') res.image = { url: SOURCE.payload.url }
    // video
    if (SOURCE?.type === 'video') res.video = { url: SOURCE.payload.url }
    // âm thanh
    if (SOURCE?.type === 'audio') res.audio = { url: SOURCE.payload.url }
    // tập tin khác
    if (SOURCE?.type === 'file') res.file = { url: SOURCE.payload.url }

    // trả về dữ liệu
    result.push(res)
  }

  // trả về mảng rỗng
  return result
})
/**xử lý dữ liệu nút bấm */
function formatButton(list_raw_button: ChatbotButton[]) {
  return list_raw_button?.map(button => ({
    title: button.title,
    url: button?.url,
    type: button?.type,
  }))
}
/**tính toán bg, viền cho tin nhắn */
function addOnClassTemplate() {
  return {
    'bg-[#FFF8E1]': message_type.value === 'page',
    'bg-white': message_type.value === 'client',
    'bg-[#D8F6CB]': message_type.value === 'note',
    'border border-red-500':
      calcIsClientRepSlow(
        page_id.value,
        message_time.value,
        $props.message_index
      ) && message_type.value === 'client',
  }
}

/**
 * có phải là trường hợp tin nhắn đặc biệt không
 * - khi có mảng nhiều file đính kèm
 * => sẽ hiển thị kiểu khác
 */
function isSpecialCase() {
  return (list_attachment.value?.length || 0) > 1
}
</script>
