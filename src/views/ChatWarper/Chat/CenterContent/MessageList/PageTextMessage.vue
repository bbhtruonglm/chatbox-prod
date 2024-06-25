<template>
  <div class="message-box z-1 break-words whitespace-pre-line bg-white">
    {{ text }}
  </div>
</template>
<script setup lang="ts">
const $props = withDefaults(
  defineProps<{
    /**nội dung tin nhắn của page */
    text: string
  }>(),
  {}
)
</script>
