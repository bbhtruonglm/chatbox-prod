<template>
  <div
    class="bg-gray-100 rounded-xl p-2 flex flex-col relative w-full max-h-[80dvh] overflow-hidden gap-2"
  >
    <div
      class="bg-white py-2 px-3 rounded-lg gap-2 flex items-center text-sm text-slate-700"
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
      >
        <option
          v-for="zlp_os of pageStore.zlp_oss"
          :value="zlp_os?.page_id"
        >
          {{ zlp_os?.page_info?.name }}
        </option>
      </select>
    </div>
    <MessageList
      v-if="conversation"
      class="h-full"
      :conversation="conversation"
    />
    <div
      class="py-2 px-3 gap-2 rounded-md bg-blue-100 border border-blue-200 text-xs flex items-center"
    >
      <div class="text-blue-700 flex-grow flex flex-col gap-1">
        <div class="font-semibold">
          {{ $t('Gửi lời mời kết bạn') }}
        </div>
        <!-- {{ $t('Khách hàng này chưa là bạn bè với Zalo') }} -->
      </div>
      <button
        @click="$main.sendFriendRequest()"
        class="tetx-sm font-medium py-2 px-4 rounded-md bg-blue-700 text-white"
      >
        {{ $t('Kết bạn') }}
      </button>
      <!-- <XMarkIcon class="size-6 cursor-pointer" /> -->
    </div>
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

const $props = withDefaults(
  defineProps<{
    /**dữ liệu tin nhắn */
    message?: MessageInfo
  }>(),
  {}
)

const pageStore = usePageStore()
const commonStore = useCommonStore()
const $toast = container.resolve(Toast)
const { t: $t } = useI18n()

/**id trang được chọn */
const selected_page_id = ref<string>()

/**dữ liệu của trang được chọn */
const selected_page_info = computed(
  () =>
    pageStore.zlp_oss?.find(
      zlp_os => zlp_os?.page_id === selected_page_id.value
    )?.page_info
)

/** dữ liệu hội thoại của khách(số đã nhắn trong tin) với trang zalo được chọn */
const conversation = ref<ConversationInfo>()

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
    if (!selected_page_id.value || !$props.message) return

    // gửi kết bạn
    const RES = await this.API.sendFriendRequest(
      selected_page_id.value,
      $props.message?._id,
      $props.message?.fb_page_id,
      $props.message?.fb_client_id
    )

    // đã kết bạn
    if (RES?.is_accept_friend_request)
      return $toast.error($t('Đã là bạn bè rồi'))

    // thông báo thành công
    $toast.success($t('Đã gửi lời mời kết bạn'))
  }

  /** lấy id của khách */
  async getClientId() {
    // trang bị mất kết nối không
    if (this.isDiconnect()) return

    // nếu chưa chọn id trang thì dừng
    if (!selected_page_id.value || !$props.message) return

    // lấy id của khách với có số điện thoại trong tin nhắn và đã nhắn cho page
    const RES = await this.API.getClientId(
      selected_page_id.value,
      $props.message?._id
    )

    return RES
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
    if (!selected_page_id.value || !$props.message) return

    /** id của khách với số điện thoại trong tin nhắn */
    const CLIENT_ID = await this.getClientId()

    // nếu không có id nhân viên thì thôi
    if (!CLIENT_ID) return

    // lấy dữ liệu hội thoại
    conversation.value = await new Promise((resolve, reject) => {
      read_conversation(
        {
          page_id: [selected_page_id.value as string],
          client_id: CLIENT_ID,
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
}
const $main = new Main()

// mặc định chọn tài khoản zl đầu tiên
onMounted(() => {
  selected_page_id.value = pageStore.zlp_oss?.[0]?.page_id

  // TODO nếu page hiện tại là zalo, thì mặc định chọn page hiện tại


  // lấy dữ liệu hội thoại
  $main.getConversation()
})
</script>
