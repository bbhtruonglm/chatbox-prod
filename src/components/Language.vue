<template>
    <div ref="select_lang_ref" class="relative w-[118px]">
        <div v-if="is_toggle_select_lang" class="absolute bottom-[30px] left-0 shadow-lg rounded-lg pt-4">
            <div @click="changeLang(key)" v-for="(lang, key) of SELECT_LANG"
                class="cursor-pointer flex hover:bg-orange-500 hover:text-white px-2 pb-1">
                <img :src="lang.img">
                <div class="ml-1">{{ lang.title }}</div>
            </div>
        </div>
        <div @click="is_toggle_select_lang = !is_toggle_select_lang" class="flex cursor-pointer">
            <img src="@/assets/icons/global.svg">
            <div class="ml-1 uppercase">{{ current_locale }}</div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'

import vnSvg from '@/assets/icons/vn.svg'
import enSvg from '@/assets/icons/en.svg'
import thSvg from '@/assets/icons/th.svg'

import type { ComponentRef } from '@/service/interface/vue'

const { locale } = useI18n()

const vn = { img: vnSvg, title: 'Tiếng Việt' }
const en = { img: enSvg, title: 'English' }
const th = { img: thSvg, title: 'ไทย' }

/**
 * một ngôn ngữ có nhiều kiểu viết tắt, nên phải mapping lại
 */
const MAPPING_LANG: { [index: string]: string } = {
    vn: 'vn', vi: 'vn',
    en: 'en', us: 'en',
    th: 'th',
}

const SELECT_LANG = { vn, en, th }

const select_lang_ref = ref<ComponentRef>()

const is_toggle_select_lang = ref(false)

const current_locale = computed(() => MAPPING_LANG[locale.value])

// lắng nghe sự kiện click ra ngoài
onMounted(() => document.body.addEventListener('click', clickOutSide))
// huỷ lắng nghe sự kiện khi un mount
onUnmounted(() => document.body.removeEventListener('click', clickOutSide))

/**ẩn option lựa cho khi click outside */
function clickOutSide($event: MouseEvent) {
    if (
        select_lang_ref.value == $event.target ||
        select_lang_ref.value.contains($event.target)
    ) return

    is_toggle_select_lang.value = false
}
/**lưu lại lang mới vào local, và reload lại trang */
function changeLang(key: string) {
    localStorage.setItem('locale', key)

    window.location.reload()
}
</script>