<template>
  <Modal
    ref="modal_widget_ref"
    class_modal="w-[432px]"
    class_body="py-2 flex gap-2 h-[80dvh]"
  >
    <template #header>
      {{ $t('Zalo cá nhân') }}
      <!-- {{ $t('Hội thoại Zalo cá nhân') }} -->
    </template>
    <template #body>
      <iframe
        class="w-full"
        :src="`https://localhost:8000/zalo-personal-conversation?org_id=${orgStore.selected_org_id}&actual_client_id=${message?.fb_client_id}&actual_page_id=${message?.fb_page_id}&message_id=${message?._id}`"
        frameborder="0"
      ></iframe>
    </template>
  </Modal>
</template>
<script setup lang="ts">
import { useOrgStore, usePageStore } from '@/stores'

import { onMounted, onUnmounted, ref } from 'vue'

import Modal from '@/components/Modal.vue'

import type { MessageInfo } from '@/service/interface/app/message'
import { N4SerivceAppZaloPersonal } from '@/utils/api/N4Service/ZaloPersonal'
import { nextTick } from 'async'
import { container } from 'tsyringe'

const $props = withDefaults(
  defineProps<{
    /**dữ liệu tin nhắn */
    message?: MessageInfo
  }>(),
  {}
)

const orgStore = useOrgStore()
const pageStore = usePageStore()

/**ref của modal kết nối nền tảng */
const modal_widget_ref = ref<InstanceType<typeof Modal>>()

class Main {
  constructor(
    private readonly API = container.resolve(N4SerivceAppZaloPersonal)
  ) {}

  /** lấy id của khách */
  async getClientId(page_id?:string) {

    // nếu không có trang nào thì thôi
    if (!page_id || !$props.message) return

    // lấy id của khách với có số điện thoại trong tin nhắn và đã nhắn cho page
    const RES = await this.API.getClientId(
      page_id,
      $props.message?._id
    )

    return RES
  }

  /**ẩn hiện modal của component */
  toggleModal() {
    modal_widget_ref.value?.toggleModal()
  }

  /** hàm xử lý khi nhân được sự kiện từ iframe zalo personal core */
  async handleEvent(event: MessageEvent) {
    // nếu không phải từ zalo personal core thi thôi
    if (event.data?.from !== 'ZALO_PERSONAL_CORE') return

    // id của trang cần lấy id khách hàng
    const CLIENT_ID = await $main.getClientId(event.data.data.page_id)

    // gửi id khách hàng vào iframe zalo personal core
    window.postMessage(
      {
        type: 'get.client_id',
        from: 'ZALO_PERSONAL_CONTAINER',
        data: {
          client_id: CLIENT_ID,
        },
      },
      '*'
    )
  }
}

const $main = new Main()

onMounted(() => {
  window.addEventListener('message', $main.handleEvent.bind($main))
})

onUnmounted(() => {
  window.removeEventListener('message', $main.handleEvent.bind($main))
})

// cung cấp hàm toggle modal cho component cha
defineExpose({ toggleModal: $main.toggleModal.bind($main) })
</script>
