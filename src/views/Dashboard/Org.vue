<template>
  <DashboardLayout class_content="flex flex-col gap-3 relative overflow-y-auto">
    <template #menu><Menu /></template>
    <template #content>
      <div class="flex gap-3">
        <SelectOrg />
        <ReChargeBtn v-if="$route.path.includes('/dashboard/org/pay/info')" />
      </div>
      <RouterView />
    </template>
  </DashboardLayout>
</template>

<script setup lang="ts">
import DashboardLayout from '@/components/Main/Dashboard/DashboardLayout.vue'
import Menu from '@/views/Dashboard/Org/Menu.vue'
import SelectOrg from '@/views/Dashboard/Org/SelectOrg.vue'
import ReChargeBtn from '@/views/Dashboard/Org/ReChargeBtn.vue'
</script>
