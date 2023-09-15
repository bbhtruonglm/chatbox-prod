<template>
    <img v-if="url" src="@/assets/icons/file.svg" class="w-full h-full bg-white" />
</template>
<script setup lang="ts">
const $props = withDefaults(defineProps<{
    /**đường link ảnh */
    url?: string
}>(), {})
</script>