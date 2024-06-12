<template>
    <div class="w-full h-full relative">
        <video class="w-full h-full" controls preload="metadata">
            <source :src="url" type="video/mp4">
        </video>
    </div>
</template>
<script setup lang="ts">
const $props = withDefaults(defineProps<{
    /**đường link ảnh */
    url?: string
}>(), {})
</script>