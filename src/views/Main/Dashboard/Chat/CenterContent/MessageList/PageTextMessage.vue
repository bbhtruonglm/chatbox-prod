<template>
    <div class="flex justify-end relative z-1">
        <div class="w-[-webkit-fill-available] text-sm break-words whitespace-pre-line text-black page-text-message-bg-custom rounded-l-2xl rounded-r-md py-2 px-3">
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
<style scoped lang="scss">
.page-text-message-bg-custom {
    background: #dde3e8
}
</style>