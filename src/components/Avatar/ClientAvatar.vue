<template>
    <div :class="animate_pulse" :style="`width:${size}px;height:${size}px;`" class="overflow-hidden bg-slate-200">

        <div :style="{ 'background': letterToColorCode(client_name) }"
            class="w-full h-full flex justify-center items-center font-semibold text-white"
            v-if="client_name && platform_type === 'WEBSITE'">
            {{ nameToLetter(client_name) }}
        </div>

        <img @error="onImageError" @load="removeAnimatePulse" :loading="loading" v-if="platform_type === 'FB_MESS'"
            :src="loadImageUrl()" class="w-full h-full" />

        <img @error="onImageError" @load="removeAnimatePulse" :loading="loading" v-if="platform_type === 'FB_INSTAGRAM'"
            :src="loadImageUrl()" class="w-full h-full" />

        <img @error="onImageError" @load="removeAnimatePulse" :loading="loading" v-if="platform_type === 'ZALO_OA'"
            :src="client_avatar" class="w-full h-full" />
    </div>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { nameToLetter } from '@/service/helper/format'

import type { PageType } from '@/service/interface/app/page'

const $props = withDefaults(defineProps<{
    client_id?: string
    page_id?: string
    staff_id?: string
    platform_type?: PageType
    size?: string
    loading?: 'lazy' | 'eager'
    /**tên khách hàng */
    client_name?: string
    /**link ảnh */
    client_avatar?: string
}>(), {
    size: '40',
    loading: 'lazy'
})

/**thêm hiệu ứng ẩn hiện khi ảnh đang được load */
const animate_pulse = ref('animate-pulse')

onMounted(() => {
    // tắt hiệu ứng với dạng web
    if ($props.platform_type === 'WEBSITE') removeAnimatePulse()
})

/**tạo bg dựa trên chữ cái */
function letterToColorCode(character: string) {
    // lấy chữ cái đầu tiên và Chuyển ký tự thành chữ thường
    const INPUT = character.charAt(0).toLowerCase()

    // Chuyển đổi ký tự thành mã màu, Lấy mã Unicode và trừ đi mã 'a' (97)
    let charCode = INPUT.charCodeAt(0) - 97

    // Chuyển đổi số nguyên thành giá trị RGB
    var red = (charCode * 30) % 256;
    var green = (charCode * 20) % 256;
    var blue = (charCode * 10) % 256;

    return 'rgb(' + red + ', ' + green + ', ' + blue + ')';
}
/**tắt hiệu ứng ẩn hiện khi ảnh load thành công */
function removeAnimatePulse() {
    animate_pulse.value = ''
}
/**tạo url ảnh */
function loadImageUrl() {


    return `${$env.img_host}/${$props.client_id}?page_id=${$props.page_id}&staff_id=${$props.staff_id}&width=${$props.size}&height=${$props.size}&type=${$props.platform_type}`
}
/**khi ảnh load thất bại thì thay thế ảnh mặc định vào */
function onImageError($event: Event) {
    const image = $event.target as HTMLImageElement

    image.src = `${$env.img_host}/1111111111?width=${$props.size}&height=${$props.size}`
}
</script>