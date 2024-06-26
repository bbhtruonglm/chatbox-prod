<template>
    <div class="message-box break-words whitespace-pre-line bg-yellow-100">
        {{ text }}
    </div>
</template>
<script setup lang="ts">

const $props = withDefaults(defineProps<{
    /**nội dung tin nhắn bí mật của page */
    text: string
}>(), {})
</script>