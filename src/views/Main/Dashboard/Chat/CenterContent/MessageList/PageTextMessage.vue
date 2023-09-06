<template>
    <div class="text-sm break-words whitespace-pre-line text-white bg-slate-500 rounded-l-2xl rounded-r-md p-2">
        {{ text }}
    </div>
</template>
<script setup lang="ts">
const $props = withDefaults(defineProps<{
    /**nội dung tin nhắn của page */
    text: string
}>(), {})
</script>