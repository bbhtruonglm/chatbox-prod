<template>
  <EmptyPage
    :icon="ZaloIcon"
    :guild="$t('v1.view.main.dashboard.select_platform.zalo_oa.guild')"
    :description="
      $t('v1.view.main.dashboard.select_platform.zalo_oa.description')
    "
    :title="$t('v1.view.main.dashboard.select_platform.zalo_oa.title')"
  >
    <template #after-description>
      <span class="cursor-pointer relative">
        <span class="text-sm font-medium decoration underline">
          {{ $t('v1.view.main.dashboard.select_platform.zalo_oa.lean_more') }}
        </span>
        <NewTabIcon class="w-4 h-4 text-gray-500 absolute top-0 -right-5" />
      </span>
    </template>
  </EmptyPage>
</template>
<script setup lang="ts">
import EmptyPage from '@/views/Dashboard/ConnectPage/EmptyPage.vue'

import ZaloIcon from '@/components/Icons/Zalo.vue'
import NewTabIcon from '@/components/Icons/NewTab.vue'
</script>
