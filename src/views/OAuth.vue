<template>
    <div class="relative md:flex md:flex-row-reverse md:h-full">
        <div class="w-full h-[250px] md:h-full md:w-2/4 bg-no-repeat bg-center bg-cover bg-[url(@/assets/imgs/login-background.svg)]" />
        <div class="mt-[-30px] md:mt-0 md:h-full md:w-2/4 px-8 py-10 md:py-24 rounded-t-[40px] bg-white relative h-[calc(100vh_-_244px)]">
            <img class="absolute top-[-150px] w-[60px] h-[60px] md:w-[80px] md:h-[80px] md:static md:mx-auto left-8" src="@/assets/imgs/chatbox.svg" />
            <div class="text-2xl font-semibold md:text-center md:mt-5">
                {{ $t('v1.view.oauth.login.login') }}
            </div>

            <div class="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-full px-[33px] flex justify-center">
                <iframe class="h-[40px] w-full md:w-[350px]" :src="IFRAME_SRC" frameborder="0" />
            </div>
        </div>

        <div class="absolute bottom-[40px] left-8"><Language /></div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { cross_login_url } from '@/service/constant/botbanhang'
import { flow } from '@/service/helper/async'
import { login_facebook } from '@/service/api/chatbox/n4-service'
import { setItem } from '@/service/helper/localStorage'
import { useRouter } from 'vue-router'

import Language from '@/components/Language.vue'

import type { CbError } from '@/service/interface/function'
import { useI18n } from 'vue-i18n'

const $router = useRouter()
const { t: $t } = useI18n()

const APP_ID = $env.facebook.app_id
const FB_OPTION = JSON.stringify($env.facebook.login_option)
const IFRAME_SRC = `${cross_login_url}?app_id=${APP_ID}&option=${FB_OPTION}&text=${$t('v1.view.oauth.login.btn_text')}`

/**
 * - do fb bị lỗi không thêm mới được white domain, nên phải đăng nhập thông qua 
 * iframe của bot bán hàng, sau đó send event ra ngoài
 * - hàm này nhận data được gửi từ iframe
 */
function getFacebookToken($event: MessageEvent<{
    data: {
        authResponse: {
            accessToken: string
            userID: string
        }
    }
    from: 'FACEBOOK_IFRAME'
    event: 'LOGIN'
}>) {
    // chỉ xử lý các data được gửi từ iframe bbh với event là login
    if (
        !$event ||
        !$event.data ||
        !$event.data.data ||
        $event.data.from !== 'FACEBOOK_IFRAME' ||
        $event.data.event !== 'LOGIN'
    ) return

    const FACEBOOK_RESPONSE = $event.data.data

    if (
        !FACEBOOK_RESPONSE.authResponse ||
        !FACEBOOK_RESPONSE.authResponse.accessToken
    ) return

    loginChatbox(FACEBOOK_RESPONSE.authResponse.accessToken)
}
/**
 * - đăng nhập chatbox bằng token fb
 */
function loginChatbox(access_token: string) {
    const DATA: {
        access_token: string
    } = {
        access_token: ''
    }
    flow([
        (cb: CbError) => login_facebook(access_token, (e, r) => {
            if (e) return cb(e)

            DATA.access_token = r.access_token
            cb()
        }),
        (cb: CbError) => { // * lưu token xuống local
            setItem('access_token', DATA.access_token)

            cb()
        },
        (cb: CbError) => { // * redirect sang dashboard
            $router.push('/main/dashboard')

            cb()
        },
    ], undefined, true)
}

// lắng nghe iframe gửi dữ liệu
onMounted(() => window.addEventListener("message", getFacebookToken))
 // huỷ sự kiện lắng nghe khi un mount component này
onUnmounted(() => window.removeEventListener('message', getFacebookToken))
</script>