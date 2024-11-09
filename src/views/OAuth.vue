<template>
  <div class="relative flex flex-row-reverse h-full">
    <div
      @click="openForm"
      class="absolute w-[10px] h-[10px] top-0 right-[45%] cursor-pointer bg-gray-500"
    ></div>
    <div
      @click="testLogin"
      class="absolute w-[10px] h-[10px] top-0 right-0 cursor-pointer"
    ></div>
    <div
      class="w-full h-[250px] md:h-full md:w-2/4 bg-no-repeat bg-center bg-cover bg-[url(@/assets/imgs/login-background.svg)]"
    />
    <div class="mt-0 h-full w-2/4 px-8 py-24 bg-white relative">
      <img
        class="absolute top-[-150px] w-[60px] h-[60px] md:w-[80px] md:h-[80px] md:static md:mx-auto left-8"
        :src="commonStore.partner?.logo?.icon"
      />
      <div class="text-2xl font-semibold md:text-center md:mt-5">
        {{ $t('v1.view.oauth.login.login') }}
      </div>
      <div
        class="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-full px-[33px] flex justify-center"
      >
        <Facebook
          :text="$t('v1.view.oauth.login.btn_text')"
          class="h-[40px] w-full md:w-[350px]"
          @access_token="loginChatbox"
        />
      </div>
    </div>

    <div class="absolute bottom-[40px] left-8">
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
