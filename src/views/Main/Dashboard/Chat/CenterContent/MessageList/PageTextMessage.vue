<template>
    <div class="flex justify-end relative z-1">
        <div class="w-[-webkit-fill-available] text-sm break-words whitespace-pre-line text-white bg-slate-500 rounded-l-2xl rounded-r-md p-2">
            {{ text }}
        </div>
    </div>
</template>
<script setup lang="ts">
const $props = withDefaults(defineProps<{
    /**nội dung tin nhắn của page */
    text: string
}>(), {})
</script>