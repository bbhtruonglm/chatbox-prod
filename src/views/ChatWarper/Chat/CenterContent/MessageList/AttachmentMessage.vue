<template>
  <div
    :class="{
      'justify-end': type === 'PAGE',
    }"
    class="p-2 bg-white rounded-lg flex flex-col gap-2"
  >
    <div class="flex gap-2 justify-between">
      <div class="flex flex-wrap relative z-1 gap-2">
        <template v-for="attachment of horizontal_attachment_list">
          <div
            v-if="attachment.type !== 'fallback'"
            @click="viewAttachment(getFile(attachment.index))"
            class="cursor-pointer hover:brightness-90"
          >
            <ImageAttachment
              v-if="getTypeFromIndex(attachment.index) === 'image'"
              :url="getFileUrl(attachment.index)"
              :class="
                // bắt buộc phải fix cứng độ cao nếu không giao diện sẽ bị giật, vì infinity scroll tính sai vị trí
                // nếu chỉ có 1 ảnh thì tăng độ cao để hiển thị to hơn
                // nếu có nhiều ảnh thì giảm độ cao để hiển thị được nhiều ảnh cùng lúc hơn
                // kích thước chiều rộng để auto, tự động co kéo theo chiều ngang
                // để kích thước chiều rộng auto có thể gây giật với một bộ các ảnh, vì trước khi hình ảnh render thì widget = 1, render xong with dài hơn đẩy hình ảnh xuống, làm tăng chiều dài tổng thể của trang
                horizontal_attachment_list?.length === 1 ? 'h-40' : 'h-20'
              "
            />
            <AnotherAttachment
              v-else
              :url="getFileUrl(attachment.index)"
              :name="getFileName(attachment.index)"
            />
          </div>
        </template>
        <template v-for="attachment of vertical_attachment_list">
          <VideoAttachment
            v-if="getTypeFromIndex(attachment.index) === 'video'"
            :url="getFileUrl(attachment.index)"
          />
          <AudioAttachment
            v-else-if="getTypeFromIndex(attachment.index) === 'audio'"
            :url="getFileUrl(attachment.index)"
          />
        </template>
      </div>
      <button
        v-if="isOnlyAttachment()"
        @click="is_show_text = !is_show_text"
        class="flex-shrink-0 bg-slate-200 p-1.5 rounded-lg h-fit flex items-center"
      >
        <template v-if="!is_show_text">
          <ArrowRightIcon class="w-3 h-3" />
          <span class="font-medium text-sm">A</span>
        </template>
        <ArrowDownIcon
          v-else
          class="w-4 h-4"
        />
      </button>
    </div>
    <div
      v-if="isOnlyAttachment() && is_show_text"
      class="text-sm h-full truncate-3-line"
    >
      {{ message?.ai?.[0]?.ocr }}
    </div>
    <button
      v-if="isOnlyAttachment() && message?.ai?.[0]?.cta"
      class="text-sm py-2 bg-slate-200 rounded-lg min-w-60"
    >
      {{
        $t(`v1.view.main.dashboard.chat.message.cta.${message?.ai?.[0]?.cta}`)
      }}
    </button>
  </div>
  <!-- <MediaDetail
    ref="media_detail_ref"
    :data_source
  /> -->
</template>
<script setup lang="ts">
import { computed, onMounted, watch } from 'vue'
import { useMessageStore } from '@/stores'
import { last, size } from 'lodash'
import { get_url_attachment } from '@/service/api/chatbox/n6-static'
import { ref } from 'vue'

import ImageAttachment from '@/views/ChatWarper/Chat/CenterContent/MessageList/AttachmentMessage/ImageAttachment.vue'
import VideoAttachment from '@/views/ChatWarper/Chat/CenterContent/MessageList/AttachmentMessage/VideoAttachment.vue'
import AudioAttachment from '@/views/ChatWarper/Chat/CenterContent/MessageList/AttachmentMessage/AudioAttachment.vue'
import AnotherAttachment from '@/views/ChatWarper/Chat/CenterContent/MessageList/AttachmentMessage/AnotherAttachment.vue'
import MediaDetail from '@/views/ChatWarper/Chat/CenterContent/MessageList/MessageItem/MediaDetail.vue'

