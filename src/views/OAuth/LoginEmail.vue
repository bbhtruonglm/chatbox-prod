<template>
  <div class="flex flex-col gap-1">
    <button
      @click="$router.push('/oauth')"
      class="font-bold text-2xl flex items-center gap-2"
    >
      <ArrowLeftIcon class="w-6 h-6" />
      {{ $t('Đăng nhập') }}
    </button>
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
        :placeholder="$t('Nhập _ của bạn', { name: $t('Email') })"
        class="flex h-10 w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none placeholder:text-slate-500"
      />
    </div>
    <div class="flex flex-col gap-1">
      <p class="font-medium text-sm">
        {{ $t('Mật khẩu') }}
      </p>
      <input
        v-model="password"
        type="password"
        :placeholder="$t('Nhập _ của bạn', { name: $t('Mật khẩu') })"
        class="flex h-10 w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none placeholder:text-slate-500"
      />
    </div>
    <div>
      <button class="font-medium text-sm text-blue-700">
        {{ $t('Bạn quên mật khẩu?') }}
      </button>
    </div>
    <button
      @click="$main.loginEmail"
      class="rounded-md bg-black text-white shadow h-12 px-4 py-3 font-medium text-base w-full"
    >
      {{ $t('Đăng nhập') }}
    </button>
  </div>
</template>
<script setup lang="ts">
import { useCommonStore } from '@/stores'
import { setItem } from '@/service/helper/localStorage'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ref } from 'vue'
import { N4SerivcePublicOauthBasic } from '@/utils/api/N4Service/Oauth'
import { error } from '@/utils/decorator/Error'
import { isEmail } from 'validator'

import { ArrowLeftIcon } from '@heroicons/vue/24/solid'
import { loadingV2 } from '@/utils/decorator/Loading'

const $router = useRouter()
const $route = useRoute()
const commonStore = useCommonStore()
const { t: $t } = useI18n()

/**email đăng nhập */
const email = ref<string>($route.query.email as string)
/**mật khẩu đăng nhập */
const password = ref<string>()

class Main {
  /**
   * @param API_OAUTH API đăng nhập
   */
  constructor(private readonly API_OAUTH = new N4SerivcePublicOauthBasic()) {}

  /**đăng nhập bằng email*/
  @loadingV2(commonStore, 'is_loading_full_screen')
  @error()
  async loginEmail() {
    // báo lỗi nếu không có email
    if (!email.value) throw $t('Bạn chưa nhập _', { name: $t('Email') })
    if (!isEmail(email.value)) throw $t('Email không hợp lệ')
    if (!password.value) throw $t('Bạn chưa nhập _', { name: $t('Mật khẩu') })

    /**jwt đại diện cho người dùng */
    const { access_token: JWT } = await this.API_OAUTH.login(
      email.value,
      password.value
    )

    // lưu token vào local storage
    setItem('access_token', JWT)

    // chuyển hướng vào dashboard
    $router.push('/dashboard')
  }
}
const $main = new Main()
</script>
<style lang="scss" scoped>
.bg-gradient-secondary {
  background: linear-gradient(180deg, hsla(0, 0%, 100%, 0) 50%, #fff, #fff),
    linear-gradient(90deg, #fdefe3, #f3f4f3 50%, #dce5ff);
}
</style>
