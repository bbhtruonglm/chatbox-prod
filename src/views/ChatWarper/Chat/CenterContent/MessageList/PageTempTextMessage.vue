<template>
    <div class="message-box break-words whitespace-pre-line bg-gray-100">
        {{ text }}
    </div>
</template>
<script setup lang="ts">
const $props = withDefaults(defineProps<{
    /**nội dung tin nhắn của page */
    text: string
}>(), {})
</script>