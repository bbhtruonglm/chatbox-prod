<template>
  <div
    class="dashboard-header bg-white rounded-lg py-3 px-6 flex justify-between"
  >
    <button
      @click="$router.push('/dashboard/select-page')"
      class="flex gap-3 items-center"
    >
      <img
        :src="commonStore.partner?.logo?.full"
        class="h-8"
      />
    </button>
    <div class="flex gap-7 items-center">
      <slot name="right" />
      <User
        position="BOTTOM"
        :back="237"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import User from '@/components/User.vue'
import { useCommonStore } from '@/stores'

import { Domain } from '@/utils/helper/Domain'

const commonStore = useCommonStore()
</script>
