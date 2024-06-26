<template>
  <div class="relative">
    <template v-if="isShowArrow()">
      <ArrowDownIcon
        @click="moveSlider('LEFT')"
        class="custom-btn rotate-90 -left-1"
      />
      <ArrowDownIcon
        @click="moveSlider('RIGHT')"
        class="custom-btn -rotate-90 -right-1"
      />
    </template>
    <div
      ref="slider_warper_ref"
      class="overflow-x-auto scroll-smooth flex gap-1"
    >
      <div
        v-for="item of data"
        class="bg-white p-2 rounded-lg flex flex-col gap-1 w-47 flex-shrink-0"
      >
        <div
          :style="{
            'background-image': `url(${item?.image_url})`,
          }"
          class="h-24 bg-no-repeat bg-center bg-cover flex-shrink-0 rounded-lg"
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
  const WIDTH = 192

  // qua trái
  if (direction === 'LEFT') slider_warper_ref.value.scrollLeft -= WIDTH

  // qua phải
  if (direction === 'RIGHT') slider_warper_ref.value.scrollLeft += WIDTH
}
/**quản lý việc hiển thị mũi tên điều hướng */
function isShowArrow() {
  return ($props.data?.length || 0) > 2
}
</script>
<style scoped lang="scss">
.custom-btn {
  @apply cursor-pointer w-3 h-3 absolute flex-shrink-0 z-10 top-1/2 -translate-y-1/2;
}
.w-47 {
  width: 11.8rem;
}
</style>
