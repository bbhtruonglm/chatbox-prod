<template>
    <img v-if="isMobile()" src="@/assets/icons/audio.svg" class="w-full h-full bg-white" />
    <audio v-else class="w-full h-full" controls preload="metadata">
        <source :src="url" type="audio/mpeg">
    </audio>
</template>
<script setup lang="ts">
import { isMobile } from '@/service/function'

const $props = withDefaults(defineProps<{
    /**đường link ảnh */
    url?: string
}>(), {})
</script>