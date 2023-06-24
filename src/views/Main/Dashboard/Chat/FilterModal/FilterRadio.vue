<template>
    <div @click="radio_ref?.click()" class="flex items-center mb-2 cursor-pointer hover:bg-orange-100 p-2 border-b rounded-lg">
        <div>
            <img :src="icon">
        </div>
        <div class="ml-1 w-[calc(100%_-_44px)]">
            {{ title }}
        </div>
        <input ref="radio_ref" type="radio" class="accent-orange-600 w-[20px] h-[20px]">
    </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'

import type { ComponentRef } from '@/service/interface/vue';

withDefaults(defineProps<{
    /**icon của item */
    icon: string
    /**title của item */
    title: string
}>(), {})

/**ref của radio button */
const radio_ref = ref<ComponentRef>()
</script>