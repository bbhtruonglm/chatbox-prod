<template>
    <div :class="animate_pulse" :style="`width:${size}px;height:${size}px;`" class="overflow-hidden bg-slate-200">
        <img @load="removeAnimatePulse" loading="lazy" v-if="page_type === 'FB_MESS'" :src="loadImageUrl()"
            class="w-full h-full" />

        <img @load="removeAnimatePulse" loading="lazy" v-if="page_type === 'FB_INSTAGRAM'" :src="loadImageUrl(page_info?.page_id)"
            class="w-full h-full" />

        <img @load="removeAnimatePulse" loading="lazy" v-else-if="page_type === 'WEBSITE'"
            :src="page_avatar || websiteSvg" class="w-full h-full" />

        <img @load="removeAnimatePulse" loading="lazy" v-else-if="page_type === 'FB_WHATSAPP'"
            src="@/assets/icons/whatsapp.svg" class="w-full h-full" />

        <img @load="removeAnimatePulse" loading="lazy" v-else-if="page_type === 'ZALO'" src="@/assets/icons/zalo.svg"
            class="w-full h-full" />
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

import websiteSvg from '@/assets/icons/website.svg'

import type { PageInfo, PageType } from '@/service/interface/app/page'

const $props = withDefaults(defineProps<{
    page_id?: string
    page_type?: PageType
    page_avatar?: string
    size?: string
    page_info?: PageInfo
}>(), {
    size: '40'
})

/**thêm hiệu ứng ẩn hiện khi ảnh đang được load */
const animate_pulse = ref('animate-pulse')

/**tắt hiệu ứng ẩn hiện khi ảnh load thành công */
function removeAnimatePulse() {
    animate_pulse.value = ''
}
/**tạo url ảnh */
function loadImageUrl(page_id?: string) {
    return `${$env.img_host}/${page_id || $props.page_id}?width=${$props.size}&height=${$props.size}`
}
</script>