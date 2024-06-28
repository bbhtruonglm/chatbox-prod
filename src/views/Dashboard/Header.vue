<template>
  <div
    class="dashboard-header bg-white rounded-lg py-3 px-6 flex justify-between"
  >
    <button
      @click="$router.push('/dashboard/select-page')"
      class="flex gap-3 items-center"
    >
      <img
        src="@/assets/icons/bbh-mini.svg"
        class="w-9 h-11"
      />
      <h2 class="text-2xl font-semibold">
        {{ $t('v1.common.title') }}
      </h2>
    </button>
    <div class="flex gap-7 items-center">
      <template v-if="isShowSelectPageButton()">
        <button
          @click="toggleModalConnectPage?.()"
          class="btn-custom h-7 text-xs font-medium py-1.5 px-2 bg-slate-200"
        >
          <PlusCircleIcon class="w-3 h-3" />
          {{ $t('v1.view.main.dashboard.nav.select_platform') }}
        </button>
        <button
          @click="selectPageStore.toggleGroupPageMode()"
          class="btn-custom h-7 text-xs font-medium py-1.5 px-2 bg-slate-200"
        >
          <SquaresPlusIcon class="w-3 h-3" />
          {{ $t('v1.view.main.dashboard.select_page.group_page.title') }}
        </button>
      </template>
      <button
        v-if="$route.path.includes('/dashboard/org/')"
        class="btn-custom text-sm font-semibold py-2 px-4 bg-blue-600 text-white"
      >
        <VndPlusIcon class="w-4 h-4" />
        {{ $t('v1.view.main.dashboard.org.recharge') }}
      </button>
      <User
        position="BOTTOM"
        :back="289"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import { useSelectPageStore } from '@/stores'
import { useRoute } from 'vue-router'
import { KEY_TOGGLE_MODAL_CONNECT_PAGE_FUNCT } from '@/views/Dashboard/symbol'
import { inject } from 'vue'

import User from '@/components/User.vue'

import PlusCircleIcon from '@/components/Icons/PlusCircle.vue'
import SquaresPlusIcon from '@/components/Icons/SquaresPlus.vue'
import VndPlusIcon from '@/components/Icons/VndPlus.vue'

const selectPageStore = useSelectPageStore()
const $route = useRoute()

/**hàm toggle modal kết nối nền tảng */
const toggleModalConnectPage = inject(KEY_TOGGLE_MODAL_CONNECT_PAGE_FUNCT)

/**có hiển thị các nút của trang chọn page không */
function isShowSelectPageButton() {
  return (
    // chỉ hiển thị khi đang ở trang chọn page
    $route.path.includes('select-page') &&
    // chỉ hiển thị khi không ở chế độ chat nhiều page
    !selectPageStore.is_group_page_mode
  )
}
</script>
<style scoped lang="scss">
.dashboard-header {
  .btn-custom {
    @apply rounded flex items-center gap-1 hover:brightness-90;
  }
}
</style>
