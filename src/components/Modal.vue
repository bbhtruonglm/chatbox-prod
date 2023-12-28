<template>
    <Teleport to="body">
        <div v-if="is_open" class="select-none xl:select-auto absolute top-0 left-0 w-screen h-screen bg-slate-500/50 z-20">
            <div @click="toggleModal" class="w-full h-full" />
            <div
                :class="{
                    'opacity-50': animation,
                    'md:w-[70%]': !$props.fit_content,
                    'md:w-fit': $props.fit_content
                }"
                class="duration-500 w-[calc(100%_-_20px)] max-h-[calc(100vh_-_150px)] absolute top-[50%] left-[50%] 
                translate-x-[-50%] translate-y-[-50%]"
            >
                <div class="px-4 py-2 rounded-lg bg-white">
                    <button @click="toggleModal" class=" absolute top-[8px] right-[6px]">
                        <img src="@/assets/icons/close-red.svg" class="hover:saturate-150" />
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
        </div>
    </Teleport>
</template>
<script setup lang="ts">
// xử dụng teleport để dịch chuyển modal lên body mỗi lần được hiển thị
import { ref } from 'vue'

const $emit = defineEmits(['close_modal'])

const $props = withDefaults(defineProps<{
    fit_content?: boolean
}>(), {})

/**ẩn hiện modal */
const is_open = ref(false)
/**tạo hiệu ứng */
const animation = ref(true)

/**ẩn hiện modal */
function toggleModal() {
    // mở modal
    if (!is_open.value) {
        // tạo hiệu ứng hiện thị
        setTimeout(() => animation.value = false, 50)

        // mở modal
        is_open.value = true
    }
    // tắt modal
    else {
        // tạo hiệu ứng hiện thị
        animation.value = true

        // delay một khoảng thời gian cho hiệu ứng hoạt động
        setTimeout(() => { 
            // tăt modal
            is_open.value = false 

            // bắn sự kiện ra ngoài
            $emit('close_modal')
        }, 300)

    }
}

// public chức năng ẩn hiện modal để có thể được gọi từ bên ngoài component
defineExpose({ toggleModal })
</script>