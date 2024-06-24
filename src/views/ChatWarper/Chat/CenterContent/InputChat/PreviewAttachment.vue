<template>
  <div
    v-if="size(messageStore.upload_file_list)"
    class="flex flex-wrap justify-center overflow-y-auto h-16 gap-1"
  >
    <button
      v-for="(file, index) of messageStore.upload_file_list"
      class="overflow-hidden rounded-lg relative"
    >
      <img
        v-if="!file.is_done && !file.is_loading"
        @click="deleteUploadFile(index)"
        class="absolute top-[1px] right-[1px]"
        src="@/assets/icons/close-circle.svg"
      />
      <div
        v-if="file.is_loading"
        class="center"
      >
        <Loading />
      </div>
      <img
        v-if="file.is_done"
        class="center"
        src="@/assets/icons/check-circle.svg"
      />
      <img
        v-if="file.preview"
        class="attachment-size"
        :src="file.preview"
      />
      <img
        v-else-if="file.type === 'image'"
        class="attachment-size"
        src="@/assets/icons/picture.svg"
      />
      <img
        v-else-if="file.type === 'video'"
        class="attachment-size"
        src="@/assets/icons/play.svg"
      />
      <img
        v-else-if="file.type === 'audio'"
        class="attachment-size"
        src="@/assets/icons/audio.svg"
      />
      <img
        v-else
        class="attachment-size"
        src="@/assets/icons/file.svg"
      />
    </button>
  </div>
</template>
<script setup lang="ts">
import { size, pullAt } from 'lodash'
import { useMessageStore } from '@/stores'

import Loading from '@/components/Loading.vue'

const messageStore = useMessageStore()

/**xoá file định gửi */
function deleteUploadFile(index: number) {
  pullAt(messageStore.upload_file_list, index)
}
</script>
<style scoped lang="scss">
.center {
  @apply absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2;
}
.attachment-size {
  @apply h-16 w-16;
}
</style>
