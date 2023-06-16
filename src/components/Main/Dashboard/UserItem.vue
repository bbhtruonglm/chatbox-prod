<template>
    <div :class="{
        'bg-orange-100': is_active,
        'md:justify-center': is_only_show_icon
    }" class="flex cursor-pointer items-center rounded-md hover:bg-orange-100">
        <div class="w-[40px] h-[40px] flex items-center justify-center p-1 relative">
            <img v-if="is_active_user" class="absolute top-[-4px] w-[17px]" src="@/assets/icons/crown.svg">
            <StaffAvatar :id="staff_id" />
        </div>
        <div :class="is_only_show_icon ? 'md:hidden' : 'md:block'" class="ml-2">
            {{ title }}
        </div>
    </div>
</template>

<script setup lang="ts">
import StaffAvatar from '@/components/Avatar/StaffAvatar.vue'

withDefaults(defineProps<{
    /**id của user */
    staff_id?: string
    /** tiêu đề */
    title?: string
    /** đang chọn ? */
    is_active?: boolean
    /** user đã được kích hoạt gói ? */
    is_active_user?: boolean
    /** chế độ thu nhỏ */
    is_only_show_icon?: boolean
}>(), {})
</script>