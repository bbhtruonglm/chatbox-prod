<template>
  <div
    class="dashboard-header bg-white rounded-lg py-3 px-6 flex justify-between"
  >
    <button
      @click="$router.push('/dashboard/select-page')"
      class="flex gap-3 items-center"
    >
      <img
        v-if="Domain.isRetion()"
        src="@/assets/imgs/retion-full.svg"
        class="h-6"
      />
      <img
        v-else
        src="@/assets/imgs/bot-full.svg"
      />
    </button>
    <div class="flex gap-7 items-center">
      <template v-if="isShowSelectPageButton()">
        <button
          @click="toggleModalConnectPage?.('PAGE')"
          class="btn-custom h-7 text-xs font-medium py-1.5 px-2 bg-slate-200"
        >
          <PlusCircleIcon class="w-3 h-3" />
          {{ $t('v1.view.main.dashboard.nav.select_platform') }}
        </button>
        <button
          v-if="size(pageStore.active_page_list)"
          @click="selectPageStore.toggleGroupPageMode()"
          class="btn-custom h-7 text-xs font-medium py-1.5 px-2 bg-slate-200"
        >
          <SquaresPlusIcon class="w-3 h-3" />
          {{ $t('v1.view.main.dashboard.select_page.group_page.title') }}
        </button>
      </template>
      <ReChargeBtn v-if="$route.path.includes('/dashboard/org/')" />
      <User
        position="BOTTOM"
        :back="289"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import { usePageStore, useSelectPageStore } from '@/stores'
import { useRoute } from 'vue-router'
import { KEY_TOGGLE_MODAL_CONNECT_PAGE_FUNCT } from '@/views/Dashboard/symbol'
import { inject } from 'vue'

import User from '@/components/User.vue'
import ReChargeBtn from '@/views/Dashboard/Org/ReChargeBtn.vue'

import PlusCircleIcon from '@/components/Icons/PlusCircle.vue'
import SquaresPlusIcon from '@/components/Icons/SquaresPlus.vue'
import { Domain } from '@/utils/helper/Domain'
import { size } from 'lodash'

const selectPageStore = useSelectPageStore()
const pageStore = usePageStore()
const $route = useRoute()

/**hàm toggle modal kết nối nền tảng */
const toggleModalConnectPage = inject(KEY_TOGGLE_MODAL_CONNECT_PAGE_FUNCT)

/**có hiển thị các nút của trang chọn page không */
function isShowSelectPageButton() {
  return (
    // đang ở trang chọn page
    $route.path.includes('select-page') &&
    (
      // không ở chế độ chat nhiều page
      !selectPageStore.is_group_page_mode || 
      // người dùng chưa có trang nào
      !size(pageStore.active_page_list)
    )
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
