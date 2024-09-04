<template>
  <template
    v-if="orgStore.selected_org_info?.org_info?.org_name && !is_only_domain"
  >
    {{ orgStore.selected_org_info?.org_info?.org_name }}
  </template>
  <template v-else-if="isRetion()">
    {{ $t('v1.common.retion') }}
  </template>
  <template v-else>
    {{ $t('v1.common.title') }}
  </template>
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
