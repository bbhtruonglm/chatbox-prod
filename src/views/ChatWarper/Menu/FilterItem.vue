<template>
  <div class="relative">
    <NavItem
      :is_disable_tooltip="is_disable_tooltip"
      :is_active="is_active"
      :icon="icon"
      :title="title"
    />
    <button
      @click.stop="$emit('cancel_filter')"
      v-if="is_active"
      class="absolute top-[1px] right-[1px]"
    >
      <img
        class="w-3.5 h-3.5"
        src="@/assets/icons/close-circle.svg"
      />
    </button>
  </div>
</template>
<script setup lang="ts">
import NavItem from '@/views/ChatWarper/Menu/NavItem.vue'

import type { Component } from 'vue'

const $emit = defineEmits(['cancel_filter'])

withDefaults(
  defineProps<{
    /**icon của item */
    icon: Component
    /**tiêu đề của item */
    title: string
    /**item này có đang được kích hoạt hay không */
    is_active?: boolean
    /**có huỷ bỏ tooltip không */
    is_disable_tooltip?: boolean
  }>(),
  {}
)
</script>
