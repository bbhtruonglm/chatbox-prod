<template>
  <div class="w-screen h-screen bg-white select-none xl:select-auto">
    <Network />
    <AdBlocker />
    <Loading v-if="commonStore.is_loading_full_screen" type="FULL" />
    <div class="h-full overflow-hidden overflow-y-auto">
      <router-view />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCommonStore } from '@/stores'

import Loading from '@/components/Loading.vue'
import Network from './components/Network.vue'
import AdBlocker from './components/AdBlocker.vue'
import { onMounted } from 'vue';

const commonStore = useCommonStore()

onMounted(() => preventMobileViewScrollWhenOpenVitualKeyBoard())

/**ngăn chặn hành động scroll khi mở bản phím ảo trên dt */
function preventMobileViewScrollWhenOpenVitualKeyBoard() {
  document.addEventListener('touchstart', (event: any) => {
    // nếu người dùng chạm vào một phần tử không có khả năng mở bàn phím ảo
    if (
      event.target.tagName !== 'INPUT' &&
      event.target.tagName !== 'TEXTAREA' &&
      !event.target.hasAttribute('contenteditable')
    ) {
      // tìm kiếm toàn bộ các phần tử có khả năng mở bàn phím ảo
      const INPUT_LIST = document.querySelectorAll('input')
      const TEXTAREA_LIST = document.querySelectorAll('textarea')
      const EDIT_LIST = document.querySelectorAll('[contenteditable]')

      // Làm mất focus cho tất cả các phần tử
      INPUT_LIST.forEach(input => input.blur())
      TEXTAREA_LIST.forEach(input => input.blur())
      EDIT_LIST.forEach((input: any) => input?.blur())
    }
  })
}
</script>

<style lang="scss">
@import "@/assets/css/index.scss";
</style>