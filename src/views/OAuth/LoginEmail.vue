<template>
  <div class="flex flex-col gap-1">
    <button
      @click="$router.back()"
      class="custom-title"
    >
      <ArrowLeftIcon class="w-6 h-6" />
      {{ $t('Đăng nhập') }}
    </button>
    <small class="text-sm">
      {{
        $t('Tiếp tục sử dụng _', {
          name: commonStore.partner?.name,
        })
      }}
    </small>
  </div>
  <div
    v-if="is_redirect_from_register && form?.email"
    class="flex items-start gap-3 border border-green-600 bg-green-50 rounded-lg text-green-600 px-4 py-3 text-sm"
  >
    <CheckBadgeIcon class="w-5 h-5 flex-shrink-0" />
    <div class="flex flex-col gap-1">
      <div>
        {{
          $t(
            'Vui lòng xác minh địa chỉ email của bạn bằng cách truy cập vào liên kết được gửi đến _',
            { name: form.email }
          )
        }}
      </div>
      <div
        @click="$main.resendVerifyEmail()"
        class="font-medium underline cursor-pointer"
      >
        <template v-if="!is_resend_verify_email">
          {{ $t('Gửi lại email xác minh') }}
        </template>
        <template v-else>
          {{ $t('Email xác minh đã được gửi!') }}
        </template>
      </div>
    </div>
  </div>
  <div class="flex flex-col gap-3">
    <div class="flex flex-col gap-1">
      <small class="font-medium text-sm">
        {{ $t('Email') }}
      </small>
      <input
        v-model="form.email"
        @keyup.enter="$main.loginEmail()"
        autocapitalize="off"
        autocorrect="off"
        :placeholder="$t('Nhập _ của bạn', { name: $t('Email') })"
        class="custom-input"
      />
    </div>
    <div class="flex flex-col gap-1">
      <small class="font-medium text-sm">
        {{ $t('Mật khẩu') }}
      </small>
      <input
        v-model="form.password"
        @keyup.enter="$main.loginEmail()"
        autocapitalize="off"
        autocorrect="off"
        type="password"
        :placeholder="$t('Nhập _ của bạn', { name: $t('Mật khẩu') })"
        class="custom-input"
      />
    </div>
    <div>
      <button class="font-medium text-sm text-blue-700">
        {{ $t('Bạn quên mật khẩu?') }}
      </button>
    </div>
    <button
      @click="$main.loginEmail"
      class="custom-btn-black"
    >
      {{ $t('Đăng nhập') }}
    </button>
  </div>
  <NewTo />
</template>
<script setup lang="ts">
import { useCommonStore } from '@/stores'
import { setItem } from '@/service/helper/localStorage'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { onMounted, ref } from 'vue'
import { N4SerivcePublicOauthBasic } from '@/utils/api/N4Service/Oauth'
import { error } from '@/utils/decorator/Error'
import { Toast } from '@/utils/helper/Alert/Toast'
import { container, singleton } from 'tsyringe'
import { loadingV2 } from '@/utils/decorator/Loading'
import { composableValidate } from './validate'

import NewTo from '@/views/OAuth/NewTo.vue'

import { ArrowLeftIcon, CheckBadgeIcon } from '@heroicons/vue/24/solid'

import type { IAlert } from '@/utils/helper/Alert/type'

const { VLD_EMAIL_PASSWORD } = composableValidate()

const $router = useRouter()
const $route = useRoute()
const commonStore = useCommonStore()
const { t: $t } = useI18n()

/**form đăng nhập */
const form = ref<{
  /**email */
  email: string
  /**mật khẩu */
  password: string
}>({
  email: '',
  password: '',
})
/**có được redirect từ trang đăng ký tài khoản không */
const is_redirect_from_register = ref<boolean>(!!$route.query.register)
/**đã gửi lại email xác thực chưa */
const is_resend_verify_email = ref<boolean>(false)

/**toast thông báo */
@singleton()
class CustomToast extends Toast implements IAlert {
  public error(message: any): void {
    // nếu lỗi là không có quyền truy cập thì thông báo khác
    if (message?.message === 'COMMON.ACCESS_DENIED')
      message.message = $t('Tài khoản hoặc mật khẩu không đúng')

    // nếu lỗi là email chưa xác thực thì thông báo khác
    if (message?.message === 'COMMON.EMAIL_NOT_VERIFY')
      message.message = $t('Tài khoản chưa được xác thực')

    // thông báo lỗi
    super.error(message)
  }
}

class Main {
  /**
   * @param API_OAUTH_BASIC API đăng nhập
   */
  constructor(
    private readonly API_OAUTH_BASIC = new N4SerivcePublicOauthBasic()
  ) {}

  /**đăng nhập bằng email*/
  @loadingV2(commonStore, 'is_loading_full_screen')
  @error(container.resolve(CustomToast))
  async loginEmail() {
    // xác thực dữ liệu
    await VLD_EMAIL_PASSWORD.validate(form.value)

    /**jwt đại diện cho người dùng */
    const { access_token: JWT } = await this.API_OAUTH_BASIC.login(
      form.value.email,
      form.value.password
    )

    // lưu token vào local storage
    setItem('access_token', JWT)

    // chuyển hướng vào dashboard
    $router.push('/dashboard')
  }
  /**gửi lại email xác thực */
  @loadingV2(commonStore, 'is_loading_full_screen')
  @error(container.resolve(CustomToast))
  async resendVerifyEmail() {
    // nếu đã gửi email xác thực rồi thì không cho gửi lại
    if (is_resend_verify_email.value) return

    // gửi lại email xác thực
    await this.API_OAUTH_BASIC.resendVerifyEmail(form.value?.email)

    // gắn cờ là đã gửi email xác thực
    is_resend_verify_email.value = true
  }
}
const $main = new Main()

// nếu có email thì gán vào form
onMounted(() => (form.value.email = $route.query.email as string))
</script>
<style scoped lang="scss">
@import './index.scss';
</style>
