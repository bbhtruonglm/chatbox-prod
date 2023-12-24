<template>
  <!-- 
    class "container-fluid" để intergrate với ext, không phải là bootstrap
    không được xoá
  -->
  <div
    class="w-screen h-screen bg-white select-none md:select-auto container-fluid"
  >
    <div
      v-if="isNewVersion"
      class="fixed top-0 left-0 w-full h-8 bg-black bg-opacity-50 z-50 flex justify-center items-center"
    >
      <div class="bg-white rounded-lg shadow-lg p-4">
        <div class="text-center">
          <div class="text-2xl font-bold">New version available</div>
        </div>
      </div>
    </div>
    <Network />
    <AdBlocker />
    <Loading v-if="commonStore.is_loading_full_screen" type="FULL" />
    <div class="h-full overflow-hidden scrollbar-vertical overflow-y-auto">
      <router-view />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useCommonStore } from "@/stores";

import Loading from "@/components/Loading.vue";
import Network from "./components/Network.vue";
import AdBlocker from "./components/AdBlocker.vue";

import { CapacitorUpdater } from "@capgo/capacitor-updater";

const commonStore = useCommonStore();

// Capacitor Update OTA
const isNewVersion = ref<boolean>(false);
CapacitorUpdater.notifyAppReady();
CapacitorUpdater.addListener("majorAvailable", (info: any) => {
  console.log(">>> Capgo majorAvailable", info);
  isNewVersion.value = true;
  setTimeout(() => {
    isNewVersion.value = false;
  }, 5000);
});
CapacitorUpdater.addListener("updateAvailable", (info: any) => {
  console.log(">>> Capgo updateAvailable", info);
  isNewVersion.value = true;
  setTimeout(() => {
    isNewVersion.value = false;
  }, 5000);
});
</script>

<style lang="scss">
@import "@/assets/css/index.scss";
</style>
