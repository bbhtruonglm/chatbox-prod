<template>
  <div class="flex flex-col gap-1">
    <strong class="custom-title">
      {{ $t('Đăng ký tài khoản _', { name: commonStore.partner?.name }) }}
    </strong>
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
        @keyup.enter="$main.goRegisterDetail()"
        :placeholder="$t('Nhập _ của bạn', { name: $t('email') })"
        class="custom-input"
      />
    </div>
    <button
      @click="$main.goRegisterDetail"
      class="custom-btn-black"
    >
      {{
        $t('Đăng ký bằng _', {
          name: $t('Email'),
        })
      }}
    </button>
  </div>
  <Or />
  <div class="flex flex-col gap-3">
    <Facebook
      @access_token="access_token => $service_oauth.loginFb(access_token)"
      :text="
        $t('Đăng ký bằng _', {
          name: $t('Facebook'),
        })
      "
      btn_style="display:flex;justify-content:center;width:100%;height:100%;align-items:center;gap:0.5rem;background-color:#f1f5f9;border-radius:0.375rem;color:#0f172a;font-size:16px;font-weight:500;border-color:#e2e8f0;border-width:1px"
      class="h-12 w-full"
    />
  </div>
  <GoLogin />
</template>
<script setup lang="ts">
import { useCommonStore } from '@/stores'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ref } from 'vue'
import { error } from '@/utils/decorator/Error'
import { composableService } from '@/views/OAuth/service'
import { container } from 'tsyringe'
import { composableValidate } from './validate'

import Facebook from '@/components/OAuth/Facebook.vue'
import GoLogin from '@/views/OAuth/GoLogin.vue'
import Or from '@/views/OAuth/Or.vue'

const { VLD_EMAIL } = composableValidate()
const { ServiceOAuth } = composableService()

const $router = useRouter()
const commonStore = useCommonStore()
const { t: $t } = useI18n()
const $service_oauth = container.resolve(ServiceOAuth)

/**email đăng nhập */
const email = ref<string>()

class Main {
  /**đăng nhập bằng email*/
  @error()
  async goRegisterDetail() {
    // kiểm tra email
    await VLD_EMAIL.validate({ email: email.value })

    // chuyển hướng vào trang chi tiết đăng ký
    $router.push({
      path: '/oauth/register-detail',
      query: { email: email.value },
    })
  }
}
const $main = new Main()
</script>
<style scoped lang="scss">
@import './index.scss';
</style>
