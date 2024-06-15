<template>
  <div
    class="dashboard-header bg-white rounded-lg py-3 px-6 flex justify-between"
  >
    <div class="flex gap-3 items-center">
      <img
        src="@/assets/icons/bbh-mini.svg"
        class="w-9 h-11"
      />
      <h2 class="text-2xl font-semibold">
        {{ $t('v1.common.title') }}
      </h2>
    </div>
    <div class="flex gap-7 items-center">
      <template v-if="isShowSelectPageButton()">
        <button
          @click="$router.push(`/dashboard/select-platform`)"
          class="btn-custom"
        >
          <PlusCircleIcon class="w-3 h-3" />
          {{ $t('v1.view.main.dashboard.nav.select_platform') }}
        </button>
        <button
          @click="selectPageStore.toggleGroupPageMode()"
          class="btn-custom"
        >
          <SquaresPlusIcon class="w-3 h-3" />
          {{ $t('v1.view.main.dashboard.select_page.group_page.title') }}
        </button>
      </template>
      <User />
    </div>
  </div>
</template>
<script setup lang="ts">
import { useSelectPageStore } from '@/stores'
import { useRoute } from 'vue-router'

import User from '@/views/Dashboard/Header/User.vue'

import PlusCircleIcon from '@/components/Icons/PlusCircle.vue'
import SquaresPlusIcon from '@/components/Icons/SquaresPlus.vue'

const selectPageStore = useSelectPageStore()
const $route = useRoute()

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
    @apply py-1.5 px-2 text-xs font-medium bg-slate-200 rounded flex items-center gap-1 hover:brightness-90 h-7;
  }
}
</style>
