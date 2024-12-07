<template>
  <!-- 
    class "container-fluid" để intergrate với ext, không phải là bootstrap
    không được xoá
  -->
  <div class="w-dvw h-dvh container-fluid bg-gradient-primary">
    <Network />
    <AdBlocker />
    <Loading
      v-if="commonStore.is_loading_full_screen"
      type="FULL"
    />
    <div class="h-full overflow-y-auto">
      <router-view />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCommonStore } from '@/stores'

import Loading from '@/components/Loading.vue'
import Network from './components/Network.vue'
import AdBlocker from './components/AdBlocker.vue'
import { onMounted } from 'vue'
import { ToastSingleton } from './utils/helper/Alert/Toast'
import { N4SerivcePublicPartner } from './utils/api/N4Service/Partner'
import { setItem } from './service/helper/localStorage'

const commonStore = useCommonStore()
const $toast = ToastSingleton.getInst()

onMounted(() => {
  // lấy token từ param nếu có
  getParamToken()

  // lấy thông tin đối tác
  getPartnerInfo()
})

/**ghi đè lại token lấy từ param, phục vụ cho trường hợp mở từ app mobile */
function getParamToken() {
  /**query param */
  const ROUTE_QUERY = new URLSearchParams(new URL(window.location.href)?.search)

  /**mã xác thực */
  const ACCESS_TOKEN = ROUTE_QUERY.get('access_token') || ROUTE_QUERY.get('token')

  // nếu không có token thì thôi
  if (!ACCESS_TOKEN) return

  // lưu token vào local storage
  setItem('access_token', ACCESS_TOKEN)
}

/**Lấy thông tin đối tác */
async function getPartnerInfo() {
  try {
    // lấy thông tin đối tác
    commonStore.partner = await new N4SerivcePublicPartner().readPartner()

    // nếu không có thông tin đối tác thì báo lỗi
    if (!commonStore.partner) throw 'NOT_FOUND.PARTNER'

    document.title = commonStore.partner?.name || ''

    // thay đổi favicon
    setFavicon()
  } catch (e) {
    // báo lỗi
    $toast.error(e)
  }
}
function setFavicon() {
  /**thẻ link */
  const LINK = document.createElement('link')

  // thêm thông tin cho thẻ link
  LINK.id = 'favicon'
  LINK.rel = 'icon'
  LINK.href = commonStore.partner?.logo?.icon || ''

  // thêm vào head
  document.head.appendChild(LINK)
}
</script>

<style lang="scss">
@import '@/assets/css/index.scss';
</style>
