<template>
    <div 
        class=" absolute bottom-[100px] left-11" 
        :style="{ 'display': show_emoji ? 'block' : 'none' }"
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
import { ref } from 'vue'
import data from "emoji-mart-vue-fast/data/all.json";
import "emoji-mart-vue-fast/css/emoji-mart.css";
import { Picker, EmojiIndex } from "emoji-mart-vue-fast/src";

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

/** Chọn emoji */
const selectEmoji = (emoji: Emoji) => {
    $props.selectEmoji(emoji.native)
}
/** Bật tắt emoji */
const toogleEmoji = () => {
    show_emoji.value = !show_emoji.value
}

// public chức năng ẩn hiện emoji để có thể được gọi từ bên ngoài component
defineExpose({ toogleEmoji })
</script>