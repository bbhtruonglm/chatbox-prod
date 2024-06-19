<template>
  <EmptyPage
    :icon="WebIcon"
    :guild="$t('v1.view.main.dashboard.select_platform.website.guild')"
    :description="
      $t('v1.view.main.dashboard.select_platform.website.description')
    "
  >
    <template #button>
      <button
        class="flex justify-between items-center py-2 px-4 gap-2 bg-slate-100 rounded-md hover:brightness-90"
      >
        <WebIcon class="w-4 h-4" />
        <div class="text-slate-900 text-sm font-semibold">
          {{ $t('v1.view.main.dashboard.select_platform.website.title') }}
        </div>
      </button>
    </template>
  </EmptyPage>
</template>
<script setup lang="ts">
import EmptyPage from '@/views/Dashboard/ConnectPage/EmptyPage.vue'

import WebIcon from '@/components/Icons/Web.vue'
</script>
