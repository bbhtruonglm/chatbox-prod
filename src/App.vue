<template>
  <!-- 
    class "container-fluid" để intergrate với ext, không phải là bootstrap
    không được xoá
  -->
  <div class="w-screen h-screen container-fluid bg-gradient-primary">
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

const commonStore = useCommonStore()
const $toast = ToastSingleton.getInst()

onMounted(getPartnerInfo)

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
