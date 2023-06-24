<template>
    <div :class="animate_pulse" :style="`width:${size}px;height:${size}px;`" class="overflow-hidden bg-slate-200">
        <img loading="lazy"
            :src="`https://chatbox-static-v3.botbanhang.vn/private/facebook/avatar/${id}`" 
            @error="onImageError" @load="removeAnimatePulse" class="w-full h-full">
    </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'

withDefaults(defineProps<{
    id?: string
    size?: string
}>(), {
    size: '40'
})

/**thêm hiệu ứng ẩn hiện khi ảnh đang được load */
const animate_pulse = ref('animate-pulse')

/**tắt hiệu ứng ẩn hiện khi ảnh load thành công */
function removeAnimatePulse() {
    animate_pulse.value = ''
}
/**khi ảnh load thất bại thì thay thế ảnh mặc định vào */
function onImageError($event: Event) {
    const image = $event.target as HTMLImageElement

    image.src = 'https://chatbox-static-v3.botbanhang.vn/private/facebook/avatar/1111111111'
}
</script>