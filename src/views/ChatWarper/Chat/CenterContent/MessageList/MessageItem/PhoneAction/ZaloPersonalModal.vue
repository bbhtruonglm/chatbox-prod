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
      <ZaloPeronalCore
        :org_id="orgStore.selected_org_id"
        :actual_client_id="message?.fb_client_id"
        :actual_page_id="message?.fb_page_id"
        :client_id="client_id"
        :message_id="message?._id"
      />
    </template>
  </Modal>
</template>
<script setup lang="ts">
import { useOrgStore, usePageStore } from '@/stores';

import { ref, watch } from 'vue';

import Modal from '@/components/Modal.vue';
import ZaloPeronalCore from '@/views/ChatWarper/Chat/CenterContent/MessageList/MessageItem/PhoneAction/ZaloPeronalCore.vue';

import type { MessageInfo } from '@/service/interface/app/message';
import { container } from 'tsyringe';
import { N4SerivceAppZaloPersonal } from '@/utils/api/N4Service/ZaloPersonal';
import { nextTick } from 'async';

const $props = withDefaults(
  defineProps<{
    /**dữ liệu tin nhắn */
    message?: MessageInfo
  }>(),
  {}
)

const orgStore = useOrgStore()
const pageStore = usePageStore()

const client_id = ref('')

/**ref của modal kết nối nền tảng */
const modal_widget_ref = ref<InstanceType<typeof Modal>>()

class Main {
  constructor(
    private readonly API = container.resolve(N4SerivceAppZaloPersonal)
  ) {}

  /** lấy id của khách */
  async getClientId() {
    /** page đầu tiên không bị mất kết nối */
    const FIRST_PAGE_CONNECTED = this.getFirstPageConnected()

    console.log(FIRST_PAGE_CONNECTED, $props.message);
    

    // nếu không có trang nào thì thôi
    if (!FIRST_PAGE_CONNECTED?.page_id || !$props.message) return

    // lấy id của khách với có số điện thoại trong tin nhắn và đã nhắn cho page
    const RES = await this.API.getClientId(
      FIRST_PAGE_CONNECTED?.page_id,
      $props.message?._id
    )

    client_id.value = RES
  }

  /** lấy dữ liệu của page đầu tiên không bị mất kết nối */
  getFirstPageConnected() {
    return pageStore.zlp_oss?.filter(os => os?.page_info?.type === 'ZALO_PERSONAL' && !os?.page_info?.is_disconnected)?.[0]
  }
  
  /**ẩn hiện modal của component */
  toggleModal() {
    nextTick(async ()=>{
      if(!modal_widget_ref.value?.is_open) {
        await this.getClientId()
      }
      modal_widget_ref.value?.toggleModal()
    })
    
  }
}

const $main = new Main()

// cung cấp hàm toggle modal cho component cha
defineExpose({ toggleModal: $main.toggleModal.bind($main) })
</script>
