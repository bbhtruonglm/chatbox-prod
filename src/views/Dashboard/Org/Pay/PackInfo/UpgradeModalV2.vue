<template>
  <Teleport
    to="body"
    v-if="IS_OPEN"
  >
    <Transition
      enter-active-class="transition ease-in-out duration-500"
      leave-active-class="transition ease-in-out duration-500"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0"
    >
      <div
        @click="toggleModal"
        class="absolute top-0 left-0 w-screen h-screen bg-black/10 z-20 shadow-lg"
      >
        <div
          @click.stop
          class="w-full h-full p-3"
        >
          <div
            class="rounded-lg bg-slate-50 w-full flex flex-col shadow-lg gap-10 h-full"
          >
            <div
              class="flex flex-col w-full justify-between items-center p-5 pb-0 gap-1"
            >
              <div class="flex w-full justify-between items-center gap-5">
                <img
                  :src="COMMON_STORE.partner?.logo?.full"
                  class="h-8"
                />
                <div class="px-3 text-4xl font-bold flex-shrink-0 text-center">
                  {{ $t('v1.view.main.dashboard.org.pay.upgrade_v2.title') }}
                </div>
                <div
                  @click="toggleModal"
                  class="rounded-lg cursor-pointer hover:bg-slate-200"
                >
                  <XMarkIcon class="size-10" />
                </div>
              </div>
              <div class="px-3 font-medium flex-shrink-0 text-center">
                {{
                  $t(
                    'v1.view.main.dashboard.org.pay.upgrade_v2.choose_team_plan'
                  )
                }}
              </div>
            </div>
            <div
              class="flex flex-col bg-white overflow-hidden flex-grow min-h-0 h-full rounded-b-lg"
            >
              <HeaderCustom />

              <div
                class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 py-12 px-5 overflow-auto h-full"
              >
                <PricingCard
                  v-for="(pkg, index) in PACKAGES"
                  :key="pkg.title"
                  v-bind="pkg"
                  :selected="SELECTED_INDEX === index"
                  :onSelect="() => handleSelect(index)"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
<script setup lang="ts">
import { useCommonStore, useOrgStore } from '@/stores'
import { ref } from 'vue'
import { purchase_package, read_wallet } from '@/service/api/chatbox/billing'
import { toast, toastError } from '@/service/helper/alert'
import { useI18n } from 'vue-i18n'

import { XMarkIcon } from '@heroicons/vue/24/solid'

import PricingCard from '@/components/PricingCard/PricingCard.vue'

import HeaderCustom from '@/views/Dashboard/Org/Pay/PackInfo/Header/HeaderCustom.vue'
/** Lấy giá trị trong store */
const COMMON_STORE = useCommonStore()
/** Lấy giá trị org */
const orgStore = useOrgStore()
/** Hàm dịch */
const { t: $t } = useI18n()
/** Hàm click */
function handleClick(pkg_title: string) {
  // alert(`Bạn chọn gói ${pkg_title}`)
  console.log('title', pkg_title)
}
/** tab đang được chọn */
const SELECTED_INDEX = ref(0)
/** Hàm thay đổi index */
function handleSelect(index: number) {
  SELECTED_INDEX.value = index
}
/** Mock các gói */
const PACKAGES = [
  {
    title: 'Free',
    price: '$0',
    subtitle:
      'Miễn phí vĩnh viễn, cho đến khi bạn thấy hiệu quả mới cần nâng cấp',
    ctaText: 'Bắt đầu miễn phí',
    ctaOnClick: () => handleClick('Free'),
    description: 'For individuals and small teams getting started with CRM.',
    sections: [
      {
        heading: 'LIMITS',
        items: [
          { text: '1,000 Active contacts & deals', enabled: true },
          { text: '1 Custom dashboard', enabled: true },
          { text: '5 Columns per board max', enabled: true },
          { text: 'Custom automation', enabled: false },
          { text: 'Guest', enabled: false },
        ],
      },
      {
        heading: 'ADVANCES',
        items: [
          { text: 'Centralized comms hub', enabled: true },
          { text: 'iOS & Android apps', enabled: true },
          { text: 'Send mass emails', enabled: false },
          { text: 'Email sequences', enabled: false },
          { text: 'Quotes & invoices', enabled: false },
        ],
      },
    ],
    aiFeatures: [
      { text: 'AI Automation', enabled: false },
      { text: 'AI Writing', enabled: false },
      { text: 'AI Research', enabled: false },
    ],
  },
  {
    title: 'Lite',
    price: '$0',
    subtitle:
      'Miễn phí vĩnh viễn, cho đến khi bạn thấy hiệu quả mới cần nâng cấp',
    ctaText: 'Dùng thử 7 ngày miễn phí',
    ctaOnClick: () => handleClick('Free'),
    description: 'For growing business teams that need the essential toolkit.',
    sections: [
      {
        heading: 'LIMITS',
        items: [
          { text: '1,000 Active contacts & deals', enabled: true },
          { text: '1 Custom dashboard', enabled: true },
          { text: '5 Columns per board max', enabled: true },
          { text: 'Custom automation', enabled: false },
          { text: 'Guest', enabled: false },
        ],
      },
      {
        heading: 'ADVANCES',
        items: [
          { text: 'Centralized comms hub', enabled: true },
          { text: 'iOS & Android apps', enabled: true },
          { text: 'Send mass emails', enabled: false },
          { text: 'Email sequences', enabled: false },
          { text: 'Quotes & invoices', enabled: false },
        ],
      },
    ],
    aiFeatures: [
      { text: 'AI Automation', enabled: true },
      { text: 'AI Writing', enabled: true },
      { text: 'AI Research', enabled: false },
    ],
  },
  {
    title: 'Pro',
    price: '$20',
    subtitle:
      'Miễn phí vĩnh viễn, cho đến khi bạn thấy hiệu quả mới cần nâng cấp',
    ctaText: 'Dùng thử miễn phí 7 ngày',
    ctaOnClick: () => handleClick('Free'),
    is_popular: true,
    description: 'For growing teams ready to scale with advanced tools.',
    sections: [
      {
        heading: 'LIMITS',
        items: [
          { text: '1,000 Active contacts & deals', enabled: true },
          { text: '1 Custom dashboard', enabled: true },
          { text: '5 Columns per board max', enabled: true },
          { text: 'Custom automation', enabled: false },
          { text: 'Guest', enabled: false },
        ],
      },
      {
        heading: 'ADVANCES',
        items: [
          { text: 'Centralized comms hub', enabled: true },
          { text: 'iOS & Android apps', enabled: true },
          { text: 'Send mass emails', enabled: false },
          { text: 'Email sequences', enabled: false },
          { text: 'Quotes & invoices', enabled: false },
        ],
      },
    ],
    aiFeatures: [
      { text: 'AI Automation', enabled: true },
      { text: 'AI Writing', enabled: true },
      { text: 'AI Research', enabled: true },
    ],
  },
  {
    title: 'Enterprise',
    price: '$0',
    subtitle:
      'Miễn phí vĩnh viễn, cho đến khi bạn thấy hiệu quả mới cần nâng cấp',
    ctaText: 'Tư vấn miễn phí',
    ctaOnClick: () => handleClick('Free'),

    description: 'Gói dành cho các Tổ chức, Doanh nghiệp lớn và Tập đoàn.',
    sections: [
      {
        heading: 'LIMITS',
        items: [
          { text: '1,000 Active contacts & deals', enabled: true },
          { text: '1 Custom dashboard', enabled: true },
          { text: '5 Columns per board max', enabled: true },
          { text: 'Custom automation', enabled: false },
          { text: 'Guest', enabled: false },
        ],
      },
      {
        heading: 'ADVANCES',
        items: [
          { text: 'Centralized comms hub', enabled: true },
          { text: 'iOS & Android apps', enabled: true },
          { text: 'Send mass emails', enabled: false },
          { text: 'Email sequences', enabled: false },
          { text: 'Quotes & invoices', enabled: false },
        ],
      },
    ],
    aiFeatures: [
      { text: 'AI Automation', enabled: true },
      { text: 'AI Writing', enabled: true },
      { text: 'AI Research', enabled: true },
    ],
  },
]

