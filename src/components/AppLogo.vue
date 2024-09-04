<template>
  <img
    v-if="orgStore.selected_org_info?.org_info?.org_avatar && !is_only_domain"
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

const $props = withDefaults(
  defineProps<{
    /**chỉ hiện theo domain, bỏ qua tổ chức */
    is_only_domain?: boolean
  }>(),
  {}
)

const orgStore = useOrgStore()

/**có phải ở retion.ai không */
function isRetion() {
  return location.hostname?.includes('retion.ai')
}
</script>
