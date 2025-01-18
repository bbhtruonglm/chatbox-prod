<template>
  <div
    v-if="orgStore.is_loading"
    class="absolute top-9 left-1/2 -translate-x-1/2 z-50"
  >
    <Loading />
  </div>
  <DashboardLayout class_content="flex flex-col gap-3 relative overflow-y-auto">
    <template #menu><Menu /></template>
    <template #content>
      <div class="flex gap-3">
        <SelectOrg />
        <ReChargeBtn v-if="$route.path.includes('/dashboard/org/pay')" />
      </div>
      <RouterView v-if="orgStore.isAdminOrg()" />
      <div
        v-else
        class="text-sm text-slate-500"
      >
        {{ $t('v1.view.main.dashboard.org.permision_denied') }}
      </div>
    </template>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { useChatbotUserStore, useOrgStore } from '@/stores'
import { onMounted, onUnmounted } from 'vue'

import DashboardLayout from '@/components/Main/Dashboard/DashboardLayout.vue'
import Menu from '@/views/Dashboard/Org/Menu.vue'
import SelectOrg from '@/components/Main/Dashboard/SelectOrg.vue'
import ReChargeBtn from '@/views/Dashboard/Org/ReChargeBtn.vue'
import Loading from '@/components/Loading.vue'

const orgStore = useOrgStore()
const chatbotUserStore = useChatbotUserStore()

class Main {
  /**id của sdk */
  private readonly SCRIPT_ID = 'retion-embed-sdk'

  /**khởi tạo sdk */
  injectSdk() {
    // kiểm tra xem sdk đã được inject chưa
    if (document.getElementById(this.SCRIPT_ID)) return

    /**script của sdk */
    const SCRIPT = document.createElement('script')

    // thiết lập id
    SCRIPT.id = this.SCRIPT_ID

    // thiết lập id
    SCRIPT.src = '//chatbox-embed-sdk.botbanhang.vn/dist/sdk.min.js'

    /**script đầu tiên */
    const FIRST_SCRIPT = document.getElementsByTagName('script')?.[0]

    // nếu không có script nào thì return
    if (!FIRST_SCRIPT || !FIRST_SCRIPT.parentNode) return

    // chèn script vào trước script đầu tiên
    FIRST_SCRIPT.parentNode.insertBefore(SCRIPT, FIRST_SCRIPT)
  }
  removeSdk() {
    /**script của sdk */
    const SCRIPT = document.getElementById(this.SCRIPT_ID)

    // nếu không có script thì thôi
    if (!SCRIPT) return

    // xóa script
    SCRIPT.remove()
  }
  /**khởi tạo bong bóng chat */
  initEmbedChat($event: MessageEvent) {
    // kiểm tra xem event có phải từ sdk không
    if ($event.data?.from !== 'RETION_EMBED') return

    // kiểm tra xem event có phải là event load thành công không
    if ($event.data?.type !== 'LOADED_SUCCESS') return

    // khởi tạo bong bóng chat
    BBH?.init?.({
      // kích hoạt id trang chat
      page_id: '4aa9fb0c619f42bc94240a4d441ba654',
      // thiết lập hiển thị - chưa có logic
      config: {},
      // cho phép gỡ lỗi
      is_debug: false,
    })
  }
  /**truyền dữ liệu cho popup */
  sendUserInfo($event: MessageEvent) {
    // kiểm tra xem event có phải từ sdk không
    if ($event.data?.from !== 'RETION_EMBED') return

    // kiểm tra xem event có phải là event đã khởi tạo thành công không
    if ($event.data?.type !== 'INIT_SUCCESS') return

    /**iframe của bong bóng chat */
    const IFRAME = document.querySelector(
      '#BBH-EMBED-IFRAME'
    ) as HTMLIFrameElement

    // gửi sự kiện để init thông tin user
    IFRAME?.contentWindow?.postMessage(
      {
        from: 'parent-app',
        user_name: chatbotUserStore.chatbot_user?.full_name,
        user_email: chatbotUserStore.chatbot_user?.email,
        user_id: chatbotUserStore.chatbot_user?.user_id,
        user_phone: '',
      },
      '*'
    )
  }
}
const $main = new Main()

// tiêm sdk vào dom
$main.injectSdk()

// sự kiện inject bong bóng chat
onMounted(() => window.addEventListener('message', $main.initEmbedChat))
onUnmounted(() => window.removeEventListener('message', $main.initEmbedChat))

// sự kiện truyền thông tin user cho bong bóng chat
onMounted(() => window.addEventListener('message', $main.sendUserInfo))
onUnmounted(() => window.removeEventListener('message', $main.sendUserInfo))

// sự kiện destroy bong bóng chat
onUnmounted(() => BBH?.destroy?.())

// sự kiện destroy sdk
onUnmounted(() => $main.removeSdk())
</script>
