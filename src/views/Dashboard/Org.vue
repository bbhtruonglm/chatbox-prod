<template>
  <DashboardLayout class_content="flex flex-col gap-3 relative overflow-y-auto">
    <template #menu><Menu /></template>
    <template #content>
      <RouterView />
    </template>
  </DashboardLayout>
</template>

<script setup lang="ts">
import DashboardLayout from '@/components/Main/Dashboard/DashboardLayout.vue'
import Menu from '@/views/Dashboard/Org/Menu.vue'
</script>
