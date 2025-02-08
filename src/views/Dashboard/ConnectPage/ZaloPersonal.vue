<template>
  <div class="flex-1 flex items-center w-full p-2">
    <div class="flex-1 grid place-items-center">
      <div class="size-[260px] relative p-1">
        <div
          class="custom-qr-border top-0 left-0 border-t-2 border-l-2 rounded-tl-lg"
        />
        <div
          class="custom-qr-border top-0 right-0 border-t-2 border-r-2 rounded-tr-lg"
        />
        <div
          class="custom-qr-border bottom-0 left-0 border-b-2 border-l-2 rounded-bl-lg"
        />
        <div
          class="custom-qr-border bottom-0 right-0 border-b-2 border-r-2 rounded-br-lg"
        />
        <img
          v-if="qr_code_url"
          :src="qr_code_url"
          class="size-full"
        />
        <div
          v-if="qr_code_url"
          class="size-10 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-0.5 rounded-lg bg-white"
        >
          <ZaloIcon class="size-full" />
        </div>
        <div
          v-if="is_loading"
          class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        >
          <Loading class="size-7" />
        </div>
        <div
          v-if="orgStore.isReachPageQuota()"
          class="text-sm text-slate-500 grid place-items-center size-full text-center"
        >
          {{
            $t(
              'Tổ chức của bạn hiện đã đạt giới hạn sử dụng. Vui lòng liên hệ Quản trị viên'
            )
          }}
        </div>
      </div>
    </div>
    <div class="flex flex-col flex-1 items-center gap-2">
      <div class="flex flex-col items-center gap-1">
        <div class="flex items-center gap-5">
          <img
            class="size-10"
            :src="commonStore.partner?.logo?.icon"
          />
          <ArrowPathIcon class="size-5 text-slate-500" />
          <ZaloIcon class="size-10" />
        </div>
        <span class="font-semibold text-base leading-6">
          {{
            $t('Kết nối _ với Zalo cá nhân', {
              name: commonStore.partner?.name,
            })
          }}
        </span>
      </div>
      <div class="text-slate-500 text-xs">
        <ul class="list-decimal pb-2 pl-4 border-b border-slate-200">
          <li>
            <div class="flex items-center gap-1">
              {{ $t('Mở ứng dụng') }}
              <b>Zalo</b>
              <ZaloIcon class="size-3" />
              {{ $t('trên điện thoại.') }}
            </div>
          </li>
          <li>
            <div class="flex items-center gap-1">
              {{ $t('Trên mục') }}
              <b>
                {{ $t('Tìm kiếm') }}
              </b>
              <SearchIcon class="size-3" />
              {{ $t(', ấn vào') }}
              <b>
                {{ $t('biểu tượng QR') }}
              </b>
              <QrCodeIcon class="size-3" />
            </div>
          </li>
          <li>
            <div class="flex items-center gap-1">
              <span><b>Quét mã QR</b> để đăng nhập.</span>
            </div>
          </li>
        </ul>
        <div class="pt-2 flex gap-2.5">
          <ExclamationCircleIcon class="size-3 flex-shrink-0" />
          <span>
            {{
              $t(
                'Sau khi đăng nhập Zalo trên _, vui lòng không quét mã QR đăng nhập Zalo trên phiên bản Website (https://chat.zalo.me) để làm ảnh hưởng đồng bộ tin nhắn về Bot Bán Hàng.',
                { name: commonStore.partner?.name }
              )
            }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import {
  useChatbotUserStore,
  useCommonStore,
  useConnectPageStore,
  useOrgStore,
} from '@/stores'
import { container } from 'tsyringe'
import { inject, onMounted, ref, watch } from 'vue'
import { N13ZaloPersonalAppPage } from '@/utils/api/N13ZaloPersonal/Page'
import { KEY_TOGGLE_MODAL_FUNCT } from '@/views/Dashboard/ConnectPage/symbol'

import Loading from '@/components/Loading.vue'

import ZaloIcon from '@/components/Icons/Zalo.vue'
import { ArrowPathIcon, ExclamationCircleIcon } from '@heroicons/vue/24/solid'
import SearchIcon from '@/components/Icons/Search.vue'
import QrCodeIcon from '@/components/Icons/QrCode.vue'
import { loadingV2 } from '@/utils/decorator/Loading'
import { error } from '@/utils/decorator/Error'

/**dữ liệu socket */
interface ISocketData {
  /**loại xự kiện */
  event:
    | 'SECOND_QR_CODE'
    | 'EXPIRE_QR_CODE'
    | 'SUCCESS_SCAN_QR_CODE'
    | 'DONE_CONNECT_PAGE'
  /**mã qr */
  qr_code_url: string
}

const $emit = defineEmits(['done'])

/**ẩn hiện modal kết nối nền tảng */
const toggleModal = inject(KEY_TOGGLE_MODAL_FUNCT)

const connectPageStore = useConnectPageStore()
const commonStore = useCommonStore()
const orgStore = useOrgStore()
const chatbotUserStore = useChatbotUserStore()

/**trạng thái loading */
const is_loading = ref(false)
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
      ping_interval_id = setInterval(
        () => connection.value?.send('ping'),
        30_000
      )
    }

    // khi kết nối bị đóng
    connection.value.onclose = () => {
      // loại bỏ vòng lặp tự động ping socket cũ
      clearInterval(ping_interval_id)
    }

    // lắng nghe socket
    connection.value.onmessage = async ({ data }) => {
      // nếu không có dữ liệu thì thôi
      if (!data) return

      /**dữ liệu socket */
      let socket_data: ISocketData = undefined!

      // cố gắng giải mã dữ liệu
      try {
        socket_data = JSON.parse(data)
      } catch (e) {}

      switch (socket_data?.event) {
        // nếu đã quét mã thành công thì tiếp tục hiện loading
        case 'SUCCESS_SCAN_QR_CODE':
          is_loading.value = true
          break

        // hoàn thành tiến trình kết nối
        case 'DONE_CONNECT_PAGE':
          // làm sạch session
          this.clearSession()

          // TODO tự động f5, thoát ra bên ngoài
          console.log('đã xong nhé')

          // thông báo ra modal là đã xong
          $emit('done')

          // tắt modal kết nối nền tảng
          await toggleModal?.()
          break

        // quét chậm quá mã bị hết hạn - đang bug
        // case 'EXPIRE_QR_CODE':
        //   // làm sạch session
        //   this.clearSession()

        //   // TODO hiện nút làm lại từ đầu
        //   console.log('mã qr đã hết hạn')
        //   break

        // thay đổi qr code số 2
        case 'SECOND_QR_CODE':
          // thay đổi qr code số 2
          qr_code_url.value = socket_data.qr_code_url
          break
      }
    }
  }
  /**làm sạch session sau khi xong */
  clearSession() {
    // tắt loading
    is_loading.value = false

    // xóa mã qr code
    qr_code_url.value = undefined

    // đóng kết nối đến socket
    connection.value?.close()
  }

  /**Lấy qr code để kết nối tài khoản zalo cá nhân */
  @loadingV2(is_loading, 'value')
  @error()
  async getQrCode() {
    // nếu tổ chức hiện tại đã hết quota thì thôi
    if (orgStore.isReachPageQuota()) return

    // lắng nghe socket
    this.listenSocket()

    // lấy qr code số 1 để kết nối tài khoản zalo cá nhân
    qr_code_url.value = await this.API_PAGE.syncZaloPersonalPage(
      orgStore.selected_org_id
    )
  }
}
const $main = new Main()

// lấy qr code khi component được tạo
onMounted(() => $main.getQrCode())

watch(
  () => orgStore.selected_org_id,
  () => {
    // làm sạch session khi thay đổi org
    $main.clearSession()

    // lấy qr code mới khi thay đổi org
    $main.getQrCode()
  }
)
</script>
<style scoped lang="scss">
.custom-qr-border {
  @apply absolute size-12 border-blue-500;
}
</style>
