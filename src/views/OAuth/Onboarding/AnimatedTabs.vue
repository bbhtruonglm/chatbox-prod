<template>
  <div class="w-full h-screen relative overflow-hidden p-10">
    <div class="w-full h-full relative py-10">
      <!-- Boxes -->
      <!-- <div
        v-for="(item, index) in items"
        :key="item.id"
        ref="el => boxRefs[index] = el"
        class="absolute flex h-full items-center justify-center text-2xl border bg-gray-200 transition-all duration-500"
        :style="item.style"
        ></div> -->
      <!-- v-show="
          ACTIVE_INDEX === 0 || ['Business', 'Enterprise'].includes(pkg.title)
        " -->
      <PricingCard
        v-for="(pkg, index) in PACKAGES"
        :key="pkg.title"
        v-bind="pkg"
        :selected="SELECTED_INDEX === pkg.title"
        :onSelect="() => handleSelect(pkg.title)"
        :active_tab="ACTIVE_INDEX"
        class="absolute h-full py-10"
        ref="el => boxRefs[index] = el"
      />
      <!-- :class="[
          'absolute',
          // layout
          ACTIVE_INDEX === 0
            ? ''
            : pkg.title === 'Business'
            ? 'col-span-1'
            : pkg.title === 'Enterprise'
            ? 'col-span-3'
            : '',
        ]" -->
      <button
        @click="toggleTab"
        class="absolute bottom-5 right-40 px-4 py-2 rounded text-white bg-blue-500"
      >
        {{ 'Tab1' }}
      </button>
      <button
        @click="toggleTab"
        class="absolute bottom-5 right-5 px-4 py-2 rounded text-white bg-blue-500"
      >
        {{ 'Tab2' }}
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import PricingCard from '@/components/PricingCard/PricingCard.vue'
import { currency } from '@/service/helper/format'
import Cookies from 'js-cookie'
import { reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'

const ACTIVE_INDEX = ref(1)

/** Hàm dịch */
const { t: $t } = useI18n()

/** Lấy locale từ cookies */
const LOCALE = Cookies.get('locale') || 'en'

// Gap = 1.5rem = 24px
const GAP = 24

/** tab đang được chọn */
const SELECTED_INDEX = ref('Lite')
/** Hàm thay đổi index */
function handleSelect(index: string) {
  /** Nếu enterpise thì chuyển sang tab 1 */
  if (index === 'Enterprise') {
    // ACTIVE_INDEX.value = 2
    setTab2()
    ACTIVE_INDEX.value = 2
  }
  /**Chọn gói */
  SELECTED_INDEX.value = index
}
/** Hàm click */
function handleClick(pkg_title: string) {
  // alert(`Bạn chọn gói ${pkg_title}`)
  console.log('title', pkg_title)
}
// Container width 100% → dùng % để tính cho responsive
/** Mock các gói */
const PACKAGES = [
  {
    title: 'Lite',
    price: LOCALE === 'en' ? '$8' : currency(199000) + 'đ',
    is_sale_off: $t('v1.view.onboarding.is_sale_off'),
    original_price: LOCALE === 'en' ? '$10' : currency(270000) + 'đ',
    code: 'BBH',
    discount_percent: '40%',
    discount: $t('v1.view.onboarding.discount'),
    subtitle: $t('v1.view.onboarding.lite_subtitle'),
    ctaText: $t('v1.view.onboarding.use_trial_7_day'),
    ctaOnClick: () => handleClick('Free'),
    description: $t('v1.view.onboarding.lite_description'),
    style: {},
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
    title: 'Pro',
    price: LOCALE === 'en' ? '$18' : currency(480000) + 'đ',
    is_sale_off: $t('v1.view.onboarding.is_sale_off'),
    original_price: LOCALE === 'en' ? '$20' : currency(540000) + 'đ',
    code: 'BBH',
    discount_percent: '40%',
    discount: $t('v1.view.onboarding.discount'),
    subtitle: $t('v1.view.onboarding.pro_subtitle'),
    ctaText: $t('v1.view.onboarding.use_trial_7_day'),
    ctaOnClick: () => handleClick('Lite'),
    style: {},
    description: $t('v1.view.onboarding.pro_description'),
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
    title: 'Business',
    price: LOCALE === 'en' ? '$90' : currency(2200000) + 'đ',
    is_sale_off: $t('v1.view.onboarding.is_sale_off'),
    original_price: LOCALE === 'en' ? '$99' : currency(2600000) + 'đ',
    code: 'BBH',
    discount_percent: '40%',
    discount: $t('v1.view.onboarding.discount'),
    subtitle: $t('v1.view.onboarding.business_subtitle'),
    ctaText: $t('v1.view.onboarding.use_trial_7_day'),
    ctaOnClick: () => handleClick('Pro'),
    is_popular: true,
    style: {},
    description: $t('v1.view.onboarding.business_description'),
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

    subtitle: $t('v1.view.onboarding.enterprise_subtitle'),
    ctaText: $t('v1.view.onboarding.free_consultation'),
    ctaOnClick: () => handleClick('Enterprise'),
    style: {},
    description: $t('v1.view.onboarding.enterprise_description'),
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

const boxRefs = ref<Array<HTMLElement | null>>([])

const containerWidth = 100 // tính % cho responsive

function setTab1() {
  const width = (containerWidth - 3 * (GAP / 16)) / 4 // 4 phần tử, GAP tính rem → % approx
  PACKAGES[0].style = {
    top: '0%',
    left: '0%',
    width: `${width}%`,
    height: '50%',
    opacity: 1,
    transform: 'translateX(0)',
  }
  PACKAGES[1].style = {
    top: '0%',
    left: `${width + GAP / 16}%`,
    width: `${width}%`,
    height: '50%',
    opacity: 1,
    transform: 'translateX(0)',
  }
  PACKAGES[2].style = {
    top: '0%',
    left: `${2 * (width + GAP / 16)}%`,
    width: `${width}%`,
    height: '50%',
    opacity: 1,
    transform: 'translateX(0)',
  }
  PACKAGES[3].style = {
    top: '0%',
    left: `${3 * (width + GAP / 16)}%`,
    width: `${width}%`,
    height: '50%',
    opacity: 1,
    transform: 'translateX(0)',
  }
}

function setTab2() {
  // C = 1/4, D = 3/4, gap giữa C-D = GAP
  const widthC = (containerWidth - GAP / 16) * 0.25
  const widthD = (containerWidth - GAP / 16) * 0.75
  PACKAGES[0].style = {
    top: '0%',
    left: `-${widthC}%`,
    width: `${widthC}%`,
    height: '50%',
    opacity: 0,
    transform: 'translateX(-100%)',
  }
  PACKAGES[1].style = {
    top: '0%',
    left: `-${widthC}%`,
    width: `${widthC}%`,
    height: '50%',
    opacity: 0,
    transform: 'translateX(-100%)',
  }
  PACKAGES[2].style = {
    top: '0%',
    left: '0%',
    width: `${widthC}%`,
    height: '50%',
    opacity: 1,
    transform: 'translateX(0)',
  }
  PACKAGES[3].style = {
    top: '0%',
    left: `${widthC + GAP / 16}%`,
    width: `${widthD}%`,
    height: '50%',
    opacity: 1,
    transform: 'translateX(0)',
  }
}

function toggleTab() {
  if (ACTIVE_INDEX.value === 1) {
    setTab2()
    SELECTED_INDEX.value = 'Enterprise'
  } else {
    setTab1()
    SELECTED_INDEX.value = 'Lite'
  }
  ACTIVE_INDEX.value = ACTIVE_INDEX.value === 1 ? 2 : 1
}

/** Lấy locale từ cookies */
const locale = Cookies.get('locale') || 'en'

// Initialize Tab1
setTab1()
</script>

<style scoped>
.absolute {
  transition: all 0.5s ease;
}
</style>
