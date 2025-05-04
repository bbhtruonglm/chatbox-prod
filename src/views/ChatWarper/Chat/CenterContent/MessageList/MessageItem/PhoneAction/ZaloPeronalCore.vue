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

const $props = withDefaults(
  defineProps<{
    /**dữ liệu tin nhắn */
    message: MessageInfo
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
    if (!selected_page_id.value) return

    // gửi kết bạn
    const RES = await this.API.sendFriendRequest(
      selected_page_id.value,
      $props.message?._id
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
</script>
