<template>
  <EmptyPage
    :icon="WebIcon"
    :guild="$t('v1.view.main.dashboard.select_platform.website.guild')"
    :description="
      $t('v1.view.main.dashboard.select_platform.website.description')
    "
    :title="$t('v1.view.main.dashboard.select_platform.website.title')"
  />
</template>
<script setup lang="ts">
import EmptyPage from '@/views/Dashboard/ConnectPage/EmptyPage.vue'

import WebIcon from '@/components/Icons/Web.vue'
</script>
