<template>
    <Teleport :to="teleport_to">
        <div v-if="is_open" class="absolute top-0 left-0 h-screen w-screen z-20">
            <div @click="toggleDropdown()" class="w-full h-full"></div>
            <div ref="dropdown_ref" :style="{
                width: _width,
                height: _height,
            }" class="absolute shadow-lg rounded-md p-2 bg-white">
                <slot />
            </div>
        </div>
    </Teleport>
</template>
<script setup lang="ts">
import { ref, nextTick } from 'vue'

import type { ComponentRef } from '@/service/interface/vue'

const $emit = defineEmits(['close_dropdown', 'open_dropdown'])

const $props = withDefaults(defineProps<{
    /**dịch chuyển component này đến vị trí nào */
    teleport_to?: string
    /**độ rộng của component */
    width?: string
    /**độ dài của component */
    height?: string
    /**hướng của dropdown */
    position?: 'TOP' | 'LEFT' | 'RIGHT' | 'BOTTOM'
    /**width hoặc height sẽ bằng với phần tử cha */
    is_fit?: boolean
    /**khoảng cách so với mục tiêu */
    distance?: number
    /**lùi div lại một khoảng */
    back?: number
}>(), {
    teleport_to: 'body',
    width: '200px',
    height: '200px',
    position: 'BOTTOM',
    is_fit: true,
    distance: 5,
    back: 0
})

/**chiều rộng thực tế */
const _width = ref($props.width)
/**chiều cao thực tế */
const _height = ref($props.height)
/**ẩn hiện modal */
const is_open = ref(false)
/**ref của dropdown */
const dropdown_ref = ref<ComponentRef>()

/**dịch chuyển dropdown đến vị trí */
function teleportToTarget($event?: MouseEvent) {
    // tịnh tiến vị trí
    const TARGET = $event?.currentTarget as HTMLElement

    if (!TARGET) return

    // lấy vị trí của block click
    const { x, y, width, height } = TARGET?.getBoundingClientRect()

    // hiển thị dropdown
    nextTick(() => {
        // bên phải
        if ($props.position === 'RIGHT') {
            // căn chỉnh vị trí
            dropdown_ref.value.style.left = `${x + width + $props.distance}px`
            dropdown_ref.value.style.top = `${y - $props.back}px`

            // căn lại kích thước nếu cần
            if ($props.is_fit) _height.value = `${height}px`
        }
        // bên dưới
        if ($props.position === 'BOTTOM') {
            // căn chỉnh vị trí
            dropdown_ref.value.style.left = `${x - $props.back}px`
            dropdown_ref.value.style.top = `${y + height + $props.distance}px`

            // căn lại kích thước nếu cần
            if ($props.is_fit) _width.value = `${width}px`
        }
        // bên trái
        if ($props.position === 'LEFT') {
            // căn chỉnh vị trí
            dropdown_ref.value.style.left = `${x - dropdown_ref.value.offsetWidth - $props.distance}px`
            dropdown_ref.value.style.top = `${y - $props.back}px`

            // căn lại kích thước nếu cần
            if ($props.is_fit) _height.value = `${height}px`
        }
        // bên trên
        if ($props.position === 'TOP') {
            // căn chỉnh vị trí
            dropdown_ref.value.style.left = `${x - $props.back}px`
            dropdown_ref.value.style.top = `${y - dropdown_ref.value.offsetHeight - $props.distance}px`

            // căn lại kích thước nếu cần
            if ($props.is_fit) _width.value = `${width}px`
        }
    })
}
/**ẩn hiện modal */
function toggleDropdown($event?: MouseEvent) {
    // mở modal
    if (!is_open.value) {

        // mở modal
        is_open.value = true

        // bắn sự kiện ra ngoài khi tắt modal
        $emit('open_dropdown')

        teleportToTarget($event)
    }
    // tắt modal
    else immediatelyHide()
}
/**tắt ngay lập tức */
function immediatelyHide() {
    if (!is_open.value) return

    is_open.value = false

    // bắn sự kiện ra ngoài khi tắt modal
    $emit('close_dropdown')
}

// public chức năng ẩn hiện modal để có thể được gọi từ bên ngoài component
defineExpose({ toggleDropdown, immediatelyHide, is_open })
</script>