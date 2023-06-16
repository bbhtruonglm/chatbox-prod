<template>
    <div class="cursor-pointer bg-white rounded-md flex py-3 border-b-2 hover:border-orange-500 md:bg-slate-100">
        <div class="w-[60px] flex justify-center items-center">
            <div class="relative">
                <img v-if="isActivePage(page_info)" src="@/assets/icons/crown.svg" width="15" height="15"
                    class="absolute top-[-10px] left-[50%] translate-x-[-50%]">
                <PageAvatar :page_avatar="page_info?.avatar" :page_type="page_info?.type" :page_id="page_info?.fb_page_id"
                    class="rounded-full" />
            </div>
        </div>
        <div class="w-[calc(100%_-_150px)]">
            <div class="text-base truncate">{{ page_info?.name }}</div>
            <div class="flex items-center">
                <PageTypeIcon :page_type="page_info?.type" />
                <div class="text-sm text-slate-500 ml-1 truncate">
                    {{ page_info?.fb_page_id }}
                </div>
            </div>
        </div>
        <div class="w-[90px]">
            <slot />
        </div>
    </div>
</template>
<script setup lang="ts">
import PageAvatar from '@/components/Avatar/PageAvatar.vue'
import PageTypeIcon from '@/components/Avatar/PageTypeIcon.vue'
import { isActivePage } from '@/service/helper/pricing'

import type { PageInfo } from '@/service/interface/app/page'

withDefaults(defineProps<{
    /**thông tin dữ liệu của 1 page */
    page_info?: PageInfo
}>(), {})
</script>