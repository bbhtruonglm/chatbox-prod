<template>
    <div 
        :id="`staff-read-item-${id}`"
        :class="animate_pulse"
        class="overflow-hidden bg-slate-200"
    >
        <img 
            loading="lazy"
            :src="loadImageUrl()" 
            @error="onImageError" @load="removeAnimatePulse" class="w-full h-full"
        >
    </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'

const $props = withDefaults(defineProps<{
    id?: string
}>(), {})

/**kích thước thực tế */
const SIZE = 64
/**thêm hiệu ứng ẩn hiện khi ảnh đang được load */
const animate_pulse = ref('animate-pulse')

/**tắt hiệu ứng ẩn hiện khi ảnh load thành công */
function removeAnimatePulse() {
    animate_pulse.value = ''
}
/**khi ảnh load thất bại thì thay thế ảnh mặc định vào */
function onImageError($event: Event) {
    const image = $event.target as HTMLImageElement

    image.src = `${$env.img_host}/1111111111?width=${SIZE}&height=${SIZE}`
}
/**tạo url ảnh */
function loadImageUrl() {
    // return `https://chatbox-static.botbanhang.vn/v1/app/avatar/${$props.id}.jpeg`
    
    return `${$env.img_host}/${$props.id}?width=${SIZE}&height=${SIZE}`
}
</script>