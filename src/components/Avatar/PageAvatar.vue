<template>
  <div
    :class="animate_pulse"
    class="overflow-hidden bg-slate-200 rounded-oval"
  >
    <img
      @load="removeAnimatePulse"
      loading="lazy"
      v-if="page_info?.type === 'FB_MESS'"
      :src="loadImageUrl()"
      class="w-full h-full"
    />

    <img
      @load="removeAnimatePulse"
      loading="lazy"
      v-else-if="page_info?.type === 'FB_INSTAGRAM'"
      :src="loadImageUrl(page_info?.page_id)"
      class="w-full h-full"
    />

    <template v-else-if="page_info?.type === 'WEBSITE'">
      <img
        v-if="page_info?.avatar"
        @load="removeAnimatePulse"
        loading="lazy"
        :src="page_info?.avatar"
        class="w-full h-full"
      />
      <WebIcon
        v-else
        class="w-full h-full"
      />
    </template>

    <img
      @load="removeAnimatePulse"
      loading="lazy"
      v-else-if="page_info?.type === 'FB_WHATSAPP'"
      src="@/assets/icons/whatsapp.svg"
      class="w-full h-full"
    />

    <img
      @load="removeAnimatePulse"
      loading="lazy"
      v-else-if="page_info?.type === 'ZALO_OA'"
      :src="page_info?.avatar || zaloSvg"
      class="w-full h-full"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'

import zaloSvg from '@/assets/icons/zalo.svg'
import WebIcon from '@/components/Icons/Web.vue'

import type { PageInfo } from '@/service/interface/app/page'

const $props = withDefaults(
  defineProps<{
    /**dữ liệu của trang */
    page_info?: PageInfo
  }>(),
  {}
)

/**kích thước thực tế của hình ảnh */
const ACTUAL_SIZE = 64

/**thêm hiệu ứng ẩn hiện khi ảnh đang được load */
const animate_pulse = ref('animate-pulse')

onMounted(() => {
  // nếu web không có avatar thì tắt hiệu ứng, để dùng component mặc định
  if ($props.page_info?.type === 'WEBSITE' && !$props.page_info?.avatar)
    removeAnimatePulse()
})

/**tắt hiệu ứng ẩn hiện khi ảnh load thành công */
function removeAnimatePulse() {
  animate_pulse.value = ''
}
/**tạo url ảnh */
function loadImageUrl(page_id?: string) {
  return `${$env.img_host}/${
    page_id || $props.page_info?.fb_page_id
  }?width=${ACTUAL_SIZE}&height=${ACTUAL_SIZE}`
}
</script>