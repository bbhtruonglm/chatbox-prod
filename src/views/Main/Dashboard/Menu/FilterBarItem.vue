<template>
    <div class="relative">
        <NavItem :is_disable_tooltip="is_disable_tooltip" :class="{ 'opacity-40': is_disable }" :is_active="is_active"
            icon_class="w-[20px]" :is_only_show_icon="commonStore.this_toggle_nav" :icon="icon" :title="title" />
        <div @click.stop="$emit('cancel_filter')" v-if="is_active" class="absolute top-[-3px] right-[-1px] cursor-pointer">
            <img class="w-[14px] h-[14px]" src="@/assets/icons/close-circle.svg" />
        </div>
    </div>
</template>
<script setup lang="ts">
import { useCommonStore } from '@/stores'

import NavItem from '@/components/Main/Dashboard/NavItem.vue'

const $emit = defineEmits(['cancel_filter'])

withDefaults(defineProps<{
    /**icon của item */
    icon: string
    /**tiêu đề của item */
    title: string
    /**item này có đang được kích hoạt hay không */
    is_active?: boolean
    /**chặn việc sử dụng */
    is_disable?: boolean
    /**có huỷ bỏ tooltip không */
    is_disable_tooltip?: boolean
}>(), {})

const commonStore = useCommonStore()
</script>