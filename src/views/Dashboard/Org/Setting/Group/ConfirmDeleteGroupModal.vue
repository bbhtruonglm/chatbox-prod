<template>
  <BaseModal
    ref="ref_confirm_delete_group_modal"
    class_modal="w-[458px]"
    class_header="text-lg font-semibold p-6"
    class_close="right-3"
    class_body="px-5"
    class_footer="p-6 flex justify-between"
  >
    <template v-slot:header>
      {{ $t('Xác nhận xóa nhóm') }}
    </template>
    <template v-slot:body>
      <div
        v-html="
          $t('Xóa nhóm _ ra khỏi Tổ chức _', {
            group_name: 'xxxx',
            org_name: 'yyyy',
          })
        "
      />
    </template>
    <template v-slot:footer>
      <button
        @click="$main.toggleModal"
        class="custom-btn bg-slate-200 text-slate-500"
      >
        {{ $t('Đóng') }}
      </button>
      <button
        @click="$main.deleteGroup()"
        class="custom-btn bg-red-100 text-red-500"
      >
        {{ $t('Xóa') }}
      </button>
    </template>
  </BaseModal>
</template>
<script setup lang="ts">
import { ref } from 'vue'

import BaseModal from '@/components/Base/BaseModal.vue'

/**ref của modal hướng dẫn cài đặt */
const ref_confirm_delete_group_modal = ref<InstanceType<typeof BaseModal>>()

class Main {
  /**ẩn hiện modal */
  toggleModal() {
    // ẩn hiện modal
    ref_confirm_delete_group_modal.value?.toggleModal?.()
  }
  /**Xử lý xóa nhóm */
  deleteGroup() {
    // Xử lý xóa nhóm
  }
}
const $main = new Main()

defineExpose({ toggleModal: $main.toggleModal.bind($main) })
</script>
<style lang="scss" scoped>
.custom-btn {
  @apply py-2 px-4 rounded-md font-medium text-sm;
}
</style>
