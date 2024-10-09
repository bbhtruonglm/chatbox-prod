<template>
  <div
    v-for="noti of list_noti"
    :class="
      getConfig(noti.noti_code).bg + ' ' + getConfig(noti.noti_code).border
    "
    class="item gap-1 shadow-lg flex justify-between"
  >
    <div
      :class="getConfig(noti.noti_code).text"
      class="flex flex-col gap-1 min-w-0"
    >
      <div class="text-sm font-semibold truncate">{{ noti.noti_title }}</div>
      <div class="text-xs truncate">{{ noti.noti_content }}</div>
    </div>
    <div class="flex-shrink-0">
      <button
        @click="getConfig(noti.noti_code).click(noti.noti_id)"
        :class="getConfig(noti.noti_code).btn"
        class="item text-white hover:brightness-90"
      >
        {{ getConfig(noti.noti_code).btn_title }}
      </button>
      <button
        @click="reaadNoti(noti.noti_id)"
        class="item text-sm font-medium"
      >
        {{ $t('v1.common.close') }}
      </button>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, watch } from 'vue'
import { useCommonStore, useOrgStore } from '@/stores'
import { get_noti, read_noti } from '@/service/api/chatbox/billing'
import { onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

import type { NotiInfo } from '@/service/interface/app/billing'
import { ToastSingleton } from '@/utils/helper/Alert/Toast'

const orgStore = useOrgStore()
const commonStore = useCommonStore()
const { t: $t } = useI18n()
const $router = useRouter()

/**dữ liệu thiết lập */
interface ISetting {
  /**màu nền */
  bg: string
  /**màu viền */
  border: string
  /**màu nút */
  btn: string
  /**tiêu đề nút */
  btn_title: string
  /**màu chữ */
  text: string
  /**hành động khi click vào nút */
  click: Function
}

/**thiết lập mặc định */
const DEFAULT_SETTING = {
  bg: 'bg-white',
  border: 'border-slate-200',
  btn: 'bg-slate-700',
  text: 'text-black',
  btn_title: $t('v1.view.main.dashboard.org.menu.more'),
  click: (noti_id?: string) => reaadNoti(noti_id, 'CHANGE_PAGE_OWNER'),
}
/**thiết lập UI của thông báo */
const SETTINGS: Record<string, ISetting> = {
  /**trang bị cướp */
  CHANGE_PAGE_OWNER: DEFAULT_SETTING,
  /**nạp tiền thành công */
  TOPUP_SUCCESS: {
    bg: 'bg-green-100',
    border: 'border-green-200',
    btn: 'bg-green-500',
    text: 'text-green-700',
    btn_title: $t('v1.common.close'),
    click: (noti_id?: string) => reaadNoti(noti_id, 'TOPUP_SUCCESS'),
  },
  /**đang chờ thanh toán */
  TOPUP_WAITING: {
    bg: 'bg-orange-100',
    border: 'border-orange-200',
    btn: 'bg-orange-500',
    text: 'text-orange-700',
    btn_title: $t('v1.view.main.dashboard.org.menu.pay'),
    click: (noti_id?: string) => reaadNoti(noti_id, 'TOPUP_WAITING'),
  },
  /**thanh toán thành công */
  PURCHASE_SUCCESS: {
    bg: 'bg-green-100',
    border: 'border-green-200',
    btn: 'bg-green-500',
    text: 'text-green-700',
    btn_title: $t('v1.common.close'),
    click: (noti_id?: string) => reaadNoti(noti_id, 'PURCHASE_SUCCESS'),
  },
  /**đã đá trang */
  REMOVE_PAGE: DEFAULT_SETTING,
  /**sắp đạt giới hạn AI */
  ALMOST_REACH_QUOTA_AI: {
    bg: 'bg-blue-100',
    border: 'border-blue-200',
    btn: 'bg-blue-500',
    text: 'text-blue-700',
    btn_title: $t('v1.view.main.dashboard.org.menu.more'),
    click: (noti_id?: string) => reaadNoti(noti_id, 'ALMOST_REACH_QUOTA_AI'),
  },
  /**sắp hết hạn gói */
  ALMOST_EXPIRED_PACKAGE: {
    bg: 'bg-red-100',
    border: 'border-red-200',
    btn: 'bg-red-500',
    text: 'text-red-700',
    btn_title: $t('v1.view.main.dashboard.org.menu.extend'),
    click: (noti_id?: string) => reaadNoti(noti_id, 'ALMOST_EXPIRED_PACKAGE'),
  },
}

/**danh sách các thông báo mới */
const list_noti = ref<NotiInfo[]>([])
/**loading */
const is_loading = ref(false)

// đọc danh sách thông báo khi load component
onMounted(getNoti)

watch(() => orgStore.selected_org_id, getNoti)

/**lấy dữ liệu thiết lập */
function getConfig(code?: string): ISetting {
  // nếu không có code thì trả về mặc định
  if (!code) return DEFAULT_SETTING

  // trả về thiết lập theo code
  return SETTINGS?.[code] || DEFAULT_SETTING
}
/**lấy xx thông báo mới nhất */
async function getNoti() {
  try {
    // nếu không có id tổ chức thì thôi
    if (!orgStore.selected_org_id) return

    // ghi đè thống báo cũ nếu có khi lấy dữ liệu
    list_noti.value = await get_noti(
      orgStore.selected_org_id,
      3,
      {
        $exists: false,
      },
      [
        'ALMOST_EXPIRED_PACKAGE',
        'TOPUP_WAITING',
        'ALMOST_REACH_QUOTA_AI',
        'CHANGE_PAGE_OWNER',
      ]
    )
  } catch (e) {
    // thông báo lỗi
    ToastSingleton.getInst().error(e)
  }
}
/**đọc thông báo */
async function reaadNoti(noti_id?: string, code?: string) {
  try {
    // nếu đang loading thì thôi
    if (is_loading.value) return

    // mở loading
    is_loading.value = true

    // đánh dấu noti là đã đọc
    await read_noti(orgStore.selected_org_id, noti_id)

    // giảm số thông báo
    orgStore.count_noti--

    switch (code) {
      case 'CHANGE_PAGE_OWNER':
        $router.push('/dashboard/org/pay/info')
        break
      case 'TOPUP_SUCCESS':
        $router.push('/dashboard/org/pay/info')
        break
      case 'TOPUP_WAITING':
        $router.push('/dashboard/org/pay/info')
        break
      case 'PURCHASE_SUCCESS':
        $router.push('/dashboard/org/pay/info')
        break
      case 'ALMOST_REACH_QUOTA_AI':
        $router.push('/dashboard/org/pay/info')
        break
      case 'ALMOST_EXPIRED_PACKAGE':
        $router.push('/dashboard/org/pay/info')
        break

      // code không cần xử lý gì thì tắt luôn
      default:
        await getNoti()
        break
    }
  } catch (e) {
  } finally {
    // tắt loading
    is_loading.value = false
  }
}
</script>
<style lang="scss" scoped>
.item {
  @apply py-2 px-4 rounded-md;
}
</style>
