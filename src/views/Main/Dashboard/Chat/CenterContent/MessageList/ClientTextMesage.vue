<template>
    <div class="text-sm break-words whitespace-pre-line bg-slate-200 rounded-lg p-2">
        {{ text }}
    </div>
</template>
<script setup lang="ts">

const $props = withDefaults(defineProps<{
    /**nội dung tin nhắn bí mật của page */
    text: string
}>(), {})
</script>