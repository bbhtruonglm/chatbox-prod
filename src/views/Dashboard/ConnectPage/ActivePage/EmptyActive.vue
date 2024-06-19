<template>
  <div class="flex flex-col justify-center items-center gap-2.5 h-full">
    <div class="p-4 bg-gray-100 rounded-full">
      <LayerIcon class="w-7 h-7 text-slate-700" />
    </div>
    <div class="font-semibold">
      {{ $t('v1.view.main.dashboard.select_platform.empty_invite') }}
    </div>
    <div class="text-sm text-slate-700 text-center w-[405px]">
      {{ $t('v1.view.main.dashboard.select_platform.empty_invite_guild') }}
    </div>
  </div>
</template>
<script setup lang="ts">
import LayerIcon from '@/components/Icons/Layer.vue'
</script>