import ArrowDownIcon from '@/components/Icons/ArrowDown.vue'
import ArrowRightIcon from '@/components/Icons/ArrowRight.vue'

import type {
  AttachmentInfo,
  MessageInfo,
  MessageTemplateInput,
} from '@/service/interface/app/message'

const $props = withDefaults(
  defineProps<{
    /**dữ liệu của tin nhắn */
    message: MessageInfo
    /**được gửi từ đâu */
    type: 'CLIENT' | 'PAGE'
    /**có phải là tin nhắn trả lời không */
    is_reply?: boolean
  }>(),
  {}
)

const messageStore = useMessageStore()

/**các kiểu dữ liệu hiện kiểu khác */
const SHOW_TYPE: any[] = ['video', 'audio']
/**các tập tin sẽ hiển thị dạng đứng */
const vertical_attachment_list = ref<AttachmentInfo[]>([])
/**các tập tin hiển thị dạng dọc */
const horizontal_attachment_list = ref<AttachmentInfo[]>([])
/**có hiển thị văn bản ocr không */
const is_show_text = ref(false)

watch(
  () => $props.message?.message_attachments,
  () => getAttachmentInfo()
)

onMounted(() => getAttachmentInfo())

/**dữ liệu của tin nhắn */
// const message_source = computed<MessageTemplateInput[]>(() => {
//   /**
//    * - chỉ lấy dữ liệu của attr đầu tiên
//    * - nếu có nhiều attr thì xử lý kiểu khác
//    */
//   const SOURCE = $props.message?.message_attachments?.[0]

//   /**kết quả trả về */
//   let result: MessageTemplateInput[] = []

//   // nếu không attr -> văn bản thuần tuý | nếu không có thì báo lỗi
//   if (!SOURCE)
//     result.push({ content: text.value || $t('v1.common.unsupport_message') })

//   // nếu chỉ có các nút bấm -> chỉ tạo 1 record
//   if (SOURCE?.payload?.buttons)
//     result.push({
//       // nút bấm sẽ kèm theo một nội dung tin nhắn nào đó
//       content: text.value,
//       // map lại dữ liệu nút bấm
//       list_button: formatButton(SOURCE.payload.buttons),
//     })

//   // nếu là dạng element (slider, file đã xử lý AI) -> tạo 1 mảng dữ liệu
//   if (SOURCE?.payload?.elements)
//     result.push(
//       ...SOURCE?.payload?.elements?.map(element => {
//         /**dữ liệu của 1 template */
//         let res: MessageTemplateInput = {}

//         // tạm thời chỉ hiện AI với image
//         if ($props.message?.ai?.[0]?.ocr) res.is_ai = true

//         // tiêu đề
//         res.title = element.title
//         // nội dung văn bản, hoặc url file fb không hiển thị được
//         res.content = element.subtitle || text.value || element.url
//         // danh sách nút bấm
//         if (element?.buttons) res.list_button = formatButton(element?.buttons)

//         // hình ảnh của slider
//         if (element.image_url) res.image = { url: element.image_url }

//         // video của AI
//         if (element.video_url) res.video = { url: element.video_url }
//         // âm thanh của AI
//         if (element.audio_url) res.audio = { url: element.audio_url }
//         // file của AI
//         if (element.file_url) res.file = { url: element.file_url }

//         // trả về dữ liệu
//         return res
//       })
//     )

//   // nếu chỉ có url (là file nhưng chưa xử lý AI) -> tạo 1 record
//   if (SOURCE?.payload?.url && !SOURCE?.payload?.elements) {
//     /**dữ liệu của 1 template */
//     let res: MessageTemplateInput = {}

//     // hình ảnh
//     if (SOURCE?.type === 'image') res.image = { url: SOURCE.payload.url }
//     // video
//     if (SOURCE?.type === 'video') res.video = { url: SOURCE.payload.url }
//     // âm thanh
//     if (SOURCE?.type === 'audio') res.audio = { url: SOURCE.payload.url }
//     // tập tin khác
//     if (SOURCE?.type === 'file') res.file = { url: SOURCE.payload.url }

