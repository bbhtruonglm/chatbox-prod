<template>
  <a
    :href="text"
    target="_blank"
    class="message-box bg-white break-words whitespace-pre-line text-blue-500 block underline"
  >
    {{ text }}
  </a>
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
