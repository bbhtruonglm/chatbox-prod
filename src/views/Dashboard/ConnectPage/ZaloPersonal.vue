<template>
  <div>
    <img
      v-if="qr_code_url"
      :src="qr_code_url"
      class="size-64"
    />
    <button
      @click="$main.getQrCode()"
      class="bg-blue-600 text-white"
    >
      lấy qr code
    </button>
  </div>
  <!-- <EmptyPage
    :icon="ZaloIcon"
    :guild="$t('v1.view.main.dashboard.select_platform.zalo_oa.guild', {
        partner: commonStore.partner?.name,
      })"
    :description="
      $t('v1.view.main.dashboard.select_platform.zalo_oa.description')
    "
    class_guild="w-[482px]"
  >
    <template #after-description>
      <span class="cursor-pointer relative">
        <span class="text-sm font-medium decoration underline">
          {{ $t('v1.view.main.dashboard.select_platform.zalo_oa.lean_more') }}
        </span>
        <NewTabIcon class="w-4 h-4 text-gray-500 absolute top-0 -right-5" />
      </span>
    </template>
    <template #button>
      <ZaloOA
        @done="connectPageStore.selectMenu('PAGE')"
        :text="$t('Kết nối với Zalo OA')"
      />
    </template>
  </EmptyPage> -->
</template>
<script setup lang="ts">
import {
  useChatbotUserStore,
  useCommonStore,
  useConnectPageStore,
  useOrgStore,
} from '@/stores'

import EmptyPage from '@/views/Dashboard/ConnectPage/EmptyPage.vue'
import ZaloOA from '@/components/OAuth/ZaloOA.vue'

import ZaloIcon from '@/components/Icons/Zalo.vue'
import NewTabIcon from '@/components/Icons/NewTab.vue'
import { container } from 'tsyringe'
import { ref } from 'vue'
import { size } from 'lodash'
import { N13ZaloPersonalAppPage } from '@/utils/api/N13ZaloPersonal/Page'

const connectPageStore = useConnectPageStore()
const commonStore = useCommonStore()
const orgStore = useOrgStore()
const chatbotUserStore = useChatbotUserStore()

/**dữ liệu hình ảnh qr để quét */
const qr_code_url = ref<string>()
/**kết nối socket */
const connection = ref<WebSocket>()

class Main {
  /**
   * @param API_PAGE api trang
   */
  constructor(
    private readonly API_PAGE = container.resolve(N13ZaloPersonalAppPage)
  ) {}

  /**lắng nghe socket để lấy mã qr số 2 */
  private listenSocket() {
    // tạo kết nối socket
    connection.value = new WebSocket($env.host.n13_zalo_personal_socket)

    /**lưu lại id vòng lặp ping */
    let ping_interval_id: number

    // khi kết nối thành công
    connection.value.onopen = () => {
      // đăng ký người dùng lắng nghe sự kiện
      connection.value?.send(
        JSON.stringify({
          user_id: chatbotUserStore.chatbot_user?.user_id,
          org_id: orgStore.selected_org_id,
          event: 'JOIN',
        })
      )

      // tự động ping socket liên tục - 30s
      ping_interval_id = setInterval(() => connection.value?.send('ping'), 1000 * 30)
    }

    // lắng nghe mã qr 2
    connection.value.onmessage = ({ data }) => {
      // nếu không có dữ liệu thì thôi
      if (!data) return

      /**dữ liệu socket */
      let socket_data: any

      // cố gắng giải mã dữ liệu
      try {
        socket_data = JSON.parse(data)
      } catch (e) {}

      // nếu không có dữ liệu thì thôi
      if (!socket_data.qr_code_url) return

      // thay đổi qr code số 2
      qr_code_url.value = socket_data.qr_code_url
      // qr_code_url.value = decodeURIComponent(socket_data.qr_code_url)

      // đóng kết nối đến socket
      connection.value?.close()
    }
  }

  /**Lấy qr code để kết nối tài khoản zalo cá nhân */
  async getQrCode() {
    // kết nối socket để lấy mã qr số 2
    this.listenSocket()

    // lấy qr code số 1 để kết nối tài khoản zalo cá nhân
    qr_code_url.value = await this.API_PAGE.syncZaloPersonalPage(
      orgStore.selected_org_id
    )
  }
}
const $main = new Main()
</script>
