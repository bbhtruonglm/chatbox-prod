<template>
  <Dropdown
    ref="client_menu_ref"
    width="349px"
    height="auto"
    :is_fit="false"
    position="BOTTOM"
    :back="309"
    :distance="9"
    class_content="flex flex-col gap-1 max-h-[210px] overflow-y-auto"
  >
    <!-- Nếu có cuộc gọi thì hiển thị danh sách -->
    <PhoneItem
      v-for="(item, index) in UNIQUECALLS"
      :key="index"
      :phone_number="item.phone"
      :created_at="item.createdAt"
      :last_call="item.updatedAt"
    />

    <!-- Nếu không có cuộc gọi nào thì hiển thị thông báo -->
    <div
      v-if="UNIQUECALLS.length === 0"
      class="text-gray-500 text-center py-4"
    >
      Chưa có cuộc gọi nào
    </div>
  </Dropdown>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useConversationStore, useCommonStore, useOrgStore } from '@/stores'
import { useRoute } from 'vue-router'

/**component*/
import Dropdown from '@/components/Dropdown.vue'

/**component con*/
import PhoneItem from '@/views/ChatWarper/Chat/CenterContent/UserInfo/ListPhone/PhoneItem.vue'

/**Api*/
import { MerchantContact } from '@/utils/api/Merchant'

/*Biến store**/
const orgStore = useOrgStore()

const commonStore = useCommonStore()

const conversationStore = useConversationStore()

/*Biến router**/
const $route = useRoute()

/**id trang */
const page_id = ref($route.query.page_id as string)

/**ref của dropdown danh sách cuộc gọi của khách hàng */
const client_menu_ref = ref<InstanceType<typeof Dropdown>>()

/**Biến lưu danh sách api đang trả về*/
const conversation_lists = ref<any[]>([])

/** Mảng mới gồm các cuộc gọi không trùng số, chỉ giữ cuộc gọi mới nhất theo từng số điện thoại */
const UNIQUECALLS = computed(() => {
  /** Map để lưu các phần tử, với key là số điện thoại */
  const MAP = new Map<string, any>()

  // Duyệt qua danh sách cuộc gọi
  conversation_lists.value.forEach(item => {
    /** Phần tử đã tồn tại trong Map theo số điện thoại (nếu có) */
    const EXISTING = MAP.get(item.phone)

    /** Thời gian của cuộc gọi hiện tại (ưu tiên end_time, fallback là createdAt) */
    const CURRENT_TIME = item.end_time || item.createdAt

    /** Thời gian của phần tử đã có trong Map (nếu có) */
    const EXISTING_TIME = EXISTING?.end_time || EXISTING?.createdAt

    // Nếu chưa có hoặc phần tử hiện tại mới hơn thì cập nhật
    if (!EXISTING || new Date(CURRENT_TIME) > new Date(EXISTING_TIME)) {
      MAP.set(item.phone, item)
    }
  })

  //Trả về mảng các cuộc gọi duy nhất theo số điện thoại (cuộc gọi mới nhất)
  return Array.from(MAP.values())
})

/** Ẩn/hiện dropdown danh sách cuộc gọi của khách hàng */
function toggle($event?: MouseEvent) {
  // Gọi phương thức toggleDropdown() trên component menu để ẩn/hiện dropdown
  client_menu_ref.value?.toggleDropdown($event)

  // Gọi lại API lấy lịch sử cuộc gọi mỗi khi toggle (dù là mở hay đóng)
  fetchCallHistory()
}

/** Hàm gọi API lấy lịch sử cuộc gọi */
async function fetchCallHistory() {
  try {
    /** ID tổ chức được chọn */
    const ORG_ID = orgStore.selected_org_id ?? ''
    /** ID trang hiện tại */
    const PAGE_ID = page_id.value ?? ''
    /** ID khách hàng đang xem */
    const CLIENT_ID = conversationStore.select_conversation?.fb_client_id ?? ''

    // Bật trạng thái loading toàn màn hình
    commonStore.is_loading_full_screen = true

    // Gọi API lấy lịch sử cuộc gọi
    const RES = await new MerchantContact().getCallHistory(
      ORG_ID,
      PAGE_ID,
      CLIENT_ID
    )

    return RES
  } catch (error) {
    console.error('Error fetching call history:', error)

    if (Array.isArray(error)) {
      // API đang trả về mảng nên gán trực tiếp vào danh sách cuộc gọi
      conversation_lists.value = error
      return
    }

    // Ném lỗi để xử lý bên ngoài nếu không phải mảng
    throw error
  } finally {
    // Tắt trạng thái loading
    commonStore.is_loading_full_screen = false
  }
}

defineExpose({ toggle })
</script>
