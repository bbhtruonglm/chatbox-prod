<template>
  <ZaloPeronalCore
    :org_id="query_string_data.org_id"
    :actual_client_id="query_string_data.actual_client_id"
    :actual_page_id="query_string_data.actual_page_id"
    :client_id="client_id"
    :message_id="query_string_data.message_id"
  />
</template>

<script setup lang="ts">
import { QueryString } from '@/utils/helper/QueryString';
import { container } from 'tsyringe';
import { onMounted, ref } from 'vue';

import ZaloPeronalCore from '@/views/ChatWarper/Chat/CenterContent/MessageList/MessageItem/PhoneAction/ZaloPeronalCore.vue';

/** đối tượng thao tác với query string */
const $query_string = container.resolve(QueryString)

/** dữ liệu query string */
const query_string_data = ref({
  org_id: '',
  actual_client_id: '',
  actual_page_id: '',
  message_id: '',
})

/** id của khách hàng ở page zalo được chọn */
const client_id = ref('')

onMounted(() => {
  // lấy id tổ chức từ query string
  query_string_data.value.org_id = $query_string.get('org_id') || ''
  // lấy id khách hàng hiện tại từ query string
  query_string_data.value.actual_client_id = $query_string.get('actual_client_id') || ''
  // lấy id trang hiện tại từ query string
  query_string_data.value.actual_page_id = $query_string.get('actual_page_id') || ''
  // lấy id tin nhắn trong query string
  query_string_data.value.message_id = $query_string.get('message_id') || ''

  console.log(123);
  
  window.parent.postMessage({
    type: 'zalo_get_client_id',
    data: {
      org_id: query_string_data.value.org_id,
      actual_client_id: query_string_data.value.actual_client_id,
      actual_page_id: query_string_data.value.actual_page_id,
    }
  }, '*')

})
</script>
