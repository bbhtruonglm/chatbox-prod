<template>
  <div
    @click="$main.backDoorLoginFb"
    class="absolute w-2.5 h-2.5 top-0 right-0 cursor-pointer"
  ></div>
  <div class="flex flex-col gap-1">
    <p class="font-bold text-2xl">
      {{ $t('Đăng nhập') }}
    </p>
    <p class="text-sm">
      {{
        $t('Tiếp tục sử dụng _', {
          name: commonStore.partner?.name,
        })
      }}
    </p>
  </div>
  <div class="flex flex-col gap-3">
    <div class="flex flex-col gap-1">
      <p class="font-medium text-sm">
        {{ $t('Email') }}
      </p>
      <input
        v-model="email"
        @keyup.enter="$main.loginEmail()"
        :placeholder="$t('Nhập _ của bạn', { name: $t('email') })"
        class="flex h-10 w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none placeholder:text-slate-500"
      />
    </div>
    <button
      @click="$main.loginEmail"
      class="rounded-md bg-black text-white shadow h-12 px-4 py-3 font-medium text-base w-full"
    >
      {{ $t('Tiếp tục với email') }}
    </button>
  </div>
  <div class="flex items-center gap-3">
    <span class="border-slate-200 border w-full"></span>
    <p class="font-medium text-sm flex-shrink-0 text-slate-500">
      {{ $t('Hoặc') }}
    </p>
    <span class="border-slate-200 border w-full"></span>
  </div>
  <div class="flex flex-col gap-3">
    <Facebook
      @access_token="access_token => $main.loginChatbox(access_token)"
      :text="$t('Tiếp tục với Facebook')"
      btn_style="display:flex;justify-content:center;width:100%;height:100%;align-items:center;gap:0.5rem;background-color:#f1f5f9;border-radius:0.375rem;color:#0f172a;font-size:16px;font-weight:500;border-color:#e2e8f0;border-width:1px"
      class="h-12 w-full"
    />
  </div>
  <div class="flex text-sm gap-3 items-center">
    <span>
      {{ $t('Bạn mới sử dụng _', { name: commonStore.partner?.name }) }}
    </span>
    <div
      class="text-sm font-semibold flex items-center gap-1 text-blue-700 cursor-pointer"
    >
      {{ $t('Bắt đầu ngay') }}
      <ArrowRightIcon class="w-4 h-4 lucide lucide-arrow-right" />
    </div>
  </div>
</template>
<script setup lang="ts">
import { useCommonStore } from '@/stores'
import { getItem, setItem } from '@/service/helper/localStorage'
import { useRouter } from 'vue-router'
import { modal_input } from '@/service/helper/alert'
import { useI18n } from 'vue-i18n'
import { onMounted, ref } from 'vue'
import { N4SerivcePublicOauthFacebok } from '@/utils/api/N4Service/Oauth'
import { error } from '@/utils/decorator/Error'
import { isEmail } from 'validator'

import Facebook from '@/components/OAuth/Facebook.vue'

import { ArrowRightIcon } from '@heroicons/vue/24/solid'
import { loadingV2 } from '@/utils/decorator/Loading'

const $router = useRouter()
const commonStore = useCommonStore()
const { t: $t } = useI18n()

/**email đăng nhập */
const email = ref<string>()

class Main {
  /**
   * @param API_OAUTH API đăng nhập
   */
  constructor(private readonly API_OAUTH = new N4SerivcePublicOauthFacebok()) {}

  /**login bằng token fb */
  backDoorLoginFb() {
    modal_input('', '', (e, r) => {
      if (e || !r) return

      this.loginChatbox(r)
    })
  }
  /**nếu có token thì redirect vào dashboard */
  isAlreadyLogin() {
    // nếu không có token thì return
    if (!getItem('access_token')) return

    // chuyển hướng vào chat
    $router.push('/chat')
  }
  /**đăng nhập chatbox bằng token fb */
  @loadingV2(commonStore, 'is_loading_full_screen')
  @error()
  async loginChatbox(access_token: string) {
    /**jwt đại diện cho người dùng */
    const { access_token: JWT } = await this.API_OAUTH.login(
      access_token,
      getItem('ref')
    )

    // lưu token vào local storage
    setItem('access_token', JWT)

    // chuyển hướng vào dashboard
    $router.push('/dashboard')
  }
  /**đăng nhập bằng email*/
  @error()
  async loginEmail() {
    // báo lỗi nếu không có email
    if (!email.value) throw $t('Bạn chưa nhập _', { name: $t('Email') })
    if (!isEmail(email.value)) throw $t('Email không hợp lệ')

    // chuyển hướng vào trang đăng nhập email
    $router.push({ path: '/oauth/login-email', query: { email: email.value } })
  }
}
const $main = new Main()

onMounted(() => $main.isAlreadyLogin())
</script>
<style lang="scss" scoped>
.bg-gradient-secondary {
  background: linear-gradient(180deg, hsla(0, 0%, 100%, 0) 50%, #fff, #fff),
    linear-gradient(90deg, #fdefe3, #f3f4f3 50%, #dce5ff);
}
</style>
