<template>
  <div class="relative z-1">
    <button
      @click="moveSlider('LEFT')"
      class="custom-btn -left-4"
    >
      <ArrowDownIcon class="w-3 h-3 rotate-90" />
    </button>
    <button
      @click="moveSlider('RIGHT')"
      class="custom-btn -right-4"
    >
      <ArrowDownIcon class="w-3 h-3 -rotate-90" />
    </button>
    <div
      ref="slider_warper_ref"
      class="relative w-52 h-[306px] overflow-x-auto scroll-smooth"
    >
      <div class="absolute flex h-full gap-1">
        <div
          v-for="item of data"
          class="bg-white overflow-hidden p-2 rounded-lg flex flex-col gap-1 w-52"
        >
          <div
            :style="{
              'background-image': `url(${item?.image_url})`,
            }"
            class="h-28 bg-no-repeat bg-center bg-cover flex-shrink-0 rounded-lg"
          />
          <div class="text-sm">
            <div class="font-medium truncate">
              {{ item?.title }}
            </div>
            <div class="text-slate-500 truncate">
              {{ item?.subtitle }}
            </div>
          </div>
          <ButtonList
            :data="item?.buttons"
            class="text-sm"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'

import ButtonList from '@/views/ChatWarper/Chat/CenterContent/MessageList/ChatbotMessage/ButtonList.vue'

import ArrowDownIcon from '@/components/Icons/ArrowDown.vue'

import type { AttachmentPayload } from '@/service/interface/app/message'
import type { ComponentRef } from '@/service/interface/vue'

const $props = withDefaults(
  defineProps<{
    data?: AttachmentPayload[]
  }>(),
  {}
)

/**ref của slider */
const slider_warper_ref = ref<ComponentRef>()

/**di chuyển các item bên trong slider */
function moveSlider(direction: 'LEFT' | 'RIGHT') {
  /**độ rộng của 1 slider */
  const WIDTH = 212

  // qua trái
  if (direction === 'LEFT') slider_warper_ref.value.scrollLeft -= WIDTH

  // qua phải
  if (direction === 'RIGHT') slider_warper_ref.value.scrollLeft += WIDTH
}
</script>
<style scoped lang="scss">
.custom-btn {
  @apply rounded-full bg-slate-200 p-2 absolute z-10 top-1/2 -translate-y-1/2;
}
</style>
