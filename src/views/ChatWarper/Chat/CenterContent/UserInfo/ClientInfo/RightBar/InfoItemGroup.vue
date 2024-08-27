<template>
  <div class="flex items-start text-sm">
    <div class="w-28 font-semibold ml-5 flex-shrink-0">
      {{ title }}
    </div>
    <div class="flex flex-col gap-2.5">
      <div v-for="item of source" class="group">
        <div v-if="!conversationStore.is_edit_info">
          {{ item.contact_value }}
        </div>
        <div
          v-else
          class="flex items-center gap-1"
        >
          <input
            v-model="item.contact_value"
            :placeholder
            class="py-2 px-3 rounded-md border focus:outline-none w-80"
          />
          <BinIcon
            v-if="is_allow_remove"
            @click="$emit('remove')"
            class="text-slate-500 w-5 h-5 cursor-pointer hidden group-hover:block"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useConversationStore } from '@/stores'

import BinIcon from '@/components/Icons/Bin.vue'

import type { ContactInfo } from '@/utils/api/Ai'

const conversationStore = useConversationStore()

const $emit = defineEmits(['remove'])

const $props = withDefaults(
  defineProps<{
    source?: ContactInfo[]
    /**tiêu đề */
    title?: string
    /**hướng dẫn */
    placeholder?: string
    /**có cho phép xoá hẳn không */
    is_allow_remove?: boolean
  }>(),
  {}
)
</script>
