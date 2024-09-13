<template>
  <Modal
    ref="modal_widget_ref"
    class_modal="w-[400px] h-[630px]"
    class_body="py-2 flex gap-2"
  >
    <template #header>
      <template v-if="selected_widget?.snap_app?.name">
        {{ selected_widget?.snap_app?.name }}
      </template>
      <template v-else>
        {{ $t('v1.view.main.dashboard.chat.message.widget.not_active') }}
      </template>
    </template>
    <template #body>
      <div class="bg-white rounded-md p-2 flex flex-col relative w-full h-full">
        <iframe
          v-if="selected_widget"
          :id="`widget-${selected_widget?._id}`"
          class="w-full h-full"
          :src="genUrl()"
          frameborder="0"
        />
        <div
          v-else
          class="text-sm text-center text-slate-500"
        >
          {{
            $t(
              'v1.view.main.dashboard.chat.message.widget.not_active_description'
            )
          }}
        </div>
      </div>
    </template>
  </Modal>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { Parser } from '@/utils/helper/Parser'

import Modal from '@/components/Modal.vue'

import type { AppInstalledInfo } from '@/service/interface/app/widget'
import type { MessageAiData } from '@/service/interface/app/message'

const $props = withDefaults(
  defineProps<{
    /**dữ liệu của widget được chọn */
    selected_widget?: AppInstalledInfo
    /**dữ liệu của AI nếu có */
    ai?: MessageAiData
  }>(),
  {}
)

/**ref của modal kết nối nền tảng */
const modal_widget_ref = ref<InstanceType<typeof Modal>>()

/**tạo ra url của iframe */
function genUrl() {
  /**đường dẫn của iframe */
  let url = $props.selected_widget?.url

  // nếu không có CTA thì thôi
  if (!$props.ai?.cta) return url

  // xoá bỏ _id của AI
  delete $props.ai._id

  // thêm các thông tin của AI vào url
  url += `&${Parser.toQueryString($props.ai)}`

  return url
}
/**ẩn hiện modal của component */
function toggleModal() {
  modal_widget_ref.value?.toggleModal()
}

// cung cấp hàm toggle modal cho component cha
defineExpose({ toggleModal })
</script>
