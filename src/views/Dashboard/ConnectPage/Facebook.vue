<template>
  <EmptyPage
    :icon="FacebookIcon"
    :guild="$t('v1.view.main.dashboard.select_platform.facebook.guild')"
    :description="
      $t('v1.view.main.dashboard.select_platform.facebook.description')
    "
    :title="$t('v1.view.main.dashboard.select_platform.facebook.title')"
  />
</template>
<script setup lang="ts">
import EmptyPage from '@/views/Dashboard/ConnectPage/EmptyPage.vue'

import FacebookIcon from '@/components/Icons/Facebook.vue'
</script>
