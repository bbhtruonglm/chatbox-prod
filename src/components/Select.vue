<template>
    <div ref="select_ref" class="relative h-[27px]">
        <div class="absolute right-2 top-[50%] translate-y-[-50%] z-10">
            <img v-if="!is_show_option" width="15" src="@/assets/icons/arrow-down.svg">
            <img v-if="is_show_option" width="15" src="@/assets/icons/arrow-up.svg">
        </div>
        <div v-show="!is_show_option" @click="showOption"
            class="cursor-pointer rounded border border-slate-300 w-full h-full pl-2 pr-7 bg-white flex items-center">
            <span v-show="modelValue" class="w-[inherit] text-ellipsis overflow-hidden whitespace-nowrap">
                <span v-show="visible_value === 'modelValue'">
                    {{ modelValue || selected_value?.modelValue }}
                </span>
                <span v-show="visible_value === 'display_value'">
                    {{ getDisplayValue() }}
                </span>
            </span>
            <span v-show="!modelValue" class=" text-gray-400">{{ placeholder }}</span>
        </div>
        <div v-show="is_show_option" class="w-full h-full relative">
            <input ref="select_input_ref" type="text" class="rounded border border-slate-300 w-full h-full pl-5 pr-7"
                :placeholder="placeholder" v-model="search">
            <img width="15" height="15" src="@/assets/icons/search.svg" class="absolute top-[6px] left-1">
        </div>
        <div ref="select_option_ref" v-show="is_show_option" @click="selectOption"
            class="p-2 rounded-lg border border-slate-300 bg-white mt-1 h-auto max-h-[200px] overflow-hidden overflow-y-auto absolute z-40 max-w-[100vw] w-[-webkit-fill-available]">
            <slot />
            <span class="text-gray-400">{{ placeholder }}</span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { nonAccentVn } from '@/service/helper/format'

import type { ComponentRef } from '@/service/interface/vue';

const $props = withDefaults(defineProps<{
    /**giá trị của v-model được truyền vào */
    modelValue?: any
    /**field dữ liệu được chọn để hiện thị */
    display_value?: any
    /**placeholder của select */
    placeholder?: string
    /**giá trị của select khi được chọn, sẽ hiển thị value trực tiếp, hay là 1 field khác */
    visible_value?: 'modelValue' | 'display_value'
    /**tắt tính năng tìm kiếm của component, thay vào đó emit data tìm kiếm ra ngoài */
    filter_off?: boolean
}>(), {
    visible_value: 'display_value'
})

const $emit = defineEmits(['update:modelValue', 'update:display_value', 'search'])

/**ref tổng của select */
const select_ref = ref<ComponentRef>()
/**ref của input */
const select_input_ref = ref<ComponentRef>()
/**ref của div bao quanh option */
const select_option_ref = ref<ComponentRef>()
/**gắn cờ cho logic hiện danh sách lựa chọn của select */
const is_show_option = ref<boolean>()
/**giá trị của tìm kiếm */
const search = ref<string>()
/**giá trị của option được lựa chọn */
const selected_value = ref<{
    /**giá trị của model */
    modelValue: any
    /**giá trị được hiển thị (nếu cần) */
    display_value: any
}>()

/**theo dõi sự thay đổi của v-model bên ngoài */
watch(() => $props.modelValue, () => onChangeModelValue())
/**theo dõi sự thay đổi khi tìm kiếm */
watch(() => search.value, val => {
    // nếu tắt tìm kiếm nội bộ, thì emit search ra bên ngoài
    if ($props.filter_off) return $emit('search', val)

    // ẩn hiện option theo tìm kiếm
    getAllOption().map((option: HTMLDivElement) => {
        let option_text = nonAccentVn(option.innerText)
        let search_value = nonAccentVn(val || '')

        if (option_text.includes(search_value))
            option.style.display = 'block'
        else
            option.style.display = 'none'
    })
})

onMounted(() => {
    /**lắng nghe sự kiện khi click ra ngoài */
    document.body.addEventListener('click', clickOutSide)

    onChangeModelValue()
})
/**lắng nghe sự kiện khi huỷ component */
onUnmounted(() => document.body.removeEventListener('click', clickOutSide))
/**đọc toàn bộ dữ liệu của option */
function getAllOption() {
    // lấy ra toàn bộ các option của select
    const LIST_OPTION: HTMLDivElement[] = select_option_ref
        .value
        .getElementsByClassName('custom-select-option')

    if (!LIST_OPTION || !LIST_OPTION.length) return []

    // parser html list thành array
    return [...LIST_OPTION]
}
/**xử lý dữ liệu khi v-model thay đổi */
function onChangeModelValue() {
    nextTick(() => {
        // tìm kiếm option khớp với v-model mới
        const SELECTED_OPTION = getAllOption()
            .map((option: HTMLDivElement) => getOptionData(option))
            .find(option => option.value == $props.modelValue)

        if (!SELECTED_OPTION || !SELECTED_OPTION.value) return

        // ghi đè lại giá trị được chọn
        selected_value.value = {
            modelValue: SELECTED_OPTION.value,
            display_value: SELECTED_OPTION.display_value,
        }
    })
}
/**sử lý sự kiện click ra ngoài */
function clickOutSide($event: MouseEvent) {
    if (
        select_ref.value == $event.target ||
        select_ref.value.contains($event.target)
    ) return

    hideOption()
}
/**đọc dữ liệu của 1 option */
function getOptionData(option: HTMLDivElement) {
    return {
        value: option.getAttribute('value'),
        display_value: option.innerText,
    }
}
/**xử lý sự kiện khi click vào một option */
function selectOption($event: Event) {
    // tìm thấy option
    const NODE_OPTION = $event.target as HTMLDivElement

    if (!NODE_OPTION) return

    // lấy các dữ liệu cần thiết của option
    const { value, display_value } = getOptionData(NODE_OPTION)

    if (!value || !display_value) return

    // ghi đè dữ liệu lựa chọn
    selected_value.value = {
        modelValue: value,
        display_value: display_value,
    }

    // gửi event ra bên ngoài để thay đổi v-model
    $emit('update:modelValue', value)
    $emit('update:display_value', display_value)

    search.value = ''
    hideOption()
}
/**hiển thị danh sách option */
function showOption() {
    is_show_option.value = true

    nextTick((): void => select_input_ref.value.focus())
}
/**ẩn danh sách option */
function hideOption() {
    is_show_option.value = false
}
/**đọc ra giá trị hiển thị */
function getDisplayValue() {
    return $props.display_value || selected_value.value?.display_value
}
</script>