<template>
    <div class="my-4 px-5 break-words text-[10px] text-slate-400 text-center">
        {{ text }}
    </div>
</template>
<script setup lang="ts">
const $props = withDefaults(defineProps<{
    /**nội dung tin nhắn bí mật của page */
    text: string
}>(), {})
</script>