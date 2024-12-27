<template>
  <div class="flex text-sm gap-3 items-center">
    <span>
      {{ $t('Bạn mới sử dụng _', { name: commonStore.partner?.name }) }}
    </span>
    <div
      @click="$router.push('/oauth/register')"
      class="text-sm font-semibold flex items-center gap-1 text-blue-700 cursor-pointer"
    >
      {{ $t('Bắt đầu ngay') }}
      <ArrowRightIcon class="w-4 h-4 lucide lucide-arrow-right" />
    </div>
  </div>
</template>
<script setup lang="ts">
import { useCommonStore } from '@/stores'

import { ArrowRightIcon } from '@heroicons/vue/24/solid'

const commonStore = useCommonStore()
</script>
