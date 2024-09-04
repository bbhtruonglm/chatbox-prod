<template>
  <div
    v-if="emotion !== 'none'"
    v-tooltip="$t(`v1.view.main.dashboard.chat.message.emotion_ai.${emotion}`)"
    :class="{
      '-right-2.5': position === 'RIGHT',
      '-left-2.5': position === 'LEFT',
      'border-green-500 bg-green-100': isPositive(),
      'border-red-500 bg-red-100': !isPositive(),
    }"
    class="border rounded-full w-6 h-6 flex items-center justify-center text-sm absolute -top-2.5 z-20"
  >
    {{ ICON?.[emotion] || '' }}
  </div>
</template>
<script setup lang="ts">
const $props = withDefaults(
  defineProps<{
    /**cảm xúc */
    emotion: string
    /**vị trí của cảm xúc */
    position: 'LEFT' | 'RIGHT'
  }>(),
  {}
)

/**icon của cảm xúc */
const ICON: Record<string, string> = {
  happiness: '😊',
  anger: '😡',
  sadness: '😢',
  fear: '😱',
  surprise: '😲',
  disgust: '🤢',
  love: '❤️',
  jealousy: '😒',
  shame: '😳',
  pride: '😌',
}

/**tiêu cực hay tích cực */
function isPositive(): boolean {
  /**cảm xúc tích cực */
  const POSITIVE = ['happiness', 'love', 'pride', 'surprise']

  // kiểm tra cảm xúc có phải là tích cực không
  return POSITIVE.includes($props.emotion)
}
</script>
