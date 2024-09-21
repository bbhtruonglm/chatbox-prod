<template>
  <div
    :class="animate_pulse"
    class="overflow-hidden bg-slate-200 rounded-oval"
  >
    <div
      :style="{ background: letterToColorCode() }"
      class="w-full h-full flex justify-center items-center font-semibold text-white"
      v-if="
        conversation?.client_name && conversation?.platform_type === 'WEBSITE'
      "
    >
      {{ nameToLetter(conversation?.client_name) }}
    </div>

    <img
      @error="onImageError"
      @load="removeAnimatePulse"
      loading="lazy"
      v-if="conversation?.platform_type === 'FB_MESS'"
      :src="loadImageUrl()"
      class="w-full h-full"
    />

    <img
      @error="onImageError"
      @load="removeAnimatePulse"
      loading="lazy"
      v-if="conversation?.platform_type === 'FB_INSTAGRAM'"
      :src="loadImageUrl()"
      class="w-full h-full"
    />

    <img
      @error="onImageError"
      @load="removeAnimatePulse"
      loading="lazy"
      v-if="
        conversation?.platform_type === 'ZALO_OA' && conversation?.client_avatar
      "
      :src="conversation?.client_avatar"
      class="w-full h-full"
    />
    <div
      v-else
      :style="{ background: letterToColorCode() }"
      class="w-full h-full flex justify-center items-center font-semibold text-white"
    >
      {{ nameToLetter(conversation?.client_name || '') }}
    </div>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useChatbotUserStore } from '@/stores'
import { nameToLetter } from '@/service/helper/format'

import type { ConversationInfo } from '@/service/interface/app/conversation'

const $props = withDefaults(
  defineProps<{
    /**thông tin cuộc trò chuyện */
    conversation?: ConversationInfo
    /**kích thước thực tế của hình ảnh */
    actual_size?: number
  }>(),
  {
    actual_size: 64,
  }
)

const chatbotUserStore = useChatbotUserStore()

/**thêm hiệu ứng ẩn hiện khi ảnh đang được load */
const animate_pulse = ref('animate-pulse')

onMounted(() => {
  // tắt hiệu ứng với dạng web
  if ($props.conversation?.platform_type === 'WEBSITE') removeAnimatePulse()

  // nếu zalo không có hình ảnh
  if (
    $props.conversation?.platform_type === 'ZALO_OA' &&
    !$props.conversation?.client_avatar
  )
    removeAnimatePulse()
})

/**tạo bg dựa trên chữ cái */
function letterToColorCode() {
  let character = $props.conversation?.client_name

  // lấy chữ cái đầu tiên và Chuyển ký tự thành chữ thường
  const INPUT = character?.charAt(0).toLowerCase()

  // Chuyển đổi ký tự thành mã màu, Lấy mã Unicode và trừ đi mã 'a' (97)
  let charCode = (INPUT?.charCodeAt(0) || 0) - 97

  // Chuyển đổi số nguyên thành giá trị RGB
  var red = (charCode * 30) % 256
  var green = (charCode * 20) % 256
  var blue = (charCode * 10) % 256

  return 'rgb(' + red + ', ' + green + ', ' + blue + ')'
}
/**tắt hiệu ứng ẩn hiện khi ảnh load thành công */
function removeAnimatePulse() {
  animate_pulse.value = ''
}
/**tạo url ảnh */
function loadImageUrl() {
  return `${$env.img_host}/${$props.conversation?.fb_client_id}?page_id=${$props.conversation?.fb_page_id}&staff_id=${chatbotUserStore.chatbot_user?.fb_staff_id}&width=${$props.actual_size}&height=${$props.actual_size}&type=${$props.conversation?.platform_type}`
}
/**khi ảnh load thất bại thì thay thế ảnh mặc định vào */
function onImageError($event: Event) {
  const image = $event.target as HTMLImageElement

  image.src = `${$env.img_host}/1111111111?width=${$props.actual_size}&height=${$props.actual_size}`
}
</script>
