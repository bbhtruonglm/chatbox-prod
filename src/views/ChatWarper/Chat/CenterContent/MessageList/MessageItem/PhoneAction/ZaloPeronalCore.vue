<template>
  <div
    class="bg-gray-100 rounded-xl p-2 flex flex-col relative w-full h-[80dvh] overflow-hidden gap-2 text-sm"
  >
    <div
      class="bg-white py-2 px-3 rounded-lg gap-2 flex items-center text-slate-700"
    >
      {{ $t('Chọn Zalo cá nhân:') }}
      <PageAvatar
        v-if="selected_page_id"
        :page_info="selected_page_info"
        class="rounded-full size-5"
      />
      <select
        v-model="selected_page_id"
        class="focus:outline-none flex-grow"
        @update:model-value="$main.getConversation()"
      >
        <option
          v-for="zlp_os of zlp_oss"
          :value="zlp_os?.page_id"
        >
          {{ zlp_os?.page_info?.name }}
        </option>
      </select>
    </div>

    <!-- Hội thoại -->
    <div class="h-full w-full overflow-hidden">
      <MessageList
        v-if="conversation"
        class="h-full"
        :conversation="conversation"
      />
      <div
        v-else
        class="flex flex-col gap-2.5 items-center justify-center h-full"
      >
        <img
          src="@/assets/imgs/empty-conversation.png"
          class="w-24 h-24"
        />
        <p>{{ $t('Không có lịch sử hội thoại') }}</p>
      </div>
    </div>

    <div
      class="py-2 px-3 gap-2 rounded-md bg-blue-100 border border-blue-200 text-xs flex items-center"
      v-if="is_show_send_friend_request"
    >
      <div class="text-blue-700 flex-grow flex flex-col gap-1 min-w-0 w-full">
        <p class="font-semibold">
          {{ $t('Gửi lời mời kết bạn') }}
        </p>
        <!-- <p class="pr-5">
          {{ $t('Khách hàng này chưa là bạn bè với Zalo') }}
        </p> -->
      </div>
      <button
        @click="$main.sendFriendRequest()"
        class="flex-shrink-0 font-medium py-2 px-4 rounded-md bg-blue-700 text-white"
      >
        {{ $t('Kết bạn') }}
      </button>
      <XMarkIcon
        class="size-6 cursor-pointer flex-shrink-0"
        @click="is_show_send_friend_request = false"
      />
    </div>
    <MainInput />
  </div>
</template>
<script setup lang="ts">
import PageAvatar from '@/components/Avatar/PageAvatar.vue'
import { useCommonStore, usePageStore } from '@/stores'
import { computed, onMounted, ref } from 'vue'

// import { XMarkIcon } from '@heroicons/vue/24/solid'
import { container } from 'tsyringe'
import { N4SerivceAppZaloPersonal } from '@/utils/api/N4Service/ZaloPersonal'
import type { MessageInfo } from '@/service/interface/app/message'
import { loadingV2 } from '@/utils/decorator/Loading'
import { error } from '@/utils/decorator/Error'
import { Toast } from '@/utils/helper/Alert/Toast'
import { useI18n } from 'vue-i18n'
import type { IAlert } from '@/utils/helper/Alert/type'
import MessageList from '@/views/ChatWarper/Chat/CenterContent/MessageList.vue'
import type { ConversationInfo } from '@/service/interface/app/conversation'
import { read_conversation } from '@/service/api/chatbox/n4-service'
import MainInput from '@/views/ChatWarper/Chat/CenterContent/InputChat/MainInput.vue'
import { XMarkIcon } from '@heroicons/vue/24/outline'
import type { OwnerShipInfo } from '@/service/interface/app/billing'
import { read_os } from '@/service/api/chatbox/billing'

const $props = withDefaults(
  defineProps<{
    /** id page hiện tại */
    actual_page_id?: string
    /** client id của page hiện tại */
    actual_client_id?: string
    /** id tổ chức */
    org_id?: string
    /** id tin nhắn */
    message_id?: string
    /** id khách hàng */
    client_id?: string
  }>(),
  {}
)

// const pageStore = usePageStore()
const commonStore = useCommonStore()
const $toast = container.resolve(Toast)
const { t: $t } = useI18n()

/** ẩn hiện nút gửi lời mời kết bạn */
const is_show_send_friend_request = ref(true)

