<template>
  <div
    :class="is_expand_label ? 'max-h-40 min-h-5' : 'h-5'"
    class="flex pl-4 gap-2"
  >
    <div
      v-if="is_loading_label"
      class="absolute z-10 left-1/2 -translate-x-1/2"
    >
      <Loading />
    </div>

    <div class="flex items-end">
      <button
        v-tooltip="
          is_expand_label ? $t('v1.common.contract') : $t('v1.common.expand')
        "
        @click="is_expand_label = !is_expand_label"
      >
        <ArrowCircleUp
          :class="{
            'rotate-180': is_expand_label,
          }"
          class="w-5 h-5 duration-500"
        />
      </button>
    </div>
    <div class="w-full overflow-y-auto flex flex-wrap justify-start gap-2">
      <LabelItem
        v-for="label_info of getActiveLabel()"
        :label_info
        @click="toggleLabel(label_info._id)"
      />
      <div
        v-if="getActiveLabel()?.length"
        class="w-full"
      />
      <LabelItem
        v-for="label_info of getUnactiveLabel()"
        :label_info
        @click="toggleLabel(label_info._id)"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import { provide, ref } from 'vue'
import { getLabelValid, getPageLabel } from '@/service/function'
import { map } from 'lodash'
import { useConversationStore } from '@/stores'
import { toggle_label_conversation } from '@/service/api/chatbox/n4-service'
import { toastError } from '@/service/helper/alert'
import { IS_ACTIVE_LABEL_FUNCT } from '@/views/ChatWarper/Chat/CenterContent/InputChat/symbol'

import Loading from '@/components/Loading.vue'
import LabelItem from '@/views/ChatWarper/Chat/CenterContent/InputChat/ListLabel/LabelItem.vue'

import ArrowCircleUp from '@/components/Icons/ArrowCircleUp.vue'

const conversationStore = useConversationStore()

/**gắn cờ hiển thị nhiều nhãn */
const is_expand_label = ref(false)
/**gắn cờ đang loading label */
const is_loading_label = ref(false)

/**chỉ lấy các nhãn được chọn */
function getActiveLabel() {
  /**chuyển đổi obj thành array */
  let list_label = map(
    getPageLabel(conversationStore.select_conversation?.fb_page_id)
  )

  return list_label?.filter(label_info => isActiveLabel(label_info._id))
}
/**thay đổi gắn nhãn của khách hàng này */
function toggleLabel(label_id: string) {
  is_loading_label.value = true

  toggle_label_conversation(
    {
      page_id: conversationStore.select_conversation?.fb_page_id as string,
      client_id: conversationStore.select_conversation?.fb_client_id as string,
      label_id,
    },
    (e, r) => {
      if (e) return toastError(e)

      is_loading_label.value = false
    }
  )
}
/**kiểm tra label có được chọn hay không */
function isActiveLabel(label_id?: string | number) {
  if (!label_id) return false

  return getCurrentLabel()?.includes(label_id as string)
}
/**chỉ lấy các nhãn không được chọn */
function getUnactiveLabel() {
  /**chuyển đổi obj thành array */
  let list_label = map(
    getPageLabel(conversationStore.select_conversation?.fb_page_id)
  )

  return list_label?.filter(label_info => !isActiveLabel(label_info._id))
}
/**lấy danh sách id nhãn của khách hàng hiện tại */
function getCurrentLabel() {
  return getLabelValid(
    conversationStore.select_conversation?.fb_page_id,
    conversationStore.select_conversation?.label_id
  )
}

// xuất hàm cho component con sử dụng
provide(IS_ACTIVE_LABEL_FUNCT, isActiveLabel)
</script>
