<template>
    <div class="text-[10px] text-slate-400">
        {{ format_date(new Date(time), 'hh:mm, dd/MM/yyyy') }}
    </div>
</template>
<script setup lang="ts">
import { format as format_date } from 'date-fns'

const $props = withDefaults(defineProps<{
    /**thời gian của tin nhắn */
    time: string
}>(), {})
</script>