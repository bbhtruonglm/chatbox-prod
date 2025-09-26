<template>
  <Teleport to="body">
    <!-- v-if="IS_OPEN" -->
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
                <div class="w-32"></div>
              </div>
              <div class="px-3 font-medium flex-shrink-0 text-center">
                {{
                  $t(
                    'v1.view.main.dashboard.org.pay.upgrade_v2.choose_team_plan'
                  )
                }}
              </div>
            </div>
            <div class="flex flex-col bg-white rounded-b-lg overflow-hidden">
              <HeaderCustom
                :tabs="TABS"
                :active_index="ACTIVE_INDEX"
                @change-tab="handleTabChange"
              />
              <div
                class="overflow-hidden flex flex-col flex-grow min-h-0 h-full overflow-y-auto gap-5 p-5 pt-12 border-b"
              >
                <div
                  :class="[
                    'gap-6',
                    ACTIVE_INDEX === 0
                      ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
                      : 'grid grid-cols-4', // grid 4 cột nhưng ta sẽ chỉnh col-span từng item
                  ]"
                >
                  <PricingCard
                    v-for="(pkg, index) in FILTERED_PACKAGES"
                    :key="pkg.title"
                    v-bind="pkg"
                    :selected="SELECTED_INDEX === pkg.title"
                    :onSelect="() => handleSelect(pkg.title)"
                    :active_tab="ACTIVE_INDEX"
                    :class="[
                      ACTIVE_INDEX === 0
                        ? '' // tab All plans: theo grid mặc định
                        : index === 0
                        ? 'col-span-1' // gói đầu chiếm 1 cột
                        : 'col-span-3', // gói thứ 2 chiếm 3 cột
                    ]"
                  />
                </div>
                <div class="">
                  <ComparePlans
                    :data="COMPARE_DATA"
                    :selected_plan_index="SELECTED_INDEX"
                    :selected_row="SELECTED_ROW"
                    @rowSelect="handleRowSelect"
                  />
                </div>
                <div>
                  <FAQ />
                </div>
              </div>
              <div class="flex px-8 py-3 w-full justify-between">
                <div class="flex items-center justify-center gap-5">
                  <img
                    src="@/assets/imgs/visa.png"
                    alt="Verified by Visa"
                    class="h-8 object-contain grayscale"
                  />
                  <img
                    src="@/assets/imgs/mastercard.png"
                    alt="MasterCard SecureCode"
                    class="h-8 object-contain grayscale"
                  />
                  <img
                    src="@/assets/imgs/secure.png"
                    alt="Secure SSL Encryption"
                    class="h-8 object-contain grayscale"
                  />
                </div>
                <div
                  @click="submitPackage"
                  class="flex items-center cursor-pointer bg-green-500 text-white gap-3 px-10 py-3 rounded-md"
                >
                  {{ $t('v1.view.onboarding.continue') }}
                  <span><ArrowRightIcon class="size-5" /></span>
                </div>
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
import { computed, ref } from 'vue'
import { purchase_package, read_wallet } from '@/service/api/chatbox/billing'
import { toast, toastError } from '@/service/helper/alert'
import { useI18n } from 'vue-i18n'
import {
  CheckCircleIcon,
  CheckIcon,
  ChevronUpIcon,
  ArrowRightIcon,
} from '@heroicons/vue/24/solid'

import { XMarkIcon } from '@heroicons/vue/24/solid'

import PricingCard from '@/components/PricingCard/PricingCard.vue'
import FAQ from './FAQ.vue'

import HeaderCustom from '@/views/Dashboard/Org/Pay/PackInfo/Header/HeaderCustom.vue'

import ComparePlans from '@/views/Dashboard/Org/Pay/PackInfo/Header/ComparePlans.vue'

/** Lấy giá trị trong store */
const COMMON_STORE = useCommonStore()
/** Lấy giá trị org */
const orgStore = useOrgStore()
/** Hàm dịch */
const { t: $t } = useI18n()

