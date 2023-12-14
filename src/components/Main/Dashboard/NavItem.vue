<template>
    <div v-tooltip.right="title" :tooltip-disabled="is_disable_tooltip" :class="{
        'bg-orange-100': is_active,
        'md:justify-center': is_only_show_icon
    }" class="flex cursor-pointer items-center rounded-md hover:bg-orange-100 mb-1">
        <div class="w-[40px] h-[40px] flex items-center justify-center">
            <img :class="icon_class" :src="icon">
        </div>
        <div :class="is_only_show_icon ? 'md:hidden' : 'md:block'" class="ml-2">
            {{ title }}
        </div>
    </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
    /** url của icon */
    icon: string
    /** custom class cho icon */
    icon_class?: string
    /** tiêu đề */
    title: string
    /** đang chọn ? */
    is_active?: boolean
    /** chế độ thu nhỏ */
    is_only_show_icon?: boolean
    /**có huỷ bỏ tooltip không */
    is_disable_tooltip?: boolean
}>(), {})
</script>