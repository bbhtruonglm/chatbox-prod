<template>
    <img v-if="page_type === 'FB_MESS'" :src="`https://graph.facebook.com/${page_id}/picture?width=${size}&height=${size}`" :width="size" />

    <img v-else-if="page_type === 'WEBSITE'" :src="page_avatar || websiteSvg" :width="size" />

    <img v-else-if="page_type === 'FB_WHATSAPP'" src="@/assets/icons/whatsapp.svg" :width="size" />

    <img v-else-if="page_type === 'ZALO'" src="@/assets/icons/zalo.svg" :width="size" />

    <div v-else />
</template>

<script setup lang="ts">
import websiteSvg from '@/assets/icons/website.svg'

import type { PageType } from '@/service/interface/app/page'

withDefaults(defineProps<{
    page_id?: string
    page_type?: PageType
    page_avatar?: string
    size?: string
}>(), {
    size: '40'
})
</script>