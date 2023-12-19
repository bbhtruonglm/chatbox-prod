<template>
    <div @click="checkbox_ref?.click()"
        class="flex items-center mb-2 cursor-pointer hover:bg-orange-100 p-2 rounded-lg">
        <div>
            <img class="w-[16px] h-[16px]" :src="icon">
        </div>
        <div class="ml-1 w-[calc(100%_-_40px)]">
            {{ title }}
        </div>
        <input @click.stop :checked="checkInputChecker()" :value="value" @input="emitValue" ref="checkbox_ref" type="checkbox"
            class="accent-orange-600 w-[20px] h-[20px]">
    </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'

import type { ComponentRef } from '@/service/interface/vue'
import { isArray } from 'lodash'

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
const checkbox_ref = ref<ComponentRef>()

/**emit ra v-model */
function emitValue($event: any) {
    $emit('update:modelValue', $event?.target?.checked ? $props.value : undefined)
}
/**kiểm tra xem checkbox có được chọn hay không */
function checkInputChecker() {
    if (!$props.modelValue) return false

    // checkbox kiểu munti
    if (
        isArray($props.modelValue) &&
        $props.modelValue.includes($props.value)
    ) return true

    // checkbox kiểu thường
    if ($props.modelValue === $props.value) return true

    return false
}
</script>