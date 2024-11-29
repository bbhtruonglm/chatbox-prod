<template>
  <Alert
    ref="alert_over_quota_ref"
    class_modal="w-[507px]"
    class_body="text-zinc-500"
    class_footer="flex justify-between items-center mt-6"
  >
    <template #header>
      {{ $t('v1.view.main.dashboard.org_page.over_quota.title') }}
    </template>
    <template #body>
      {{ $t('v1.view.main.dashboard.chat.error.org_quota_staff') }}
    </template>
    <template #footer>
      <button
        @click="goDashboard"
        class="btn-custom bg-slate-100 text-slate-500"
      >
        {{ $t('v1.common.close') }}
      </button>
      <button
        @click="goDashboard"
        class="btn-custom bg-red-100 text-red-500"
      >
        {{ $t('v1.common.ok') }}
      </button>
    </template>
  </Alert>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import Alert from '@/components/Alert.vue'

const $emit = defineEmits(['done'])

const $router = useRouter()

/**modal xác nhận huỷ trang */
const alert_over_quota_ref = ref<InstanceType<typeof Alert>>()

/**quay về trang dashboard */
function goDashboard() {
  $router.push('/dashboard')
}
/**ẩn hiện modal của component */
function toggleModal() {
  alert_over_quota_ref.value?.toggleModal()
}

defineExpose({ toggleModal })
</script>
<style scoped lang="scss">
.btn-custom {
  @apply text-sm font-medium rounded-md py-2 px-4 flex items-center gap-2 hover:brightness-90;
}
</style>
