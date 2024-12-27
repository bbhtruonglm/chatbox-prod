<template>
  <div class="flex flex-col gap-1">
    <button
      @click="$router.back()"
      class="custom-title"
    >
      <ArrowLeftIcon class="w-6 h-6" />
      {{ $t('Đăng ký tài khoản _', { name: commonStore.partner?.name }) }}
    </button>
    <small class="custom-description">
      {{ $t('Một bước cuối cùng trước khi bắt đầu dùng thử') }}
    </small>
  </div>
  <div class="flex flex-col gap-3">
    <div class="flex flex-col gap-1">
      <small class="font-medium text-sm">
        {{ $t('Email') }}
      </small>
      <input
        v-model="email"
        autocapitalize="off"
        autocorrect="off"
        :placeholder="$t('Nhập _ của bạn', { name: $t('email') })"
        class="custom-input"
      />
    </div>
    <div
      :class="{
        'flex-row-reverse': locale !== 'vn',
      }"
      class="flex gap-2.5"
    >
      <div class="flex flex-col gap-1">
        <small class="font-medium text-sm">
          {{ $t('Họ') }}
        </small>
        <input
          v-model="last_name"
          :placeholder="$t('Nhập _ của bạn', { name: $t('Họ') })"
          class="custom-input"
        />
      </div>
      <div class="flex flex-col gap-1">
        <small class="font-medium text-sm">
          {{ $t('Tên') }}
        </small>
        <input
          v-model="first_name"
          :placeholder="$t('Nhập _ của bạn', { name: $t('Tên') })"
          class="custom-input"
        />
      </div>
    </div>
    <div class="flex flex-col gap-1">
      <small class="font-medium text-sm">
        {{ $t('Mật khẩu') }}
      </small>
      <input
        v-model="password"
        autocapitalize="off"
        autocorrect="off"
        type="password"
        :placeholder="$t('Nhập _ của bạn', { name: $t('Mật khẩu') })"
        class="custom-input"
      />
    </div>
    <div class="flex flex-col gap-1">
      <small class="font-medium text-sm">
        {{ $t('Xác nhận mật khẩu') }}
      </small>
      <input
        v-model="confirm_password"
        autocapitalize="off"
        autocorrect="off"
        type="password"
        :placeholder="$t('Xác nhận mật khẩu')"
        class="custom-input"
      />
    </div>
    <button
      @click="$main.register()"
      class="custom-btn-black"
    >
      {{
        $t('Đăng ký bằng _', {
          name: $t('Email'),
        })
      }}
    </button>
  </div>
  <GoLogin />
</template>
<script setup lang="ts">
import { useCommonStore } from '@/stores'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { computed, ref } from 'vue'
import { error } from '@/utils/decorator/Error'
import { isEmail } from 'validator'
import { LocalStorage, type ILocalStorage } from '@/utils/helper/LocalStorage'
import { container, singleton } from 'tsyringe'
import { N4SerivcePublicOauthBasic } from '@/utils/api/N4Service/Oauth'
import { loadingV2 } from '@/utils/decorator/Loading'

import GoLogin from '@/views/OAuth/GoLogin.vue'

import { ArrowLeftIcon } from '@heroicons/vue/24/solid'
import type { IAlert } from '@/utils/helper/Alert/type'
import { Toast } from '@/utils/helper/Alert/Toast'

const $router = useRouter()
const $route = useRoute()
const commonStore = useCommonStore()
const { t: $t, locale } = useI18n()

/**email đăng nhập */
const email = ref<string>($route.query.email as string)
/**họ */
const first_name = ref<string>()
/**tên */
const last_name = ref<string>()
/**mật khẩu */
const password = ref<string>()
/**xác nhận mật khẩu */
const confirm_password = ref<string>()

/**chỉnh sửa thông báo */
@singleton()
class CustomToast extends Toast implements IAlert {
  error(message: any): void {
    if (message?.message === 'COMMON.EMAIL_EXISTED')
      message = $t('Tài khoản đã tồn tại')

    super.error(message)
  }
}

class Main {
  /**
   * @param API_OAUTH_BASIC API đăng nhập
   */
  constructor(
    private readonly API_OAUTH_BASIC = new N4SerivcePublicOauthBasic(),
    private readonly SERVICE_LOCAL_STORAGE: ILocalStorage = container.resolve(
      LocalStorage
    ),
    private readonly SERVICE_TOAST: IAlert = container.resolve(Toast)
  ) {}

  /**đăng ký */
  @loadingV2(commonStore, 'is_loading_full_screen')
  @error(container.resolve(CustomToast))
  async register() {
    // xác thực dữ liệu
    if (!email.value) throw $t('Bạn chưa nhập _', { name: $t('Email') })
    if (!isEmail(email.value)) throw $t('Email không hợp lệ')
    if (!last_name.value) throw $t('Bạn chưa nhập _', { name: $t('Họ') })
    if (!first_name.value) throw $t('Bạn chưa nhập _', { name: $t('Tên') })
    if (!password.value) throw $t('Bạn chưa nhập _', { name: $t('Mật khẩu') })
    if (!confirm_password.value)
      throw $t('Bạn chưa nhập _', { name: $t('Xác nhận mật khẩu') })
    if (password.value !== confirm_password.value)
      throw $t('Mật khẩu không khớp')

    // đăng ký
    await this.API_OAUTH_BASIC.register(
      email.value,
      password.value,
      full_name.value,
      first_name.value,
      last_name.value,
      this.SERVICE_LOCAL_STORAGE.getItem('ref')
    )

    // thông báo thành công
    this.SERVICE_TOAST.success($t('Đăng ký tài khoản thành công'))

    // đăng ký thành công thì chuyển về đăng nhập email
    $router.push({
      path: '/oauth/login-email',
      query: { email: email.value },
    })
  }
}
const $main = new Main()

/**tên đầy đủ */
const full_name = computed(() => {
  // tên tiếng việt bị ngược với thế giới
  if (locale.value === 'vn') return `${last_name.value} ${first_name.value}`
  
  // tên bình thường
  return `${first_name.value} ${last_name.value}`
})
</script>
<style scoped lang="scss">
@import './index.scss';
</style>
