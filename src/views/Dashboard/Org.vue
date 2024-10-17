<template>
  <div
    v-if="orgStore.is_loading"
    class="absolute top-9 left-1/2 -translate-x-1/2 z-50"
  >
    <Loading />
  </div>
  <DashboardLayout class_content="flex flex-col gap-3 relative overflow-y-auto">
    <template #menu><Menu /></template>
    <template #content>
      <div class="flex gap-3">
        <SelectOrg />
        <ReChargeBtn v-if="$route.path.includes('/dashboard/org/pay')" />
      </div>
      <RouterView v-if="orgStore.isAdminOrg()" />
      <div
        v-else
        class="text-sm text-slate-500"
      >
        {{ $t('v1.view.main.dashboard.org.permision_denied') }}
      </div>
    </template>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { useOrgStore } from '@/stores'

import DashboardLayout from '@/components/Main/Dashboard/DashboardLayout.vue'
import Menu from '@/views/Dashboard/Org/Menu.vue'
import SelectOrg from '@/components/Main/Dashboard/SelectOrg.vue'
import ReChargeBtn from '@/views/Dashboard/Org/ReChargeBtn.vue'
import Loading from '@/components/Loading.vue'
import { onBeforeMount, onMounted } from 'vue'

const orgStore = useOrgStore()

onMounted(() => {
  try {
    // @ts-ignore
    BBH?.init({
      // kích hoạt id trang chat
      page_id: 'bf425487afbe403895116dd9b585537b',
      // thiết lập hiển thị - chưa có logic
      config: {},
      // cho phép gỡ lỗi
      is_debug: true,
    })
  } catch (e) {
    console.log('không load được bbh sdk:', e)
  }
})

// function
</script>
