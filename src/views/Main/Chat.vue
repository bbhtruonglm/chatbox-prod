<template>
    <div>
        chat
        {{ pageStore.selected_page_id_list }}
    </div>
</template>

<script setup lang="ts">
import { usePageStore } from '@/stores'

const pageStore = usePageStore()
</script>