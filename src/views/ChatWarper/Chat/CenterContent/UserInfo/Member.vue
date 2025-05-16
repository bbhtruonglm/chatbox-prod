<template>
  <Dropdown
    ref="client_menu_ref"
    width="280px"
    height="auto"
    :is_fit="false"
    position="BOTTOM"
    :back="200"
    :distance="9"
    class_content="flex flex-col gap-1 max-h-[210px] overflow-y-auto"
  >
    <!-- Lặp qua conversationList và hiển thị từng memberItem -->
    <MemberItem
      v-for="(item, index) in conversation_list"
      :key="index"
      :avatar_member="item.avatar"
      :name_member="item.name"
    />
  </Dropdown>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

/**component*/
import Dropdown from '@/components/Dropdown.vue'

/**component con*/
import MemberItem from '@/views/ChatWarper/Chat/CenterContent/UserInfo/Member/MemberItem.vue'

/**ref của dropdown danh sách cuộc gọi của khách hàng */
const client_menu_ref = ref<InstanceType<typeof Dropdown>>()

/**ẩn hiện dropdown danh sách cuộc goi của khách hàng */
function toggle($event?: MouseEvent) {
  client_menu_ref.value?.toggleDropdown($event)
}

/**danh sách giả định*/
const conversation_list = [
  {
    avatar:
      'https://cdn.pixabay.com/photo/2022/12/17/04/27/men-png-7660946_1280.jpg',
    name: 'Nguyễn Xuân Hải',
  },
  {
    avatar:
      'https://cdn.pixabay.com/photo/2016/02/24/17/31/fruit-1220367_1280.png',
    name: 'Nguyễn Thị Thanh ABC',
  },
  {
    avatar:
      'https://cdn.pixabay.com/photo/2016/02/24/17/31/fruit-1220367_1280.png',
    name: 'Nguyễn Thị Thanh ABCDFGH',
  },
  {
    avatar:
      'https://cdn.pixabay.com/photo/2022/12/17/04/27/men-png-7660946_1280.jpg',
    name: 'Nguyễn Thị Thanh ABCDFGHPPPPPPPPPPPPPPP',
  },
  {
    avatar:
      'https://cdn.pixabay.com/photo/2016/02/24/17/31/fruit-1220367_1280.png',
    name: 'Nguyễn Văn A',
  },
  {
    avatar:
      'https://cdn.pixabay.com/photo/2016/02/24/17/31/fruit-1220367_1280.png',
    name: 'Nguyễn Văn A',
  },
  {
    avatar:
      'https://cdn.pixabay.com/photo/2022/12/17/04/27/men-png-7660946_1280.jpg',
    name: 'Nguyễn Xuân Hải',
  },
  {
    avatar:
      'https://cdn.pixabay.com/photo/2016/02/24/17/31/fruit-1220367_1280.png',
    name: 'Nguyễn Văn A',
  },
  {
    avatar:
      'https://cdn.pixabay.com/photo/2016/02/24/17/31/fruit-1220367_1280.png',
    name: 'Nguyễn Văn A',
  },
]

defineExpose({ toggle })
</script>
