<template>
    <div class="w-full h-full relative">
        <video :src="url" class="w-full h-full" />
        <img src="@/assets/icons/play.svg" class="w-[25px] h-[25px] absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]" />
    </div>
</template>
<script setup lang="ts">
const $props = withDefaults(defineProps<{
    /**đường link ảnh */
    url?: string
}>(), {})
</script>