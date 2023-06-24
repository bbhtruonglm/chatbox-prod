<template>
    <Teleport :to="teleport_to">
        <div v-if="is_open" class="absolute top-0 left-0 w-screen h-screen z-10 bg-slate-500/50">
            <div @click="toggleModal" class="w-full h-full"></div>
            <div :class="main_content_class"
                class="absolute bottom-0 left-0 w-full pb-10 px-4 pt-2 bg-white rounded-t-[18px] duration-200 max-h-[calc(100vh_-_100px)] overflow-hidden">
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
import { nextTick, ref } from 'vue'

withDefaults(defineProps<{
    teleport_to?: string
}>(), {
    teleport_to: 'body'
})

const $emit = defineEmits(['close_modal'])

/**ẩn hiện modal */
const is_open = ref(false)
/**xử dụng để tạo hiệu ứng lên xuống cho modal */
const main_content_class = ref('translate-y-[100%]')

/**ẩn hiện modal */
function toggleModal() {
    // mở modal
    if (!is_open.value) {
        // tạo hiệu ứng hiện thị
        setTimeout(() => main_content_class.value = 'translate-y-0' , 50)

        // mở modal
        is_open.value = true
    }
    // tắt modal
    else {
        // tạo hiệu ứng hiện thị
        nextTick(() => main_content_class.value = 'translate-y-[100%]')

        // tăt modal
        setTimeout(() => { is_open.value = false }, 300)

        // bắn sự kiện ra ngoài khi tắt modal
        $emit('close_modal')
    }
}

// public chức năng ẩn hiện modal để có thể được gọi từ bên ngoài component
defineExpose({ toggleModal })
</script>