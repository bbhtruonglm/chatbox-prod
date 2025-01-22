<template>
  <dialog
    ref="ref_modal"
    :id
    @click="$main.toggleModal"
    :class="class_modal"
    class="rounded-xl p-2 shadow-lg max-w-[95%] max-h-[95%] [&[open]]:flex flex-col"
  >
    <header
      v-if="$slots.header"
      @click.stop
      class="flex-shrink-0 flex items-center justify-between gap-2 relative"
    >
      <h2
        :class="class_header"
        class="text-lg font-medium flex-shrink-0 w-full"
      >
        <slot name="header" />
      </h2>
      <button
        @click="$main.toggleModal"
        :class="class_close"
        class="p-1 absolute right-0"
      >
        <XMarkIcon class="size-5" />
      </button>
    </header>
    <section
      v-if="$slots.body"
      @click.stop
      :class="class_body"
      class="flex-grow overflow-y-auto"
    >
      <slot name="body" />
    </section>
    <footer
      v-if="$slots.footer"
      @click.stop
      :class="class_footer"
      class="flex-shrink-0"
    >
      <slot name="footer" />
    </footer>
  </dialog>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { useEventListener, type Fn } from '@vueuse/core'

import { XMarkIcon } from '@heroicons/vue/24/solid'

const $props = withDefaults(
  defineProps<{
    /**class cho modal */
    class_modal?: string
    /**class cho header */
    class_header?: string
    /**class cho close button */
    class_close?: string
    /**class cho body */
    class_body?: string
    /**class cho footer */
    class_footer?: string
    /**id nhận dạng */
    id?: string
  }>(),
  {}
)

/**ref của modal */
const ref_modal = ref<HTMLDialogElement>()

class Main {
  /**hủy lắng nghe sự kiện nhấn phím */
  private clearEventListener?: Fn

  /**ẩn hiển modal */
  toggleModal() {
    // nếu modal đang mở thì đóng
    if (ref_modal.value?.open) {
      // đóng modal
      ref_modal.value.close()

      // gọi hàm khi modal đóng
      this.onModalClose()
    }
    // nếu modal đang đóng thì mở
    else {
      // mở modal
      ref_modal.value?.showModal()

      // gọi hàm khi modal mở
      this.onModalOpen()
    }
  }
  /**xử lý sự kiện khi nhấn phím */
  handleKeyDown($event: KeyboardEvent) {
    // nếu nhấn phím ESC thì đóng modal
    if ($event.key === 'Escape') this.toggleModal()
  }
  /**lắng nghe sự kiện khi modal mở */
  onModalOpen() {
    // lắng nghe sự kiện nhấn phím
    this.clearEventListener = useEventListener(
      document,
      'keydown',
      this.handleKeyDown.bind(this)
    )
  }
  /**lắng nghe sự kiện khi modal đóng */
  onModalClose() {
    // hủy lắng nghe sự kiện nhấn phím
    this?.clearEventListener?.()
  }
}
const $main = new Main()

defineExpose({ toggleModal: $main.toggleModal.bind($main) })
</script>
