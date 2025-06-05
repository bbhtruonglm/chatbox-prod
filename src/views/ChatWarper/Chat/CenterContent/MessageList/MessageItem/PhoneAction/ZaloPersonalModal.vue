<template>
  <Modal
    ref="modal_widget_ref"
    class_modal="w-[432px]"
    class_body="py-2 flex gap-2"
  >
    <template #header>
      {{ $t('Zalo cá nhân') }}
      <!-- {{ $t('Hội thoại Zalo cá nhân') }} -->
    </template>
    <template #body>
      <ZaloPeronalCore :message />
    </template>
  </Modal>
</template>
<script setup lang="ts">
import ZaloPeronalCore from '@/views/ChatWarper/Chat/CenterContent/MessageList/MessageItem/PhoneAction/ZaloPeronalCore.vue'
import { ref } from 'vue'

import Modal from '@/components/Modal.vue'

import type { MessageInfo } from '@/service/interface/app/message'

const $props = withDefaults(
  defineProps<{
    /**dữ liệu tin nhắn */
    message?: MessageInfo
  }>(),
  {}
)

/**ref của modal kết nối nền tảng */
const modal_widget_ref = ref<InstanceType<typeof Modal>>()

/**ẩn hiện modal của component */
function toggleModal() {
  modal_widget_ref.value?.toggleModal()
}

// cung cấp hàm toggle modal cho component cha
defineExpose({ toggleModal })
</script>
