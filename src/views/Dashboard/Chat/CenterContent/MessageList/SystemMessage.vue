<template>
    <div class="break-words whitespace-pre-line text-[10px] text-slate-500 my-1">
        {{ text }}
    </div>
</template>
<script setup lang="ts">
const $props = withDefaults(defineProps<{
    /**nội dung tin nhắn bí mật của page */
    text: string
}>(), {})
</script>