<template>
  <div
    class="bg-gray-100 rounded-xl p-2 flex flex-col relative w-full h-full gap-2"
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
      class="!h-[70dvh] overflow-auto"
      :conversation="FAKE_CONVERSATION"
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

class CustomToast extends Toast implements IAlert {
  public error(message: any): void {
    return super.error($t('Số điện thoại không chính xác'))
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
    if (selected_page_info.value?.is_disconnected)
      return $toast.error($t('Trang zalo bạn chọn đang bị mất kết nối'))

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
}
const $main = new Main()

// mặc định chọn tài khoản zl đầu tiên
onMounted(() => {
  selected_page_id.value = pageStore.zlp_oss?.[0]?.page_id

  // TODO nếu page hiện tại là zalo, thì mặc định chọn page hiện tại
})

const FAKE_CONVERSATION: any = {
  fb_client_id: '8723389538644201700',
  fb_page_id: '1789151085819210303',
  __v: 0,
  block_client: false,
  conversation_type: 'CHAT',
  createdAt: '2025-03-03T10:54:56.779Z',
  is_have_fb_inbox: false,
  is_have_fb_post: false,
  is_re_assign: false,
  is_spam_fb: false,
  label_id: [],
  last_message: 'image',
  last_message_id: '68400fd1ae59f49b8f573723',
  last_message_time: 1749028817144,
  last_message_type: 'page',
  list_fb_post_id: [],
  platform_type: 'ZALO_PERSONAL',
  staff_read: {
    cfd89fe8645141c39bffbe16e1a21c98: 1741316503249,
    '0454522c984e496786287b27b4bcd0af': 1749034778379,
    '981064689416577': 1747881211033,
    '91393716bc15451497e6c8b0643bf522': 1749037204464,
    '44f8c06fe4b54b7dadfa38a41ad83582': 1748054535379,
  },
  unread_message_amount: 0,
  updatedAt: '2025-06-04T11:40:04.465Z',
  client_avatar:
    'https://s120-ava-talk.zadn.vn/c/6/6/e/22/120/2175f76db375885f62d770cde39c91b5.jpg',
  client_name: 'Minh Lươn',
  is_allow_agent: false,
  client_phone: '84333776915',
  emotion: 'happy',
}
</script>
