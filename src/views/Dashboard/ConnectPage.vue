<template>
  <Modal
    ref="modal_connect_page_ref"
    class_modal="min-h-[500px]"
    class_body="py-2 flex gap-2"
  >
    <template #header>
      {{ $t('v1.view.main.dashboard.select_platform.add_page') }}
    </template>
    <template #body>
      <Menu />
      <div class="w-[600px] bg-white rounded-md p-2 flex flex-col">
        <div class="font-semibold p-2 border-b border-slate-200 flex-shrink-0">
          <template v-if="connectPageStore.current_menu === 'WATTING'">
            {{ $t('v1.view.main.dashboard.select_platform.list_invite') }}
          </template>
          <template v-else>
            {{
              $t('v1.view.main.dashboard.select_platform.connect_with', {
                platform: $t(
                  `v1.common.${connectPageStore.current_menu?.toLowerCase()}`
                ),
              })
            }}
          </template>
        </div>
        <Watting v-if="connectPageStore.current_menu === 'WATTING'" />
        <Facebook v-else-if="connectPageStore.current_menu === 'FB_MESS'" />
        <Website v-else-if="connectPageStore.current_menu === 'WEBSITE'" />
        <ZaloOA v-else-if="connectPageStore.current_menu === 'ZALO_OA'" />
        <div
          v-else
          class="p-2"
        >
          {{ $t('v1.common.upcoming_feature') }}
        </div>
      </div>
    </template>
  </Modal>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { useConnectPageStore } from '@/stores'

import Modal from '@/components/Modal.vue'
import Menu from '@/views/Dashboard/ConnectPage/Menu.vue'
import Watting from '@/views/Dashboard/ConnectPage/Watting.vue'
import Facebook from '@/views/Dashboard/ConnectPage/Facebook.vue'
import Website from '@/views/Dashboard/ConnectPage/Website.vue'
import ZaloOA from '@/views/Dashboard/ConnectPage/ZaloOA.vue'

const connectPageStore = useConnectPageStore()

/**ref của modal kết nối nền tảng */
const modal_connect_page_ref = ref<InstanceType<typeof Modal>>()

/**ẩn hiện modal của component */
function toggleModal() {
  modal_connect_page_ref.value?.toggleModal()
}

defineExpose({ toggleModal })
</script>
