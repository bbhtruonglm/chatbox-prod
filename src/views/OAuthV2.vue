<template>
  <section
    class="size-full bg-gradient-secondary flex items-center justify-center p-4 relative"
  >
    <div
      class="bg-white w-full max-w-[478px] shadow-xl rounded-xl flex flex-col gap-6 p-6 max-h-full overflow-y-scroll"
    >
      <div
        :style="{
          backgroundImage: `url(${commonStore.partner?.logo?.full})`,
        }"
        class="h-7 w-full bg-contain bg-no-repeat bg-left"
      />
      <RouterView />
      <div class="flex justify-between">
        <p class="flex items-center gap-3 text-xs text-slate-500">
          <button>
            {{ $t('Chính sách') }}
          </button>
          <button>
            {{ $t('Điều khoản') }}
          </button>
        </p>
        <Language />
      </div>
    </div>
  </section>
</template>
<script setup lang="ts">
import { useCommonStore } from '@/stores'

import Language from '@/components/Language.vue'

const commonStore = useCommonStore()
</script>
<style lang="scss" scoped>
.bg-gradient-secondary {
  background: linear-gradient(180deg, hsla(0, 0%, 100%, 0) 50%, #fff, #fff),
    linear-gradient(90deg, #fdefe3, #f3f4f3 50%, #dce5ff);
}
</style>
