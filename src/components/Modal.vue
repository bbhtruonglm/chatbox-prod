<template>
    <Teleport to="body">
        <div v-if="is_open" class="select-none xl:select-auto absolute top-0 left-0 w-screen h-screen bg-slate-500/50 z-10">
            <div @click="toggleModal" class="w-full h-full" />
            <div
                class="w-[calc(100%_-_20px)] max-h-[calc(100vh_-_150px)] md:w-[70%] bg-white rounded-lg absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] px-4 py-2">
                <button @click="toggleModal" class="absolute top-[8px] right-[6px]">
                    <img src="@/assets/icons/close-red.svg">
                </button>
                <div class="font-semibold">
                    <slot name="header"></slot>
                </div>
                <div class="mt-2 mb-4">
                    <slot name="body"></slot>
                </div>
                <div>
                    <slot name="footer"></slot>
                </div>
            </div>
        </div>
    </Teleport>
</template>
<script setup lang="ts">
// xử dụng teleport để dịch chuyển modal lên body mỗi lần được hiển thị
import { ref } from 'vue'

const $emit = defineEmits(['close_modal'])

/**ẩn hiện modal */
const is_open = ref(false)

/**ẩn hiện modal */
function toggleModal() {
    is_open.value = !is_open.value

    // bắn sự kiện ra ngoài khi tắt modal
    if (!is_open.value) $emit('close_modal')
}

// public chức năng ẩn hiện modal để có thể được gọi từ bên ngoài component
defineExpose({ toggleModal })
</script>