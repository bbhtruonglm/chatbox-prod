<template>
    <div 
        class=" absolute bottom-[40px] left-[4px] z-20"
        :style="{ 'display': show_emoji ? 'block' : 'none' }"
        ref="emoji_ref"
    >
        <picker 
            :data="emojiIndex" 
            set="facebook" 
            :showSearch="false" 
            :showPreview="false" 
            @select="selectEmoji"
            :i18n="{
                categories: {
                    search: $t(
                        'v1.view.main.dashboard.chat.emoji.search'
                    ),
                    recent: $t(
                        'v1.view.main.dashboard.chat.emoji.recent'
                    ),
                    smileys: $t(
                        'v1.view.main.dashboard.chat.emoji.smileys'
                    ),
                    people: $t(
                        'v1.view.main.dashboard.chat.emoji.people'
                    ),
                    nature: $t(
                        'v1.view.main.dashboard.chat.emoji.nature'
                    ),
                    foods: $t(
                        'v1.view.main.dashboard.chat.emoji.foods'
                    ),
                    activity: $t(
                        'v1.view.main.dashboard.chat.emoji.activity'
                    ),
                    places: $t(
                        'v1.view.main.dashboard.chat.emoji.places'
                    ),
                    objects: $t(
                        'v1.view.main.dashboard.chat.emoji.objects'
                    ),
                    symbols: $t(
                        'v1.view.main.dashboard.chat.emoji.symbols'
                    ),
                    flags: $t(
                        'v1.view.main.dashboard.chat.emoji.flags'
                    ),
                },
            }" 
        />
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import data from "emoji-mart-vue-fast/data/all.json";
import "emoji-mart-vue-fast/css/emoji-mart.css";
import { Picker, EmojiIndex } from "emoji-mart-vue-fast/src";
import type { ComponentRef } from '@/service/interface/vue'

interface Emoji {
    native: string
}

const $props = withDefaults(defineProps<{
    selectEmoji: Function
}>(), {})

/** Khởi tạo data emoji */
const emojiIndex = new EmojiIndex(data)
/** trạng thái ẩn hiện emoji */
const show_emoji = ref<boolean>(false)
/** ref của emoji */
const emoji_ref = ref<ComponentRef>()
/** Gắn cờ hành động click mở emoji */
const flag_open = ref<boolean>(false)

// lắng nghe sự kiện click ra ngoài
onMounted(() => document.body.addEventListener('click', clickOutSide))
// huỷ lắng nghe sự kiện khi un mount
onUnmounted(() => document.body.removeEventListener('click', clickOutSide))

/** Chọn emoji */
function selectEmoji(emoji: Emoji) {
    $props.selectEmoji(emoji.native)
}
/** Bật tắt emoji */
function toogleEmoji() {
    show_emoji.value = !show_emoji.value
    if(show_emoji.value) flag_open.value = true
    setTimeout(function() {
        flag_open.value = false
    }, 1000)
}
/** ẩn option lựa cho khi click outside */
function clickOutSide($event: MouseEvent) {
    if(flag_open.value) return

    if (
        emoji_ref.value == $event.target ||
        emoji_ref.value.contains($event.target)
    ) return

    if(show_emoji.value) show_emoji.value = false
}

// public chức năng ẩn hiện emoji để có thể được gọi từ bên ngoài component
defineExpose({ toogleEmoji })
</script>