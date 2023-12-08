<template>
    <div class="w-full justify-end flex flex-wrap relative z-1">
        <div class="my-1 bg-white px-2 rounded-md">
            <div v-for="button of data" class="bg-slate-200 rounded-md py-1 w-[200px] text-center truncate my-2 cursor-not-allowed font-semibold">
                {{  button?.title }}
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import type { ChatbotButton } from '@/service/interface/app/message'

const $props = withDefaults(defineProps<{
    data?: ChatbotButton[]
}>(), {})
</script>