<template>
    <div class="relative w-[50px] h-[35px]">
        <img src="@/assets/icons/user-list.svg" width="35" height="35" class="bg-slate-200 rounded-full">
        <span class="absolute left-[20px] bottom-0 text-xs text-blue-400 bg-white px-1 rounded-full">2s</span>
    </div>
</template>
<script setup lang="ts">
withDefaults(defineProps<{
    source: {}
}>(), {})
</script>