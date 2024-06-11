<template>
    <audio class="w-full h-full" controls preload="metadata">
        <source :src="url" type="audio/mpeg">
    </audio>
</template>
<script setup lang="ts">
const $props = withDefaults(defineProps<{
    /**đường link ảnh */
    url?: string
}>(), {})
</script>