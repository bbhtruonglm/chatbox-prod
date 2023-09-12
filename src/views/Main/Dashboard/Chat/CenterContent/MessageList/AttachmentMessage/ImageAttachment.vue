<template>
    <img v-if="url" :src="url" class="w-full h-full cursor-pointer hover:opacity-50" />
</template>
<script setup lang="ts">
const $props = withDefaults(defineProps<{
    /**đường link ảnh */
    url?: string
}>(), {})
</script>