const props = defineProps<{
  selected_preference: string | null
}>()

/** Hàm click */
function handleClick(pkg_title: string) {
  // alert(`Bạn chọn gói ${pkg_title}`)
  console.log('title', pkg_title)
}
/** Hàm emit */
const $emit = defineEmits<{
  (e: 'submit'): void
}>()

const submitPackage = () => {
  $emit('submit')
}

/** tab đang được chọn */
const SELECTED_INDEX = ref('Free')
/** Hàm thay đổi index */
function handleSelect(index: string) {
  SELECTED_INDEX.value = index
}
/** Khai báo các tab đăng ký */
const TABS = ref(['All plans', 'Business & Enterprise'])
/** Tab active hiện tại */
const ACTIVE_INDEX = ref(0)
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
/** Filter list package
 * All plans hiện all
 * Business chỉ hiện pro và business
 */
const FILTERED_PACKAGES = computed(() => {
  if (ACTIVE_INDEX.value === 0) {
    /** Tab 0 = All plans */
    return PACKAGES
  } else {
    /** Tab 1 = Business & Enterprise */
    return PACKAGES.filter(pkg => ['Pro', 'Enterprise'].includes(pkg.title))
  }
})
/** Hàm chuyển đổi tab */
function handleTabChange(index: number) {
  ACTIVE_INDEX.value = index
}
/** selected rơ */
const SELECTED_ROW = ref<{ sectionIndex: number; rowIndex: number } | null>(
  null
)
/** hàm selected row */
function handleRowSelect(payload: { sectionIndex: number; rowIndex: number }) {
  SELECTED_ROW.value = payload
}

/** Dữ liệu mock data compare plans và features */
const COMPARE_DATA = {
  title: 'Compare plans and features',
  plans: [
    { key: 'free', name: 'Free' },
    { key: 'lite', name: 'Lite' },
    { key: 'pro', name: 'Pro' },
    { key: 'enterprise', name: 'Enterprise' },
  ],
  sections: [
    {
      title: 'Essentials',
      features: [
        {
          name: 'Active contacts & deals (limit)',
          values: {
            free: '1,000',
            lite: '10,000',
            pro: 'Unlimited',
            enterprise: '1,000',
          },
        },
        {
          name: 'Feature A',
          values: { free: true, lite: true, pro: true, enterprise: true },
        },
        {
          name: 'Feature B',
          values: { free: false, lite: false, pro: true, enterprise: true },
        },
      ],
    },
    {
      title: 'Essentials',
      features: [
        {
          name: 'Active contacts & deals (limit)',
          values: {
            free: '1,000',
            lite: '10,000',
            pro: 'Unlimited',
            enterprise: '1,000',
          },
        },
        {
          name: 'Feature A',
          values: { free: true, lite: true, pro: true, enterprise: true },
        },
        {
          name: 'Feature B',
          values: { free: false, lite: false, pro: true, enterprise: true },
        },
      ],
    },
    {
      title: 'Essentials',
      features: [
        {
          name: 'Active contacts & deals (limit)',
          values: {
            free: '1,000',
            lite: '10,000',
            pro: 'Unlimited',
            enterprise: '1,000',
          },
        },
        {
          name: 'Feature A',
          values: { free: true, lite: true, pro: true, enterprise: true },
        },
        {
          name: 'Feature B',
          values: { free: false, lite: false, pro: true, enterprise: true },
        },
      ],
    },
    {
      title: 'Retion AI',
      features: [
        {
          name: 'AI credits (monthly)',
          values: {
            free: '1,000',
            lite: '10,000',
            pro: 'Unlimited',
            enterprise: '1,000',
          },
        },
        {
          name: 'AI assistant',
          values: { free: true, lite: true, pro: true, enterprise: true },
        },
      ],
    },
    {
      title: 'Automation',
      features: [
        {
          name: 'Workflow automations',
          values: { free: false, lite: true, pro: true, enterprise: true },
        },
      ],
    },
  ],
}

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