/**ẩn hiện modal */
const IS_OPEN = ref(false)
/**mua gói Pro 1 năm */
const IS_FULL_YEAR = ref(false)

/**ẩn hiện modal */
function toggleModal() {
  IS_OPEN.value = !IS_OPEN.value
}

/**kích hoạt gói dùng thử hoặc gói pro */
async function activeTrialOrProPack(pack: 'LITE' | 'PRO' | 'BUSINESS') {
  /**  nếu chưa chọn org thì không làm gì */
  if (!orgStore.selected_org_id || orgStore.is_loading) return

  /**  nếu đã mua gói lite thì không làm gì */
  if (orgStore.isLitePack() && pack === 'LITE') return
  /**  nếu đã mua gói thì không làm gì */
  if (orgStore.isProPack() && pack === 'PRO') return
  /**  nếu đã mua gói doanh nghiệp thì không làm gì */
  if (orgStore.isBusinessPack() && pack === 'BUSINESS') return

  /**  kích hoạt loading */
  orgStore.is_loading = true

  try {
    /**
     * tính toán gói cần mua
     * - nếu chưa mua bao giờ mà mua gói PRO, thì cho dùng thử trước
     * - nếu đã dùng thử rồi thì mua đúng
     */
    const PACKAGE = !orgStore.hasTrial() && pack === 'PRO' ? 'TRIAL' : pack

    /**dữ liệu của ví */
    const WALLET = await read_wallet(orgStore.selected_org_id)

    /**  nếu không có ví thì thông báo lỗi */
    if (!WALLET?.wallet_id)
      throw $t('v1.view.main.dashboard.org.pay.recharge.wrong_wallet_id')

    /**số tháng mua */
    const MONTHS = IS_FULL_YEAR.value ? 12 : 1

    /**  yêu cầu mua gói */
    await purchase_package(
      orgStore.selected_org_id,
      WALLET?.wallet_id,
      PACKAGE,
      MONTHS
    )

    /**  thông báo mua gói thành công */
    toast('success', $t('v1.view.main.dashboard.org.pay.upgrade.success'))

    /**  chờ 1s */
    await new Promise(cb => setTimeout(cb, 1000))

    /**  reload lại trang */
    window.location.reload()
  } catch (e) {
    if (e === 'WALLET.NOT_ENOUGH_MONEY')
      toastError($t('v1.view.main.dashboard.org.pay.upgrade.not_enough_money'))
    /**  nếu có lỗi thì hiện thông báo lỗi */ else toastError(e)
  }

  /**  tắt loading */
  orgStore.is_loading = false
}
/**hạ xuống gói free */
function downgradeFreePack() {}

defineExpose({ toggleModal })
</script>
<style scoped lang="scss">
.item {
  @apply bg-slate-100 p-2 rounded-lg flex flex-col justify-between gap-8;
}
.btn {
  @apply py-2 px-4 rounded-md hover:brightness-90 text-sm font-semibold;
}
</style>
