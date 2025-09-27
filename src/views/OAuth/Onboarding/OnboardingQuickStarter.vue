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
          <h1 class="text-5xl leading-tight font-semibold">
            {{ $t('v1.view.onboarding.quick_started') }}
          </h1>
          <p class="text-black text-sm font-medium">
            {{ $t('v1.view.onboarding.two_minutes') }}
          </p>
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
          <div
            class="flex w-fit items-center bg-slate-300 text-gray-700 px-3 py-1 rounded-full text-sm"
          >
            {{ current_step + 1 }} {{ $t('v1.view.onboarding.step_of') }}
            {{ total_steps }}
          </div>
          <div>
            <h2 class="text-4xl font-bold flex gap-2.5 items-center">
              {{ STEP_TITLE }}
            </h2>
            <p class="font-medium">{{ STEP_DESCRIPTIONS }}</p>
          </div>
        </div>
        <div class="flex flex-col gap-5">
          <div
            v-if="current_step === 0"
            class="px-28 py-1"
          >
            <h3 class="text-slate-500 font-medium text-xs">
              {{ $t('v1.view.onboarding.select_platform_to_connect') }}
            </h3>
            <ul class="divide-y">
              <li
                v-for="(item, i) in PLAT_FORMS"
                :key="i"
                class="flex items-center justify-between px-2 py-4 gap-3"
              >
                <!-- Thông tin -->
                <div class="flex items-center gap-3">
                  <ZaloIcon
                    v-if="item.name === 'Zalo'"
                    class="size-8"
                  />
                  <Facebook
                    v-else-if="item.name === 'Facebook'"
                    class="size-8"
                  />
                  <Instagram
                    v-else-if="item.name === 'Instagram'"
                    class="size-8"
                  />
                  <Whatsapp
                    v-else-if="item.name === 'Whatsapp'"
                    class="size-8"
                  />
                  <img
                    v-else
                    src="https://static.retion.ai/chatbox/partner/retion.logo.png"
                    class="size-8"
                  />
                  <div class="flex flex-col">
                    <span class="font-semibold text-sm">{{ item.name }}</span>
                    <span class="text-slate-500 text-xs">{{ item.desc }}</span>
                  </div>
                </div>

                <!-- Nút trạng thái -->
                <div>
                  <button
                    v-if="CONNECTED_PLATFORMS.includes(item?.name)"
                    class="text-blue-600 border py-2 border-transparent flex items-center gap-1 text-sm font-semibold"
                  >
                    {{ $t('v1.view.onboarding.connected') }}
                    <LinkIcon class="size-4" />
                  </button>
                  <button
                    v-else
                    @click="handleAddPlatforms(item?.name)"
                    class="px-6 py-2 bg-slate-200 border border-slate-300 font-semibold rounded-md hover:bg-slate-300 flex items-center gap-1 text-sm"
                  >
                    <span
                      v-if="LOADING_PLATFORM !== item?.name"
                      class="flex gap-1 items-center"
                    >
                      {{ $t('v1.view.onboarding.connect') }}
                      <ChevronRightIcon class="size-4" />
                    </span>
                    <VueSpinnerIos
                      v-else
                      size="20"
                      color="blue"
                    />
                  </button>
                </div>
              </li>
            </ul>
          </div>
          <div v-else-if="current_step === 1">
            <div class="flex flex-col gap-5 max-w-xl">
              <!-- Link invite -->
              <div class="flex items-center gap-3">
                <div class="flex-1">
                  <label class="block text-sm font-medium mb-1"
                    >Link invite</label
                  >
                  <input
                    type="text"
                    readonly
                    :value="INVITE_LINKS"
                    class="w-full border rounded-md px-3 py-2 bg-gray-100"
                  />
                </div>
                <button
                  @click="copyLink"
                  class="mt-6 px-4 py-2 w-28 bg-gray-100 hover:bg-gray-200 rounded-md"
                >
                  Copy link
                </button>
              </div>

              <!-- Email addresses -->
              <div
                v-for="(email, index) in emails"
                :key="index"
                class="flex items-center gap-3"
              >
                <div class="flex-1">
                  <label class="block text-sm font-medium mb-1"
                    >Email address</label
                  >
                  <input
                    type="email"
                    v-model="emails[index]"
                    placeholder="Enter email"
                    class="w-full border rounded-md px-3 py-2"
                  />
                </div>
                <button
                  @click="sendInvite(email)"
                  class="mt-6 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md"
                >
                  Send Invite
                </button>
              </div>

              <!-- Add more email field -->
              <button
                @click="addEmailField"
                class="flex items-center gap-2 text-sm text-gray-700 hover:text-black"
              >
                <PlusCircleIcon class="size-5" />
                Invite Email
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="flex justify-between items-center w-full">
        <button
          class="px-10 py-3 gap-4 rounded-md bg-gray-200 font-medium text-black focus:outline-none disabled:opacity-50"
          :disabled="current_step === 0"
          @click="prevStep"
        >
          {{ $t('v1.view.onboarding.back') }}
        </button>

        <!-- Khi chưa đến step 5 -->
        <div class="flex items-center w-2/3 justify-end gap-4">
          <!-- Khi step 5 -->

          <button
            :class="[
              'px-10 py-3 rounded-md font-medium border focus:outline-none flex-shrink-0 bg-white text-orange-600 border-orange-300 hover:text-white hover:bg-orange-500',
            ]"
            @click="skipForNow"
          >
            {{ $t('v1.view.onboarding.skip_for_now') }}
          </button>

          <!-- Khi chưa đến step 5 -->

          <button
            :class="[
              'px-10 py-3 rounded-md font-medium border focus:outline-none',
              IS_VALID_BTN_NEXT
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-blue-100 text-blue-600 border-blue-300',
            ]"
            @click="nextStep"
            :disabled="!IS_VALID_BTN_NEXT"
          >
            {{ $t('v1.view.onboarding.next') }}
          </button>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { useCommonStore } from '@/stores'
