<template>
    <div :class="animate_pulse" :style="`width:${size}px;height:${size}px;`" class="overflow-hidden bg-slate-200">
        <img @load="removeAnimatePulse" loading="lazy" v-if="page_type === 'FB_MESS'"
            :src="`https://chatbox-static-v3.botbanhang.vn/private/facebook/avatar/${page_id}`" class="w-full h-full" />

        <img @load="removeAnimatePulse" loading="lazy" v-else-if="page_type === 'WEBSITE'"
            :src="page_avatar || websiteSvg" class="w-full h-full" />

        <img @load="removeAnimatePulse" loading="lazy" v-else-if="page_type === 'FB_WHATSAPP'"
            src="@/assets/icons/whatsapp.svg" class="w-full h-full" />

        <img @load="removeAnimatePulse" loading="lazy" v-else-if="page_type === 'ZALO'" src="@/assets/icons/zalo.svg" class="w-full h-full" />
    </div>
</template>

<script setup lang="ts">
import websiteSvg from '@/assets/icons/website.svg'

import type { PageType } from '@/service/interface/app/page'
import { ref } from 'vue'

withDefaults(defineProps<{
    page_id?: string
    page_type?: PageType
    page_avatar?: string
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
</script>