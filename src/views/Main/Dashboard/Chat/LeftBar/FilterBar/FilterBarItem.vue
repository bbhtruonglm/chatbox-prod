<template>
    <div v-tooltip:right.tooltip="title" :class="{ 'bg-orange-100': is_active }"
        class="w-[40px] h-[40px] hover:bg-orange-100 rounded-md flex items-center justify-center mb-1 cursor-pointer relative">
        <img :class="{ 'opacity-40': is_disable }" :src="icon" />
        <div @click.stop="$emit('cancel_filter')" v-if="is_active" class="absolute top-[-3px] right-[-3px]">
            <img class="w-[14px] h-[14px]" src="@/assets/icons/close-circle.svg" />
        </div>
    </div>
</template>
<script setup lang="ts">
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
}>(), {})
</script>