import { useI18n } from 'vue-i18n'

import { computed, onBeforeUnmount, ref, watch } from 'vue'

import Facebook from '@/components/Icons/Facebook.vue'
import Instagram from '@/components/Icons/Instagram.vue'
import Whatsapp from '@/components/Icons/Whatsapp.vue'
import ZaloIcon from '@/components/Icons/Zalo.vue'
import { PlusCircleIcon } from '@heroicons/vue/24/outline'
import { ChevronRightIcon, LinkIcon } from '@heroicons/vue/16/solid'
import { VueSpinnerIos } from 'vue3-spinners'
/** Hàm dịch */
const { t: $t } = useI18n()
/** Khai báo common store */
const commonStore = useCommonStore()

/** Định nghĩa props */
const props = defineProps<{
  /** Số phone */
  phone: string
  /** Bước hiện tại */
  current_step: number
  /** Tổng số bước */
  total_steps: number
}>()

/** Hàm emit */
const $emit = defineEmits<{
  (e: 'update:phone', value: string): void
  (e: 'skip_for_now'): void
  (e: 'back'): void
  (e: 'next'): void
}>()
/** Khai báo các nền tảng */
const PLAT_FORMS = [
  {
    name: 'Facebook',
    desc: 'Kết nối Trang Facebook',
    icon: '/icons/facebook.png',
    connected: false,
  },
  {
    name: 'Instagram',
    desc: 'Kết nối Trang Instagram',
    icon: '/icons/instagram.png',
    connected: false,
  },
  {
    name: 'Whatsapp',
    desc: 'Kết nối Whatsapp Business và Cá nhân.',
    icon: '/icons/whatsapp.png',
    connected: false,
  },
  {
    name: 'Zalo',
    desc: 'Kết nối Zalo OA và Zalo cá nhân.',
    icon: '/icons/zalo.png',
    connected: false,
  },
  {
    name: 'Website',
    desc: 'Kết nối Website',
    icon: '/icons/website.png',
    connected: false,
  },
]
/** Danh sachs platform đã kết nối */
const CONNECTED_PLATFORMS = ref<String[]>([])
/** Trạng thái loading */
const LOADING_PLATFORM = ref<string | null>(null)
/** Hàm thêm platform */
const handleAddPlatforms = (platform: string) => {
  /** Bật loading */
  LOADING_PLATFORM.value = platform
  setTimeout(() => {
    /** cập nhật danh sách platform đã kết nối */
    CONNECTED_PLATFORMS.value.push(platform)
    /** Tắt loading */
    LOADING_PLATFORM.value = null
  }, 1000)
}
/** Trạng thái  */
const IS_VALID_BTN_NEXT = computed(() => {
  /** Đang ở step 1 */
  if (props.current_step === 0) {
    return CONNECTED_PLATFORMS.value.length > 0
  }
  return false
})

/** Hàm next sang step */
const nextStep = () => {
  $emit('next')
}
/** Hàm skip tất cả */
const skipForNow = () => {
  $emit('skip_for_now')
}
/** Hàm back lại */
const prevStep = () => {
  $emit('back')
}

/** Trạng thái gửi verify code */
const is_sending_verify_code = ref(false)

/** countdown */
const time_remaining = ref(30)
/** Tạo count down interval */
let countdown_interval: number | undefined

/** Phone value với v-model */
const phone_value = ref(props.phone)

/** Đồng bộ phone prop với phone_value */
watch(phone_value, newValue => {
  $emit('update:phone', newValue)
})

/** Đồng bộ props.phone với phone_value khi props thay đổi */
watch(
  () => props.phone,
  newValue => {
    phone_value.value = newValue
  }
)
/** timeout verify sau 5s */
let verify_timeout: number | undefined

/** clear interval */
onBeforeUnmount(() => {
  clearInterval(countdown_interval)
  if (verify_timeout) clearTimeout(verify_timeout)
})

/** INVITE LINK */
const INVITE_LINKS = 'https://retion.ai/invite?code=123123'
/** Email */
const emails = ref(['', '']) // mặc định 2 ô như ảnh
/** Hàm copy link */
const copyLink = () => {
  navigator.clipboard.writeText(INVITE_LINKS)
  alert('Link copied!')
}
/** Gửi lời mới */
const sendInvite = (email: string) => {
  if (!email) {
    return
  }
  // Logic gửi invite ở đây
}
/** THêm email */
const addEmailField = () => {
  /** add field trống vào email */
  emails.value.push('')
}
/** Title + description theo step */
const STEP_TITLE = computed(() => {
  return [
    $t('v1.view.onboarding.connect_social'),
    $t('v1.view.onboarding.invite_staff'),
  ][props.current_step]
})
/** description các màn */
const STEP_DESCRIPTIONS = computed(() => {
  return [
    $t('v1.view.onboarding.connect_social_description'),
    $t('v1.view.onboarding.invite_staff_desctiption'),
  ][props.current_step]
})
</script>

<style scoped></style>
