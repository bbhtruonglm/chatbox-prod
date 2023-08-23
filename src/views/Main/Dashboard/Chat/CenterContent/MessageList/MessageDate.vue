<template>
    <div class="text-[10px] text-slate-400">
        {{ format_date(new Date(), 'hh:mm, dd/MM/yyyy') }}
    </div>
</template>
<script setup lang="ts">
import { format as format_date } from 'date-fns'
</script>