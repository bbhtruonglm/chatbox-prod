<template>
  <img
    loading="lazy"
    v-if="page_type === 'FB_MESS'"
    src="@/assets/icons/facebook.svg"
  />

  <img
    loading="lazy"
    v-else-if="page_type === 'FB_INSTAGRAM'"
    src="@/assets/icons/instagram-color.svg"
  />

  <WebIcon v-else-if="page_type === 'WEBSITE'" />

  <img
    loading="lazy"
    v-else-if="page_type === 'FB_WHATSAPP'"
    src="@/assets/icons/whatsapp.svg"
  />

  <img
    loading="lazy"
    v-else-if="page_type === 'ZALO_OA'"
    src="@/assets/icons/zalo.svg"
  />

  <div v-else />
</template>

<script setup lang="ts">
import WebIcon from '@/components/Icons/Web.vue'

import type { PageType } from '@/service/interface/app/page'

withDefaults(
  defineProps<{
    page_type?: PageType
  }>(),
  {}
)
</script>
