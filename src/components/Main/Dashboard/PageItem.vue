<template>
  <ActorItem>
    <template #before-avatar>
      <Checkbox
        v-if="checkbox_is_visible"
        v-model="checkbox_model"
        class="flex-shrink-0"
        :disabled="checkbox_is_disabled"
      />
    </template>
    <template #avatar>
      <PageAvatar
        :page_info="page_info"
        class="w-8 h-8"
      />
    </template>
    <template #name>
      <div class="flex items-center gap-1">
        <ExclamationTriangleIcon
          v-if="page_info?.is_disconnected"
          @click.stop="$main.toggleModalConnectPage()"
          v-tooltip="$t('Trang mất quyền truy cập, cần cấp lại quyền')"
          class="size-4 text-red-500 flex-shrink-0 cursor-pointer"
        />
        <ConnectPage
          @done="$main.reloadPageData()"
          ref="connect_page_ref"
        />
        <div>
          {{ page_info?.name }}
        </div>
      </div>
    </template>
    <template #after-name>
      <slot name="after-name" />
    </template>
    <template #description>
      <PageTypeIcon
        :page_type="page_info?.type"
        class="flex-shrink-0 w-3.5 h-3.5"
      />
      <div class="text-xs text-slate-500 flex-grow truncate min-w-0">
        {{ page_info?.fb_page_id }}
      </div>
    </template>
  </ActorItem>
</template>
<script setup lang="ts">
import PageAvatar from '@/components/Avatar/PageAvatar.vue'
import PageTypeIcon from '@/components/Avatar/PageTypeIcon.vue'
import Checkbox from '@/components/Checkbox.vue'
import ActorItem from '@/components/Main/Dashboard/ActorItem.vue'
import ConnectPage from '@/views/Dashboard/ConnectPage.vue'
import { ExclamationTriangleIcon } from '@heroicons/vue/24/solid'

import type { IPage } from '@/service/interface/app/page'
import { useConnectPageStore } from '@/stores'
import { inject, ref } from 'vue'
import { KEY_RELOAD_PAGE_DATA } from '@/views/Dashboard/symbol'

const $props = withDefaults(
  defineProps<{
    /**dữ liệu của trang */
    page_info?: IPage
    /**có hiển thị checkbox không */
    checkbox_is_visible?: boolean
    /**trạng thái của checkbox */
    checkbox_is_disabled?: boolean
  }>(),
  {}
)

const connectPageStore = useConnectPageStore()

/**nạp lại dữ liệu trang */
const reloadPageData = inject(KEY_RELOAD_PAGE_DATA)

/**giá trị của checkbox */
const checkbox_model = defineModel('checkbox')

/**ref của modal kết nối nền tảng */
const connect_page_ref = ref<InstanceType<typeof ConnectPage>>()

class Main {
  reloadPageData() {
    reloadPageData?.()
  }
  /**ẩn hiện modal kết nối nền tảng */
  toggleModalConnectPage() {
    // ẩn bỏ các chi tiết thừa
    connectPageStore.is_hidden_menu = true

    // xử lý tùy theo nền tảng
    switch ($props.page_info?.type) {
      case 'ZALO_PERSONAL':
        connect_page_ref.value?.toggleModal?.('ZALO_PERSONAL')
        break
    }
  }
}
const $main = new Main()
</script>
