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

import DashboardLayout from '@/components/Main/Dashboard/DashboardLayout.vue'
import Menu from '@/views/Dashboard/Org/Menu.vue'
import SelectOrg from '@/components/Main/Dashboard/SelectOrg.vue'
import ReChargeBtn from '@/views/Dashboard/Org/ReChargeBtn.vue'
import Loading from '@/components/Loading.vue'
import { onMounted } from 'vue'
import { Delay } from '@/utils/helper/Delay'
import { container } from 'tsyringe'

const orgStore = useOrgStore()
const chatbotUserStore = useChatbotUserStore()
const $delay = container.resolve(Delay)

class Main {
  /**khởi tạo bong bóng chat */
  async initEmbedChat() {
    // khởi tạo bong bóng chat
    BBH?.init?.({
      // kích hoạt id trang chat
      page_id: 'bf425487afbe403895116dd9b585537b',
      // thiết lập hiển thị - chưa có logic
      config: {},
      // cho phép gỡ lỗi
      is_debug: false,
    })

    // delay tạm 1 ít thời gian để bong bóng chat load xong
    await $delay.exec(1000)

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
        user_phone: '',
      },
      '*'
    )
  }
}
const $main = new Main()

// khởi động bong bóng chat khi component được mount
onMounted($main.initEmbedChat)

// function
</script>
