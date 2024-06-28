<template>
  <ActorItem>
    <template #before-avatar>
      <Checkbox
        v-if="checkbox_is_visible"
        v-model="checkbox_model"
        class="flex-shrink-0"
        :disabled="checkbox_is_disabled"
      />
    </template>
    <template #avatar>
      <PageAvatar
        :page_info="page_info"
        class="w-8 h-8"
      />
    </template>
    <template #name>
      {{ page_info?.name }}
    </template>
    <template #after-name>
      <slot name="after-name" />
    </template>
    <template #description>
      <PageTypeIcon
        :page_type="page_info?.type"
        class="flex-shrink-0 w-3.5 h-3.5"
      />
      <div class="text-xs text-slate-500 flex-grow truncate min-w-0">
        {{ page_info?.fb_page_id }}
      </div>
    </template>
  </ActorItem>
</template>
<script setup lang="ts">
import PageAvatar from '@/components/Avatar/PageAvatar.vue'
import PageTypeIcon from '@/components/Avatar/PageTypeIcon.vue'
import Checkbox from '@/components/Checkbox.vue'
import ActorItem from '@/components/Main/Dashboard/ActorItem.vue'

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
const checkbox_model = defineModel<boolean>('checkbox')
</script>