//     // trả về dữ liệu
//     result.push(res)
//   }

//   // trả về mảng rỗng
//   return result
// })

/**kiểm tra có phải có nhiều file đính kèm không */
function isOnlyAttachment() {
  return size(getAttachmentFromStore()) === 1
}
/**lấy link fb của file */
function getFileUrl(index?: number) {
  // nếu không có index thì không cần xử lý
  if (index === undefined) return ''

  return getAttachmentFromStore()?.[index]?.payload?.url
}
/**lấy tên của file */
function getFileName(index?: number) {
  try {
    /**đường dẫn của file */
    const FILE_PATH = getFileUrl(index)

    // nếu không có đường dẫn thì thôi
    if (!FILE_PATH) return ''

    /**Sử dụng URL API để tách phần pathname */
    const PATH = new URL(FILE_PATH)?.pathname

    // lấy tên file từ pathname
    return last(PATH?.split('/'))
  } catch (e) {
    return ''
  }
}
/**lấy dữ liệu của file */
function getFile(index?: number) {
  if (index === undefined) return {}

  return getAttachmentFromStore()?.[index]
}
/**đọc kiểu của tập tin */
function getTypeFromIndex(index?: number) {
  if (index === undefined) return ''

  return getAttachmentFromStore()?.[index]?.type
}
/**đọc dữ liệu của tập tin */
function getAttachmentFromStore() {
  const TARGET_ID = $props.message?.message_mid

  if (!TARGET_ID) return []

  return messageStore.attachment_list?.[TARGET_ID] || []
}
/**đọc dữ liệu của file để hiển thị */
function getAttachmentInfo() {
  // hình ảnh của nền tảng khác FB không cần xử lý lấy link mới nhất
  if ($props.message?.platform_type !== 'FB_MESS') {
    // thêm index vào để mapping với dữ liệu
    let list_att =
      $props.message?.message_attachments?.map((attr, index) => ({
        ...attr,
        index,
      })) || []

    // luôn luôn hiển thị dọc
    horizontal_attachment_list.value = list_att

    // nạp thông tin att vào store
    messageStore.attachment_list[$props.message?.message_mid || ''] = list_att

    return
  }

  // xử lý hình ảnh cho riêng FB

  // không có file thì không cần xử lý
  if (!size($props.message?.message_attachments)) return

  // chia file thành 2 dạng hiển thị ngang và dọc

  // xóa dữ liệu cũ nếu có
  vertical_attachment_list.value = []
  horizontal_attachment_list.value = []

  // duyệt qua từng file
  $props.message?.message_attachments?.forEach((attachment, index) => {
    // thêm index vào để mapping với dữ liệu lấy từ sv về
    attachment.index = index

    // dạng dọc thì hiển thị tất cả
    if (SHOW_TYPE.includes(attachment.type))
      return vertical_attachment_list.value.push(attachment)

    // dạng ngang

    // nếu là tin nhắn trả lời thì chỉ hiển thị 1 file đầu tiên
    // if ($props.is_reply && index > 0) return

    // nếu không phải tin nhắn trả lời thì hiển thị tất cả
    horizontal_attachment_list.value.push(attachment)
  })

  if (size(getAttachmentFromStore())) return

  const TARGET_ID = $props.message?.message_mid

  if (!TARGET_ID) return

  get_url_attachment(
    {
      target_id: TARGET_ID,
      type: 'MESSAGE',
      page_id: $props.message?.fb_page_id,
    },
    (e, r) => {
      if (e || !r) return

      // nạp, cache dữ liệu
      messageStore.attachment_list[TARGET_ID] = r
    }
  )
}
/**xem chi tiết file này */
function viewAttachment(attachment?: AttachmentInfo) {
  if (!attachment) return

  messageStore.select_attachment = attachment
}
</script>
<style scoped lang="scss">
.truncate-3-line {
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}
</style>
