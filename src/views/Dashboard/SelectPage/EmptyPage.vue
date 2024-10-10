<template>
  <div class="flex flex-col items-center gap-3 py-5">
    <div class="flex flex-col items-center">
      <img
        src="@/assets/imgs/empty-page.png"
        class="w-56 h-auto"
      />
      <div class="text-2xl font-semibold">
        {{ $t('v1.view.main.dashboard.select_page.empty_page.title') }}
      </div>
      <div class="text-slate-700 text-base">
        {{ $t('v1.view.main.dashboard.select_page.empty_page.description') }}
      </div>
    </div>
    <button
      @click="toggleModalConnectPage?.(tab)"
      class="text-white bg-blue-600 rounded-md py-2 px-4 gap-2 flex items-center hover:brightness-90"
    >
      <PlusCircleIcon class="w-4 h-4" />
      <div class="text-sm font-medium">
        {{ $t('v1.view.main.dashboard.nav.select_platform') }}
      </div>
    </button>
  </div>
</template>
<script setup lang="ts">
import { KEY_TOGGLE_MODAL_CONNECT_PAGE_FUNCT } from '@/views/Dashboard/symbol'
import { inject } from 'vue'

import PlusCircleIcon from '@/components/Icons/PlusCircle.vue'

const $props = withDefaults(
  defineProps<{
    /**tab được chọn khi mở modal kết nối page */
    tab?: string
  }>(),
  {}
)

/**hàm toggle modal kết nối nền tảng */
const toggleModalConnectPage = inject(KEY_TOGGLE_MODAL_CONNECT_PAGE_FUNCT)
</script>
