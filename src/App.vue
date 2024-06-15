<template>
  <!-- 
    class "container-fluid" để intergrate với ext, không phải là bootstrap
    không được xoá
  -->
  <div class="w-screen h-screen container-fluid bg-gradient-primary">
    <Network />
    <AdBlocker />
    <Loading
      v-if="commonStore.is_loading_full_screen"
      type="FULL"
    />
    <div class="h-full overflow-y-auto p-3">
      <router-view />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCommonStore } from '@/stores'

import Loading from '@/components/Loading.vue'
import Network from './components/Network.vue'
import AdBlocker from './components/AdBlocker.vue'

const commonStore = useCommonStore()
</script>

<style lang="scss">
@import '@/assets/css/index.scss';

// màu nền gradient từ hồng -> xanh biển
.bg-gradient-primary {
  background: linear-gradient(
    90deg,
    rgb(238, 237, 243) 0%,
    0.77381%,
    rgb(239, 238, 244) 1.54762%,
    6.72619%,
    rgb(239, 236, 243) 11.9048%,
    12.381%,
    rgb(240, 237, 244) 12.8571%,
    27.9167%,
    rgb(242, 236, 244) 42.9762%,
    51.9048%,
    rgb(239, 236, 243) 60.8333%,
    61.9643%,
    rgb(238, 235, 246) 63.0952%,
    66.7262%,
    rgb(235, 234, 249) 70.3571%,
    73.2738%,
    rgb(232, 232, 248) 76.1905%,
    77.1429%,
    rgb(230, 231, 248) 78.0952%,
    79.9405%,
    rgb(228, 229, 249) 81.7857%,
    84.1667%,
    rgb(227, 228, 248) 86.5476%,
    87.0238%,
    rgb(226, 227, 248) 87.5%,
    89.3452%,
    rgb(224, 224, 252) 91.1905%,
    95.5952%,
    rgb(220, 223, 252) 100%
  );
}

</style>
