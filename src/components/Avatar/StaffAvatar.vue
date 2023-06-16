<template>
    <img class="rounded-full" :src="`https://chatbox-static-v3.botbanhang.vn/private/facebook/avatar/${id}`" :width="size"
        :height="size" @error="onImageError">
</template>
<script setup lang="ts">
withDefaults(defineProps<{
    id?: string
    size?: string
}>(), {
    size: '40'
})

function onImageError($event: Event) {
    const image = $event.target as HTMLImageElement
    
    image.src = 'https://chatbox-static-v3.botbanhang.vn/private/facebook/avatar/1111111111'
}
</script>