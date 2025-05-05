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
    <!-- Lặp qua conversationList và hiển thị từng PhoneItem -->
    <PhoneItem
      v-for="(item, index) in UNIQUECALLS"
      :key="index"
      :phone_number="item.phone"
      :created_at="item.createdAt"
      :last_call="item.updatedAt"
    />
  </Dropdown>
</template>

<script setup lang="ts">
import { useOrgStore, useCommonStore } from '@/stores'
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'

/**component*/
import Dropdown from '@/components/Dropdown.vue'

/**component con*/
import PhoneItem from '@/views/ChatWarper/Chat/CenterContent/UserInfo/ListPhone/PhoneItem.vue'

/*api**/
import { MerchantContact } from '@/utils/api/Merchant'

/*Biến store**/
const orgStore = useOrgStore()

const commonStore = useCommonStore()

/*Biến router**/
const $route = useRoute()

/**id trang */
const page_id = ref($route.query.page_id as string)

/**id khách hàng */
const client_id = ref($route.query.user_id as string)

/**ref của dropdown danh sách cuộc gọi của khách hàng */
const client_menu_ref = ref<InstanceType<typeof Dropdown>>()

/**Biến lưu danh sách api đang trả về*/
const conversation_lists = ref<any[]>([])

//*mảng mới gồm các cuộc gọi không trùng số, chỉ giữ cuộc gọi mới nhất theo từng số điện thoại
const UNIQUECALLS = computed(() => {
  // Dùng Map để lưu các phần tử với key là số điện thoại
  const MAP = new Map<string, any>()

  conversation_lists.value.forEach(item => {
    // Kiểm tra xem đã có phần tử với phone này chưa
    const EXISTING = MAP.get(item.phone)

    // Ưu tiên dùng end_time nếu có, nếu không thì dùng createdAt
    const CURRENT_TIME = item.end_time || item.createdAt

    // Tương tự, thời gian của phần tử đã có
    const EXISTING_TIME = EXISTING?.end_time || EXISTING?.createdAt

    // Nếu chưa có hoặc thời gian hiện tại mới hơn thì cập nhật vào Map
    if (!EXISTING || new Date(CURRENT_TIME) > new Date(EXISTING_TIME)) {
      MAP.set(item.phone, item)
    }
  })

  // Trả về một mảng các phần tử duy nhất theo phone, mỗi số là cuộc gọi mới nhất
  return Array.from(MAP.values())
})

/**ẩn hiện dropdown danh sách cuộc goi của khách hàng */
function toggle($event?: MouseEvent) {
  client_menu_ref.value?.toggleDropdown($event)
  // Gọi lại API mỗi khi toggle nếu dropdown được hiển thị
  fetchCallHistory()
}

/** Hàm gọi API lấy lịch sử cuộc gọi */
async function fetchCallHistory() {
  try {

    //* id tổ chức
    const ORG_ID = orgStore.selected_org_id ?? ''
    //*id trang
    const PAGE_ID = page_id.value ?? ''
    //*id khách hàng
    const CLIENT_ID = client_id.value ?? ''

    // Bật loading
    commonStore.is_loading_full_screen = true

    // Gọi API lấy danh sách
    const RES = await new MerchantContact().getCallHistory(
      ORG_ID,
      PAGE_ID,
      CLIENT_ID
    )

    return RES
  } catch (error) {
    console.error('Error fetching call history:', error)

    if (Array.isArray(error)) {
      // *Vì API đang trả về mảng nên đưa thẳng vào conversation_lists
      conversation_lists.value = error
      return
    }

    throw error
  } finally {
    // Tắt loading
    commonStore.is_loading_full_screen = false
  }
}

defineExpose({ toggle })
</script>
