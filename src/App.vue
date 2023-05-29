<template>
  <div class="w-screen h-screen bg-white">
    <Loading v-if="appStore.is_loading_full_screen" type="FULL" />
    <div class="h-full overflow-hidden overflow-y-auto">
      <router-view />
    </div>
  </div>
</template>

<script setup lang="ts">
import Loading from '@/components/Loading.vue'
import { useAppStore } from '@/stores'

const appStore = useAppStore()
</script>

<style lang="scss">
@import "@/assets/css/index.scss";
</style>