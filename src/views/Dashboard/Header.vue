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
      <button
        @click="$router.push(`/dashboard/select-platform`)"
        class="btn-custom"
      >
        <PlusCircleIcon />
        {{ $t('v1.view.main.dashboard.nav.select_platform') }}
      </button>
      <button class="btn-custom">
        <SquaresPlusIcon />
        {{ $t('v1.view.main.dashboard.select_page.group_page.title') }}
      </button>
      <User />
    </div>
  </div>
</template>
<script setup lang="ts">
import User from '@/views/Dashboard/Header/User.vue'

import PlusCircleIcon from '@/components/Icons/PlusCircle.vue'
import SquaresPlusIcon from '@/components/Icons/SquaresPlus.vue'
</script>
<style scoped lang="scss">
.dashboard-header {
  .btn-custom {
    @apply py-1 px-2 text-xs font-medium bg-slate-200 rounded flex items-center gap-1 hover:brightness-90;
  }
}
</style>
