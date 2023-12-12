<template>
    <div class="h-full w-full flex relative">
        <div class="bg-white duration-500 h-screen w-[300px] absolute z-[20]" :class="genNavClass()">
            <div class="w-full h-full relative py-14 px-4 md:py-8 md:px-2 xl:py-2">
                <div @click="toggleNav" v-if="this_toggle_nav"
                    class="absolute top-0 right-[-413px] h-screen w-screen md:hidden" />
                <button @click="toggleNav" class="absolute top-[70px] right-[-40px] md:hidden">
                    <img v-if="this_toggle_nav" src="@/assets/icons/close.svg">
                    <img v-else src="@/assets/icons/toggle.svg">
                </button>
                <slot name="menu" />
            </div>
        </div>
        <div :class="genContentClass()" class="duration-500 w-full">
            <slot name="content" />
        </div>
    </div>
</template>
<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'

const $emit = defineEmits(['toggle_nav_change'])

const $props = withDefaults(defineProps<{
    /**khởi tạo ẩn hiện menu */
    init_toggle_nav?: boolean
}>(), {})

/**giá trị toggle nav hiện tại */
const this_toggle_nav = ref(false)

// thay đổi giá trị ẩn hiện nếu bên ngoài thay đổi
watch(() => $props.init_toggle_nav, val => initToggleNavValue(val))

// load giá trị ẩn hiện lúc load lần đầu
onMounted(() => initToggleNavValue($props.init_toggle_nav))

/**thay đổi giá trị của toggle */
function initToggleNavValue(value: boolean) {
    this_toggle_nav.value = value
}
/**thay đổi trạng thái của nav */
function toggleNav() {
    // thay đổi giá trị của biến
    this_toggle_nav.value = !this_toggle_nav.value

    // xuất giá trị của biến ra bên ngoài
    $emit('toggle_nav_change', this_toggle_nav.value)
}
/**
 * css lại nav khi ẩn / hiên
 * mobile: ẩn nav - hiện nav cỡ lớn
 * tablet/pc: hiện nav cỡ lớn - hiện nav cỡ nhỏ
 */
function genNavClass() {
    /**
     * trạng thái bình thường
     * mobile: ẩn nav
     * tablet/pc: hiển thị cỡ lớn
     */
    if (!this_toggle_nav.value) return 'left-[-300px] md:static md:w-[220px]'

    /**
     * trạng thái kích hoạt
     * mobile: hiển thị cỡ lớn
     * tablet/pc: hiển thị cỡ nhỏ
     */
    return `top-0 left-0 md:static md:w-[60px]`
}
/**
 * css lại kích cỡ content khi ẩn / hiện, để không bị đè vào kích thước của nav
 * ở giao diện tablet/pc
 */
function genContentClass() {
    if (!this_toggle_nav.value) return 'md:w-[calc(100%_-_220px)]'

    return `md:w-[calc(100%_-_60px)]`
}

defineExpose({ toggleNav, this_toggle_nav })
</script>