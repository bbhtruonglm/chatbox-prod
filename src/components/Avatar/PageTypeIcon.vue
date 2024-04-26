<template>
    <img loading="lazy" v-if="page_type === 'FB_MESS'" src="@/assets/icons/facebook.svg" :width="size" />

    <img loading="lazy" v-if="page_type === 'FB_INSTAGRAM'" src="@/assets/icons/instagram-color.svg" :width="size" />

    <img loading="lazy" v-else-if="page_type === 'WEBSITE'" src="@/assets/icons/website.svg" :width="size" />

    <img loading="lazy" v-else-if="page_type === 'FB_WHATSAPP'" src="@/assets/icons/whatsapp.svg" :width="size" />

    <img loading="lazy" v-else-if="page_type === 'ZALO_OA'" src="@/assets/icons/zalo.svg" :width="size" />

    <div v-else />
</template>

<script setup lang="ts">
import type { PageType } from '@/service/interface/app/page'

withDefaults(defineProps<{
    page_type?: PageType
    size?: string
}>(), {
    size: '15'
})
</script>