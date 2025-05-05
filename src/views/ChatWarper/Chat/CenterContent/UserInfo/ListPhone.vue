<template>
    <Dropdown ref="client_menu_ref" width="349px" height="auto" :is_fit="false" position="BOTTOM" :back="309"
        :distance="9" class_content="flex flex-col gap-1 max-h-[210px] overflow-y-auto">
        <!-- Lặp qua conversationList và hiển thị từng PhoneItem -->
        <PhoneItem v-for="(item, index) in conversation_list" :key="index" :phone_number="item.phone_number"
            :created_at="item.created_at" :last_call="item.last_call" />

    </Dropdown>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

/**component*/
import Dropdown from '@/components/Dropdown.vue'

/**component con*/
import PhoneItem from '@/components/Main/Dashboard/PhoneItem.vue'

/**ref của dropdown danh sách cuộc gọi của khách hàng */
const client_menu_ref = ref<InstanceType<typeof Dropdown>>()

/**ẩn hiện dropdown danh sách cuộc goi của khách hàng */
function toggle($event?: MouseEvent) {
    client_menu_ref.value?.toggleDropdown($event)
}

/**danh sách giả định*/
const conversation_list = [
    {
        phone_number: "*****3123",
        created_at: "2 ngày trước",
        last_call: "3 ngày trước"
    },
    {
        phone_number: "*****4567",
        created_at: "10/04/2025",
        last_call: "12:04 10/04/2025"
    },
    {
        phone_number: "*****3123",
        created_at: "2 ngày trước",
        last_call: "3 ngày trước"
    },
    {
        phone_number: "*****4567",
        created_at: "10/04/2025",
        last_call: "12:04 10/04/2025"
    },
    {
        phone_number: "*****3123",
        created_at: "2 ngày trước",
        last_call: "3 ngày trước"
    },
    {
        phone_number: "*****4567",
        created_at: "10/04/2025",
        last_call: "12:04 10/04/2025"
    },
    {
        phone_number: "*****3123",
        created_at: "2 ngày trước",
        last_call: "3 ngày trước"
    },
    {
        phone_number: "*****4567",
        created_at: "10/04/2025",
        last_call: "12:04 10/04/2025"
    },
    {
        phone_number: "*****3123",
        created_at: "2 ngày trước",
        last_call: "3 ngày trước"
    },
    {
        phone_number: "*****4567",
        created_at: "10/04/2025",
        last_call: "12:04 10/04/2025"
    },
    {
        phone_number: "*****3123",
        created_at: "2 ngày trước",
        last_call: "3 ngày trước"
    },
    {
        phone_number: "*****4567",
        created_at: "10/04/2025",
        last_call: "12:04 10/04/2025"
    },
    {
        phone_number: "*****3123",
        created_at: "2 ngày trước",
        last_call: "3 ngày trước"
    },
    {
        phone_number: "*****4567",
        created_at: "10/04/2025",
        last_call: "12:04 10/04/2025"
    },
    {
        phone_number: "*****3123",
        created_at: "2 ngày trước",
        last_call: "3 ngày trước"
    },
    {
        phone_number: "*****4567",
        created_at: "10/04/2025",
        last_call: "12:04 10/04/2025"
    },

];


defineExpose({ toggle })

</script>
