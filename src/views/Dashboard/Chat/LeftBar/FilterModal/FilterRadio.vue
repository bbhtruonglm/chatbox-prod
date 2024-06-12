<template>
    <div @click="radio_ref?.click()"
        class="flex items-center mb-2 cursor-pointer hover:bg-orange-100 p-2 rounded-lg">
        <div class="w-[16px] h-[16px]">
            <img :src="icon">
        </div>
        <div class="ml-1 w-[calc(100%_-_40px)]">
            {{ title }}
        </div>
        <input :checked="isChecker()" @input="emitValue" :value="value" ref="radio_ref" type="radio"
            class="accent-orange-600 w-[20px] h-[20px]">
    </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'

import type { ComponentRef } from '@/service/interface/vue'

const $emit = defineEmits(['update:modelValue'])

const $props = withDefaults(defineProps<{
    /**icon của item */
    icon: string
    /**title của item */
    title: string
    /**v-model được truyền vào */
    modelValue?: any
    /**giá trị của radio này */
    value?: any
}>(), {})

/**ref của radio button */
const radio_ref = ref<ComponentRef>()

/**kiểm tra xem radio có được chọn hay không */
function isChecker() {
    if (!$props.modelValue) return false

    if ($props.modelValue === $props.value) return true

    return false
}
/**emit ra v-model */
function emitValue($event: any) {
    $emit('update:modelValue', $event?.target?.value)
}
</script>