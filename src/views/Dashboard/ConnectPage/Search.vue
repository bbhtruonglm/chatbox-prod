<template>
  <div class="relative">
    <SearchBoldIcon
      class="w-3.5 h-3.5 text-slate-500 absolute top-1/2 -translate-y-1/2 left-2"
    />
    <input
      type="text"
      :placeholder="$t('v1.view.main.dashboard.select_platform.search_page')"
      class="w-52 text-xs font-normal bg-slate-100 rounded py-1 px-2 pl-7 focus:outline-orange-500 placeholder-slate-500"
    />
  </div>
</template>
<script setup lang="ts">
import SearchBoldIcon from '@/components/Icons/SearchBold.vue'
</script>
