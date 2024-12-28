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
        v-model="form.email"
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
          v-model="form.last_name"
          :placeholder="$t('Nhập _ của bạn', { name: $t('Họ') })"
          class="custom-input"
        />
      </div>
      <div class="flex flex-col gap-1">
        <small class="font-medium text-sm">
          {{ $t('Tên') }}
        </small>
        <input
          v-model="form.first_name"
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
        v-model="form.password"
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
        v-model="form.confirm_password"
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
import { computed, onMounted, ref } from 'vue'
import { error } from '@/utils/decorator/Error'
import { LocalStorage, type ILocalStorage } from '@/utils/helper/LocalStorage'
import { container, singleton } from 'tsyringe'
import { N4SerivcePublicOauthBasic } from '@/utils/api/N4Service/Oauth'
import { loadingV2 } from '@/utils/decorator/Loading'
import { Toast } from '@/utils/helper/Alert/Toast'
import { composableValidate } from './validate'

import GoLogin from '@/views/OAuth/GoLogin.vue'

import { ArrowLeftIcon } from '@heroicons/vue/24/solid'

import type { IAlert } from '@/utils/helper/Alert/type'

const { VLD_EMAIL_REGISTER } = composableValidate()

const $router = useRouter()
const $route = useRoute()
const commonStore = useCommonStore()
const { t: $t, locale } = useI18n()

/**form đăng ký */
const form = ref<{
  /**email */
  email: string
  /**tên */
  first_name: string
  /**họ */
  last_name: string
  /**mật khẩu */
  password: string
  /**xác nhận mật khẩu */
  confirm_password: string
}>({
  email: '',
  first_name: '',
  last_name: '',
  password: '',
  confirm_password: '',
})

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
   * @param SERVICE_LOCAL_STORAGE service lưu trữ
   * @param SERVICE_TOAST service thông báo
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
    // xác thực form
    await VLD_EMAIL_REGISTER.validate(form.value)

    // xác thực mật khẩu
    if (form.value.password !== form.value.confirm_password)
      throw $t('Mật khẩu không khớp')

    // đăng ký
    await this.API_OAUTH_BASIC.register(
      form.value.email,
      form.value.password,
      full_name.value,
      form.value.first_name,
      form.value.last_name,
      this.SERVICE_LOCAL_STORAGE.getItem('ref')
    )

    // thông báo thành công
    this.SERVICE_TOAST.success($t('Đăng ký tài khoản thành công'))

    // đăng ký thành công thì chuyển về đăng nhập email
    $router.push({
      path: '/oauth/login-email',
      query: { email: form.value.email },
    })
  }
}
const $main = new Main()

// nếu có email thì gán vào form
onMounted(() => (form.value.email = $route.query.email as string))

/**tên đầy đủ */
const full_name = computed(() => {
  // tên tiếng việt bị ngược với thế giới
  if (locale.value === 'vn')
    return `${form.value.last_name} ${form.value.first_name}`

  // tên bình thường
  return `${form.value.first_name} ${form.value.last_name}`
})
</script>
<style scoped lang="scss">
@import './index.scss';
</style>
