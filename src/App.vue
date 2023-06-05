<template>
  <div class="w-screen h-screen bg-white select-none xl:select-auto">
    <Loading v-if="commonStore.is_loading_full_screen" type="FULL" />
    <div class="h-full overflow-hidden overflow-y-auto">
      <router-view />
    </div>
  </div>
</template>

<script setup lang="ts">
import Loading from '@/components/Loading.vue'
import { useCommonStore } from '@/stores'

const commonStore = useCommonStore()
</script>

<style lang="scss">
@import "@/assets/css/index.scss";
</style>