<template>
  <div
    v-tooltip.bottom="getLabelInfo(page_id, label_id)?.title"
    :tooltip-disabled="getLabelConfig() === 'ICON'"
    v-if="getLabelInfo(page_id, label_id)"
    :style="{ background: getLabelInfo(page_id, label_id)?.bg_color }"
    :class="{
      'w-3 h-3': getLabelConfig()?.includes('ICON'),
    }"
    class="text-white rounded-full text-[9px] truncate px-1"
  >
    <template v-if="!getLabelConfig()?.includes('ICON')">
      {{ getLabelInfo(page_id, label_id)?.title }}
    </template>
  </div>
</template>
<script setup lang="ts">
import { getLabelInfo, getPageInfo } from '@/service/function'
import { useChatbotUserStore } from '@/stores'

const $props = withDefaults(
  defineProps<{
    /**id trang */
    page_id?: string
    /**id nhãn */
    label_id: string
  }>(),
  {}
)

const chatbotUserStore = useChatbotUserStore()

/**lấy cài đặt nhãn */
function getLabelConfig() {
  // * Trường hợp bật chế độ ghi đè thiết lập page
  if (chatbotUserStore.enable_personal_setting) {
    return (
      (chatbotUserStore.personal_settings.display_label_type as string) ||
      getPageInfo($props.page_id)?.display_label_type ||
      'ICON_TOOLTIP'
    )
  }

  // * Trường hợp không bật chế độ ghi đè thiết lập page
  return getPageInfo($props.page_id)?.display_label_type || 'ICON_TOOLTIP'
}
</script>