/**id trang được chọn */
const selected_page_id = ref<string>()

/**dữ liệu của trang được chọn */
const selected_page_info = computed(
  () =>
    zlp_oss.value?.find(zlp_os => zlp_os?.page_id === selected_page_id.value)
      ?.page_info
)

/** dữ liệu hội thoại của khách(số đã nhắn trong tin) với trang zalo được chọn */
const conversation = ref<ConversationInfo>()

/** danh sách các trang zalo của tổ chức hiện tại */
const zlp_oss = ref<OwnerShipInfo[]>()

class CustomToast extends Toast implements IAlert {
  public error(message: any): void {
    return super.error($t('Số điện thoại không chính xác'))
  }
}

class NoneToast extends Toast implements IAlert {
  public error(message: any): void {
    // chỉ log ra chứ không hiển thị lên màn hình
    console.log($t('Số điện thoại không chính xác'))
    return
  }
}

class Main {
  /**
   * @param API gọi API
   */
  constructor(
    private readonly API = container.resolve(N4SerivceAppZaloPersonal)
  ) {}

  /**gửi lời mời kết bạn */
  @loadingV2(commonStore, 'is_loading_full_screen')
  @error(new CustomToast())
  async sendFriendRequest() {
    // trang bị mất kết nối không
    if (this.isDiconnect()) return

    // nếu chưa chọn id trang thì dừng
    if (
      !selected_page_id.value ||
      !$props.actual_page_id ||
      !$props.actual_client_id
    )
      return

    // gửi kết bạn
    const RES = await this.API.sendFriendRequest(
      selected_page_id.value,
      $props.actual_page_id,
      $props.actual_client_id,
      $props.message_id
    )

    // đã kết bạn
    if (RES?.is_accept_friend_request)
      return $toast.error($t('Đã là bạn bè rồi'))

    // thông báo thành công
    $toast.success($t('Đã gửi lời mời kết bạn'))
  }

  /** kiểm tra xem trang zalo có bị mất kết nối không */
  isDiconnect(): boolean {
    // trang bị mất kết nối không
    if (selected_page_info.value?.is_disconnected) {
      $toast.error($t('Trang zalo bạn chọn đang bị mất kết nối'))
      return true
    }
    return false
  }

  /** lấy dữ liệu hội thoại */
  @loadingV2(commonStore, 'is_loading_full_screen')
  @error(new NoneToast())
  async getConversation() {
    // trang bị mất kết nối không
    if (this.isDiconnect()) return

    // nếu chưa chọn id trang thì dừng
    if (!selected_page_id.value) return

    // nếu không có id nhân viên thì thôi
    if (!$props.client_id) return

    // lấy dữ liệu hội thoại
    conversation.value = await new Promise((resolve, reject) => {
      read_conversation(
        {
          page_id: [selected_page_id.value as string],
          client_id: $props.client_id,
          limit: 1,
        },
        (e, r) => {
          /** id của hội thoại đầu tiên */
          const FIRST_KEY_CONVERSATION = Object.keys(r?.conversation || {})?.[0]

          /** lấy ra hội thoại đầu tiên */
          const CONVERSATION = r?.conversation?.[FIRST_KEY_CONVERSATION]

          // nếu có thì trả về không thì báo lỗi
          if (CONVERSATION) {
            resolve(CONVERSATION)
          } else {
            reject()
          }
        }
      )
    })
  }

  /** lấy danh sách các page zalo của tổ chức hiện tại */
  @loadingV2(commonStore, 'is_loading_full_screen')
  @error(new CustomToast())
  async getZaloPage() {
    // nếu không có id tổ chức thì thôi
    if (!$props.org_id) return

    /**lấy danh sách trang của tổ chức hiện tại */
    const OSS = await read_os($props.org_id)

    /**lọc ra các trang zalo cá nhân */
    zlp_oss.value = OSS.filter(os => os?.page_info?.type === 'ZALO_PERSONAL')

    // mặc định chọn tài khoản zl đầu tiên
    selected_page_id.value = zlp_oss.value?.[0]?.page_id
  }
}
const $main = new Main()

onMounted(async () => {
  // lấy danh sách các page zalo của tổ chức hiện tại
  await $main.getZaloPage()

  // lấy dữ liệu hội thoại
  $main.getConversation()
})
</script>
