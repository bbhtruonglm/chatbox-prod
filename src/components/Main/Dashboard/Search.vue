<template>
    <div class="relative">
        <img width="23" height="23" class="absolute top-[6px] left-[10px]" src="@/assets/icons/search.svg">
        <input :value="modelValue" @input="emitValue" :placeholder="placeholder"
            class="w-full border-2 rounded-full py-1 pl-10 pr-2 " type="text">
    </div>
</template>

<script setup lang="ts">
const $emit = defineEmits(['update:modelValue'])

withDefaults(defineProps<{
    /**v-model được truyền vào */
    modelValue?: string | number
    /**placeholder của input */
    placeholder?: string
}>(), {})

/**emit ra v-model */
function emitValue($event: any) {
    $emit('update:modelValue', $event?.target?.value)
}
</script>