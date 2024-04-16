<template>
    <div class="h-full w-full flex relative">
        <div class="bg-white duration-500 h-screen w-[300px] absolute z-[20]" :class="genNavClass()">
            <div class="w-full h-full relative py-14 px-4 md:py-8 md:px-2 xl:py-1 border-r">
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
import { onMounted, watch, ref } from 'vue'
import { useCommonStore } from '@/stores'
import { isMobile, isChat } from '@/service/function'
import { useRoute } from 'vue-router'

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
    /**ở mobile thì nav là overlay và sẽ ẩn hẳn đi */
    if (isMobile()) {
        /**
        * trạng thái bình thường
        * mobile: ẩn nav
        */
        if (!this_toggle_nav.value) return 'left-[-300px]'

        /**
         * trạng thái kích hoạt
         * mobile: hiển thị cỡ lớn
         */
        return `top-0 left-0`
    }
    /**ở pc thì trong chat hiện nhỏ, ngoài chat hiện lớn không đổi */
    else {
        /**
        * trong chat
        * tablet/pc: hiển thị cỡ lớn
        */
        if (!isChat()) return 'md:static md:w-[220px]'

        /**
         * ngoài chat
         * tablet/pc: hiển thị cỡ nhỏ
         */
        return `md:static md:w-[60px]`
    }
}
/**
 * css lại kích cỡ content khi ẩn / hiện, để không bị đè vào kích thước của nav
 * ở giao diện tablet/pc
 */
function genContentClass() {
    /**chat thì hiện lớn */
    if (!isChat()) return 'md:w-[calc(100%_-_220px)]'

    /**ở ngoài thì hiện nhỏ */
    return `md:w-[calc(100%_-_60px)]`
}

defineExpose({ toggleNav })
</script>