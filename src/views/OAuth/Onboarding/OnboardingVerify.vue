<template>
  <div
    class="flex max-full mx-auto overflow-hidden gap-2.5 flex-grow h-full min-h-0"
  >
    <!-- Left panel -->
    <aside
      class="w-96 p-5 gap-10 bg-white flex flex-col justify-between flex-grow min-h-0 h-full rounded-xl"
    >
      <div class="flex flex-col gap-10">
        <div
          :style="{
            backgroundImage: `url(${commonStore.partner?.logo?.full})`,
          }"
          class="h-7 w-full bg-contain bg-no-repeat bg-left flex-shrink-0"
        />

        <div class="flex flex-col gap-3">
          <h1 class="text-5xl leading-tight font-semibold flex gap-3">
            <span class="py-2">
              <ShieldCheckIcon class="h-16 w-12" />
            </span>
            {{ $t('v1.view.onboarding.verify_your_account') }}
          </h1>
        </div>
      </div>
    </aside>

    <!-- Right panel -->
    <main
      class="flex w-full flex-grow min-h-0 h-full gap-3 px-3 py-5 rounded-xl bg-white flex-col justify-between"
    >
      <div class="flex flex-col flex-grow min-h-0 h-full gap-8">
        <!-- Step header -->
        <div class="flex flex-col justify-between gap-3">
          <div>
            <h2 class="text-4xl font-bold">{{ STEP_TITLE }}</h2>
            <p class="font-medium">{{ STEP_DESCRIPTIONS }}</p>
          </div>
        </div>
        <!-- Verification content -->
        <div class="flex flex-col gap-5">
          <div class="flex flex-col gap-1 max-w-lg text-left">
            <label class="block text-gray-700 font-medium text-sm">
              {{ $t('v1.view.onboarding.phone') }}
            </label>
            <input
              :value="phone"
              type="text"
              :placeholder="$t('v1.view.onboarding.enter_phone')"
              class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              @input="handleInput"
            />
          </div>
          <div class="flex gap-5">
            <button
              :class="[
                'px-10 py-3 rounded-md font-medium focus:outline-none',
                phone.trim()
                  ? 'bg-blue-700 text-white'
                  : 'bg-blue-100 text-blue-700',
              ]"
              @click="$emit('verify')"
            >
              {{ $t('v1.view.onboarding.verify_via_zalo') }}
            </button>
            <button
              :class="[
                'px-10 py-3 rounded-md font-medium focus:outline-none',
                phone.trim()
                  ? 'bg-green-700 text-white'
                  : 'bg-green-100 text-green-700',
              ]"
              @click="$emit('verify')"
            >
              {{ $t('v1.view.onboarding.verify_via_whatsapp') }}
            </button>
            <button
              :class="[
                'px-10 py-3 rounded-md font-medium focus:outline-none',
                phone.trim()
                  ? 'bg-slate-700 text-white'
                  : 'bg-slate-100 text-slate-700',
              ]"
              @click="$emit('verify')"
            >
              {{ $t('v1.view.onboarding.verify_via_sms') }}
            </button>
          </div>
        </div>
      </div>
      <div class="h-16"></div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { useCommonStore } from '@/stores'
import { ShieldCheckIcon } from '@heroicons/vue/24/solid'
import { useI18n } from 'vue-i18n'
/** Hàm dịch */
const { t: $t } = useI18n()
/** Khai báo common store */
const commonStore = useCommonStore()
/** Định nghĩa props */
defineProps<{
  /** Số Điện thoại */
  phone: string
  /** Bước hiện tại */
  current_step: number
  /** Tổng số bước */
  total_steps: number
  /** Title của các bước */
  STEP_TITLE: string
  /** Mô tả của bước này */
  STEP_DESCRIPTIONS: string
}>()
/** Hàm emit các sự kiện */
const $emit = defineEmits<{
  (e: 'update:phone', value: string): void
  (e: 'resend'): void
  (e: 'back'): void
  (e: 'verify'): void
}>()
/** Hàm cập nhật ôn input phone */
const handleInput = (event: Event) => {
  /** Lấy target Input */
  const TARGET = event.target as HTMLInputElement
  /** Cập nhật giá trị phone cho hàm cha  */
  $emit('update:phone', TARGET.value)
}
</script>

<style scoped>
/** Css sự kiện focus */
button:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
}
</style>
