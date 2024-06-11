<template>
  <!-- 
    class "container-fluid" để intergrate với ext, không phải là bootstrap
    không được xoá
  -->
  <div
    class="w-screen h-screen bg-white select-none md:select-auto container-fluid"
  >
    <Network />
    <AdBlocker />
    <Loading v-if="commonStore.is_loading_full_screen" type="FULL" />
    <div class="h-full overflow-hidden scrollbar-vertical overflow-y-auto">
      <router-view />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCommonStore } from "@/stores";

import Loading from "@/components/Loading.vue";
import Network from "./components/Network.vue";
import AdBlocker from "./components/AdBlocker.vue";

const commonStore = useCommonStore();
</script>

<style lang="scss">
@import "@/assets/css/index.scss";
</style>
