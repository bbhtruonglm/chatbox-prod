<template>
  <div
    id="oauth"
    class="relative h-full w-full"
  >
    <div
      @click="openForm"
      class="absolute w-2.5 h-2.5 top-0 left-0 cursor-pointer z-50"
    ></div>
    <div
      @click="testLogin"
      class="absolute w-2.5 h-2.5 top-0 right-0 cursor-pointer"
    ></div>

    <div
      class="h-full w-full flex flex-col-reverse md:grid md:grid-cols-2 bg-white"
    >
      <div
        class="h-1/2 md:h-full md:pb-1/2 bg-white flex flex-col items-center md:justify-end gap-2 md:gap-14 mt-20 md:mt-0"
      >
        <div class="flex flex-col items-center gap-2">
          <img
            :src="commonStore.partner?.logo?.icon"
            class="w-20 h-20 hidden md:block"
          />
          <div class="text-2xl font-semibold">
            {{ $t('v1.view.oauth.login.login') }}
          </div>
        </div>
        <div class="w-full flex justify-center">
          <Facebook
            :text="$t('v1.view.oauth.login.btn_text')"
            class="h-[40px] w-full md:w-[350px]"
            @access_token="loginChatbox"
          />
        </div>
      </div>

      <div
        class="bg-no-repeat bg-center bg-cover h-1/2 md:h-full rounded-bl-3xl md:rounded-none bg-[url(@/assets/imgs/login__bg-mobile.svg)] md:bg-[url(@/assets/imgs/login-background.svg)] bg-orange-50"
      />
    </div>

    <div class="absolute bottom-0 md:bottom-10 md:left-8">
      <Language />
    </div>
  </div>
</template>

<script setup lang="ts">
import { getItem, setItem } from '@/service/helper/localStorage'
import { useRouter } from 'vue-router'
import { modal_input } from '@/service/helper/alert'
import { useI18n } from 'vue-i18n'
import { onMounted } from 'vue'
import {
  N4SerivcePublicOauthBasic,
  N4SerivcePublicOauthFacebok,
} from '@/utils/api/N4Service/Oauth'
import { useCommonStore } from '@/stores'
import Swal from 'sweetalert2'

import Language from '@/components/Language.vue'
import Facebook from '@/components/OAuth/Facebook.vue'
import { ToastSingleton } from '@/utils/helper/Alert/Toast'

const $router = useRouter()
const { t: $t } = useI18n()
const commonStore = useCommonStore()
const toast = ToastSingleton.getInst()

onMounted(() => isAlreadyLogin())

/**login test bằng token fb */
function testLogin() {
  modal_input('', '', (e, r) => {
    if (e || !r) return

    loginChatbox(r)
  })
}
/**nếu có token thì redirect vào dashboard */
function isAlreadyLogin() {
  if (!getItem('access_token')) return

  $router.push('/chat')
}
/**đăng nhập chatbox bằng token fb */
async function loginChatbox(access_token: string) {
  try {
    // bật loading
    commonStore.is_loading_full_screen = true

    /**jwt đại diện cho người dùng */
    const { access_token: JWT } = await new N4SerivcePublicOauthFacebok().login(
      access_token
    )

    // lưu token vào local storage
    setItem('access_token', JWT)

    // chuyển hướng vào dashboard
    $router.push('/dashboard')
  } catch (e) {
    // báo lỗi nếu có
    toast.error(e)
  } finally {
    // tắt loading
    commonStore.is_loading_full_screen = false
  }
}
/**mở tạm input để nhập email + pw */
async function openForm() {
  try {
    const {
      value: [EMAIL, PASSWORD],
    } = await Swal.fire({
      title: 'Login',
      html:
        '<input id="swal-input1" class="swal2-input" placeholder="Email">' +
        '<input id="swal-input2" type="password" class="swal2-input" placeholder="Password">',
      focusConfirm: false,
      preConfirm: () => {
        return [
          // @ts-ignore
          document.getElementById('swal-input1')?.value,
          // @ts-ignore
          document.getElementById('swal-input2')?.value,
        ]
      },
    })

    console.log(EMAIL, PASSWORD)

    // bật loading
    commonStore.is_loading_full_screen = true

    /**jwt đại diện cho người dùng */
    const { access_token: JWT } = await new N4SerivcePublicOauthBasic().login(
      EMAIL,
      PASSWORD
    )

    // báo lỗi nếu không có token
    if (!JWT) throw 'Login failed'

    // lưu token vào local storage
    setItem('access_token', JWT)

    // chuyển hướng vào dashboard
    $router.push('/dashboard')
  } catch (e) {
    //
    toast.error(e)
  } finally {
    // tắt loading
    commonStore.is_loading_full_screen = false
  }
}
</script>
