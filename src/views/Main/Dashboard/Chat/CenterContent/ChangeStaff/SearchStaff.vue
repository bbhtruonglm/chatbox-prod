<template>
    <div>
        <input type="text" :placeholder="$t('v1.view.main.dashboard.chat.filter.staff.find_staff')"
            class="border px-3 py-1 w-full rounded-lg focus:outline-none"
            v-on:keyup="$emit('search_staff', search_staff_name)" v-model="search_staff_name">
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const $emit = defineEmits(['search_staff'])

/** Tên nhân viên đang tìm kiếm */
const search_staff_name = ref<string>('')
</script>