<template>
  <button
    :style="{
      color: isActiveLabel?.(label_info?._id) ? 'white' : label_info?.bg_color,
      background: isActiveLabel?.(label_info?._id)
        ? label_info?.bg_color
        : 'white',
    }"
    class="text-[10px] w-fit px-1 rounded"
  >
    {{ label_info?.title }}
  </button>
</template>
<script setup lang="ts">
import { IS_ACTIVE_LABEL_FUNCT } from '@/views/ChatWarper/Chat/CenterContent/InputChat/symbol'
import { inject } from 'vue'

import type { LabelInfo } from '@/service/interface/app/label'

const $props = withDefaults(
  defineProps<{
    label_info: LabelInfo
  }>(),
  {}
)

/**kiểm tra xem nhãn có được chọn không */
const isActiveLabel = inject(IS_ACTIVE_LABEL_FUNCT)
</script>
