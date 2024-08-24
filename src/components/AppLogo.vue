<template>
  <img
    v-if="orgStore.selected_org_info?.org_info?.org_avatar"
    :src="orgStore.selected_org_info?.org_info?.org_avatar"
  />
  <img
    v-else-if="isRetion()"
    src="@/assets/imgs/retion.svg"
  />
  <img
    v-else
    src="@/assets/icons/bbh-mini.svg"
  />
</template>
<script setup lang="ts">
import { useOrgStore } from '@/stores'

const orgStore = useOrgStore()

/**có phải ở retion.ai không */
function isRetion() {
  return location.hostname?.includes('retion.ai')
}
</script>
