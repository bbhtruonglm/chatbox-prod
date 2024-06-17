<template>
  <div class="p-2 flex flex-col gap-3 flex-grow justify-center items-center">
    <div class="flex items-center gap-5">
      <div class="bg-orange-600 rounded-lg py-1 px-2 m-auto flex-shrink-0">
        <BotXIcon class="text-white w-6 h-8" />
      </div>
      <ReloadIcon class="w-5 h-5 text-slate-500 flex-shrink-0" />
      <component
        :is="icon"
        class="w-10 h-10 flex-shrink-0"
      />
    </div>
    <div class="text-center w-[482px]">
      <div class="font-semibold">
        {{ guild }}
      </div>
      <div class="text-sm text-slate-700 relative">
        {{ description }}
        <slot name="after-description" />
      </div>
    </div>
    <button
      @click="$emit('click')"
      class="flex justify-between items-center py-2 px-4 gap-2 bg-slate-100 rounded-md hover:brightness-90"
    >
      <component
        :is="icon"
        class="w-4 h-4"
      />
      <div class="text-slate-900 text-sm font-semibold">
        {{ title }}
      </div>
    </button>
  </div>
</template>
<script setup lang="ts">
import BotXIcon from '@/components/Icons/BotX.vue'
import ReloadIcon from '@/components/Icons/Reload.vue'
import FacebookIcon from '@/components/Icons/Facebook.vue'

import type { Component } from 'vue'

const $props = withDefaults(
  defineProps<{
    /**icon của nền tảng */
    icon: Component
    /**hướng dẫn */
    guild: string
    /**chú thích */
    description: string
    /**tiêu đề nút */
    title: string
  }>(),
  {}
)
</script>
