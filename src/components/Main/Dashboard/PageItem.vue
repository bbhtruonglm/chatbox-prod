<template>
  <div class="p-2 flex items-center gap-2 hover:bg-slate-100 rounded-lg group">
    <Checkbox
      v-if="checkbox_is_visible"
      v-model="checkbox_model"
      class="flex-shrink-0"
      :disabled="checkbox_is_disabled"
    />
    <PageAvatar
      :page_info="page_info"
      class="w-8 h-8 flex-shrink-0"
    />
    <div class="w-full min-w-0">
      <div class="flex items-center gap-2">
        <div class="flex-grow min-w-0 flex gap-1 items-center">
          <slot name="before-name" />
          <div class="truncate flex-grow min-w-0">
            {{ page_info?.name }}
          </div>
        </div>
        <div class="flex-shrink-0">
          <slot name="after-name" />
        </div>
      </div>
      <div class="flex items-center gap-1">
        <PageTypeIcon
          :page_type="page_info?.type"
          class="flex-shrink-0 w-3.5 h-3.5"
        />
        <div class="text-xs text-slate-500 flex-grow truncate min-w-0">
          {{ page_info?.fb_page_id }}
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import PageAvatar from '@/components/Avatar/PageAvatar.vue'
import PageTypeIcon from '@/components/Avatar/PageTypeIcon.vue'
import Checkbox from '@/components/Checkbox.vue'

import type { PageInfo } from '@/service/interface/app/page'

const $props = withDefaults(
  defineProps<{
    /**dữ liệu của trang */
    page_info: PageInfo
    /**có hiển thị checkbox không */
    checkbox_is_visible?: boolean
    /**trạng thái của checkbox */
    checkbox_is_disabled?: boolean
  }>(),
  {}
)

/**giá trị của checkbox */
const checkbox_model = defineModel('checkbox')
</script>
