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
          {{ $t('v1.view.main.dashboard.select_platform.list_invite') }}
        </div>
        <div
          class="p-2 flex flex-col justify-center items-center flex-grow gap-2.5"
        >
          <div class="p-4 bg-gray-100 rounded-full">
            <LayerIcon class="w-7 h-7 text-slate-700" />
          </div>
          <div class="font-semibold">
            {{ $t('v1.view.main.dashboard.select_platform.empty_invite') }}
          </div>
          <div class="text-sm text-slate-700 text-center w-[480px]">
            {{
              $t('v1.view.main.dashboard.select_platform.empty_invite_guild')
            }}
          </div>
        </div>
      </div>
    </template>
  </Modal>
</template>
<script setup lang="ts">
import { ref } from 'vue'

import Modal from '@/components/Modal.vue'
import Menu from '@/views/Dashboard/ConnectPage/Menu.vue'

import LayerIcon from '@/components/Icons/Layer.vue'

/**ref của modal kết nối nền tảng */
const modal_connect_page_ref = ref<InstanceType<typeof Modal>>()

/**ẩn hiện modal của component */
function toggleModal() {
  modal_connect_page_ref.value?.toggleModal()
}

defineExpose({ toggleModal })
</script>
