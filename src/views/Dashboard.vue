<template>
    <div class="h-full w-full flex relative">
        <div class="bg-white duration-500 h-screen w-[300px] absolute shadow-xl" :class="GenNavClass()">
            <div class="w-full h-full relative py-14 px-4 md:py-2 md:px-2">
                <button @click="toggleNav" class="absolute top-[70px] right-[-40px] md:hidden">
                    <img v-if="toggle_nav" src="@/assets/icons/close.svg">
                    <img v-else src="@/assets/icons/toggle.svg">
                </button>
                <div class="cursor-pointer">
                    <div class="block md:hidden">
                        <img src="@/assets/icons/bbh-large.svg" />
                    </div>
                    <div class="hidden md:block">
                        <img v-if="!toggle_nav" src="@/assets/icons/bbh-large.svg">
                        <img v-else src="@/assets/icons/bbh-mini.svg">
                    </div>
                </div>
                <hr class="mt-4" />
                <div class="absolute bottom-[40px]">
                    <div @click="toggleNav" class="flex mt-4 cursor-pointer items-center">
                        <div class="w-[40px] h-[40px] flex items-center justify-center">
                            <img src="@/assets/icons/bell.svg">
                        </div>
                        <div class="ml-2">aaaa</div>
                    </div>
                    <div @click="toggleNav" class="flex mt-4 cursor-pointer items-center">
                        <div class="w-[40px] h-[40px] flex items-center justify-center">
                            <img src="@/assets/icons/toggle.svg">
                        </div>
                        <div class="ml-2">aaaa</div>
                    </div>
                </div>
            </div>
        </div>
        <div class="duration-500 w-full">
            <!-- <button @click="toggleNav">
                <img src="@/assets/icons/toggle.svg">
            </button> -->
            <RouterView />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const toggle_nav = ref(false)

/**thay đổi trạng thái của nav */
function toggleNav() {
    toggle_nav.value = !toggle_nav.value
}
/**
 * css lại nav khi ẩn / hiên
 * mobile: ẩn nav - hiện nav cỡ lớn
 * tablet/pc: hiện nav cỡ lớn - hiện nav cỡ nhỏ
 */
function GenNavClass() {
    /**
     * trạng thái bình thường
     * mobile: ẩn nav
     * tablet/pc: hiển thị cỡ lớn
     */
    if (!toggle_nav.value) return 'left-[-300px] md:static'

    /**
     * trạng thái kích hoạt
     * mobile: hiển thị cỡ lớn
     * tablet/pc: hiển thị cỡ nhỏ
     */
    return 'top-0 left-0 md:static md:w-[60px]'
}
</script>