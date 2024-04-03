<template>
    <img v-if="url" :src="url" class="w-full h-full bg-white object-contain" />
</template>
<script setup lang="ts">
const $props = withDefaults(defineProps<{
    /**đường link ảnh */
    url?: string
}>(), {})
</script>