<template>
    <div class="overflow-hidden overflow-x-auto px-4 mt-1">
        <div class="flex w-max">
            <div @click="selectTab(tab.key)"
                class="font-semibold px-4 py-1 cursor-pointer border-b-2 border-white text-slate-400 hover:border-orange-500 hover:font-semibold hover:text-black"
                :class="{ '!text-black !border-orange-500': modelValue === tab.key }"
                v-for="tab of  platform_list">{{ tab.title }}
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
const $emit = defineEmits(['update:modelValue'])

withDefaults(defineProps<{
    /**danh sách các nền tảng */
    platform_list: {
        /**tên nền tảng */
        title: string,
        /**key của nền tảng */
        key: string
    }[]
    modelValue?: string
}>(), {})

/**chọn 1 nền tảng */
function selectTab(key: string) {
    $emit('update:modelValue', key)
}
</script>