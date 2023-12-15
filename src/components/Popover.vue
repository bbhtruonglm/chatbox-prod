<template>
    <Teleport :to="teleport_to">
        <div @mouseover="hoverPopover" @mouseleave="leavePopover" v-if="is_open" ref="popover_ref" :style="{
            width: _width,
            height: _height,
            paddingLeft: position === 'RIGHT' ? `${distance}px` : 0,
            paddingRight: position === 'LEFT' ? `${distance}px` : 0,
            paddingTop: position === 'BOTTOM' ? `${distance}px` : 0,
            paddingBottom: position === 'TOP' ? `${distance}px` : 0,
        }" class="absolute z-20">
            <div class="border rounded-md p-2 bg-white w-full h-full">
                <slot />
            </div>
        </div>
    </Teleport>
</template>
<script setup lang="ts">
import { ref, nextTick } from 'vue'

import type { ComponentRef } from '@/service/interface/vue'
import { isMobile } from '@/service/function';

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
}>(), {
    teleport_to: 'body',
    width: '200px',
    height: '200px',
    position: 'BOTTOM',
    is_fit: true,
    distance: 5,
})

/**chiều rộng thực tế */
const _width = ref($props.width)
/**chiều cao thực tế */
const _height = ref($props.height)
/**ẩn hiện modal */
const is_open = ref(false)
/**gắn cờ đang hover vào tooltip, để chặn hành động ẩn khi level div target */
const is_hover = ref(false)
/**ref của dropdown */
const popover_ref = ref<ComponentRef>()

/**xử lý sự kiện khi hover vào popover */
function hoverPopover() {
    // gắn cờ là đang di chuyển trên popover, chặn không cho popover bị ẩn đi
    is_hover.value = true
}
/**xử lý sự kiện khi di chuột ra khỏi popover */
function leavePopover() {
    // đánh dấu là đã dời khỏi popover, không được xoá dòng này nếu không sẽ lỗi
    is_hover.value = false

    // ẩn popover khi dời khỏi
    is_open.value = false
}
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
            popover_ref.value.style.left = `${x + width}px`
            popover_ref.value.style.top = `${y}px`

            // căn lại kích thước nếu cần
            if ($props.is_fit) _height.value = `${height}px`
        }
        // bên dưới
        if ($props.position === 'BOTTOM') {
            // căn chỉnh vị trí
            popover_ref.value.style.left = `${x}px`
            popover_ref.value.style.top = `${y + height}px`

            // căn lại kích thước nếu cần
            if ($props.is_fit) _width.value = `${width}px`
        }
        // bên trái
        if ($props.position === 'LEFT') {
            // căn chỉnh vị trí
            popover_ref.value.style.left = `${x - popover_ref.value.offsetWidth}px`
            popover_ref.value.style.top = `${y}px`

            // căn lại kích thước nếu cần
            if ($props.is_fit) _height.value = `${height}px`
        }
        // bên trên
        if ($props.position === 'TOP') {
            // căn chỉnh vị trí
            popover_ref.value.style.left = `${x}px`
            popover_ref.value.style.top = `${y - popover_ref.value.offsetHeight}px`

            // căn lại kích thước nếu cần
            if ($props.is_fit) _width.value = `${width}px`
        }
    })
}
/**xử lý sự kiện khi di chuột vào mục tiêu */
function mouseover($event: any) {
    // chỉ chạy ở pc
    if (isMobile()) return

    // nếu popover đã hiện rồi thì thôi
    if (is_open.value) return

    // mở modal
    if (!is_open.value) {
        // mở modal
        is_open.value = true

        // dịch chuyển popover đến vị chí cần thiết
        teleportToTarget($event)
    }
    // tắt modal
    else is_open.value = false
}
/**xử lý sự kiện khi di chuột ra ngoài mục tiêu */
function mouseleave() {
    /**
     * chờ một khoảng thời gian cho trường hợp di chuột từ mục tiêu vào popover 
     * mới hiện 
     */
    setTimeout(() => {
        // check nếu con chuột đang ở popover thì thôi không tắt nữa
        if (is_hover.value) return
        
        // tắt bỏ popover
        is_open.value = false
    }, 50)
}

// public hành động ra bên ngoài
defineExpose({ mouseover, mouseleave })
</script>