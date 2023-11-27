<template>
    <div class="relative md:flex md:flex-row-reverse md:h-full">
        <div @click="testLogin" class="absolute w-[10px] h-[10px] top-0 right-0 cursor-pointer" />
        <div
            class="w-full h-[250px] md:h-full md:w-2/4 bg-no-repeat bg-center bg-cover bg-[url(@/assets/imgs/login-background.svg)]" />
        <div
            class="mt-[-30px] md:mt-0 md:h-full md:w-2/4 px-8 py-10 md:py-24 rounded-t-[40px] bg-white relative h-[calc(100vh_-_244px)]">
            <img class="absolute top-[-150px] w-[60px] h-[60px] md:w-[80px] md:h-[80px] md:static md:mx-auto left-8"
                src="@/assets/imgs/chatbox.svg" />
            <div class="text-2xl font-semibold md:text-center md:mt-5">
                {{ $t('v1.view.oauth.login.login') }}
            </div>
            <div
                class="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-full px-[33px] flex justify-center">
                <Facebook :text="$t('v1.view.oauth.login.btn_text')" class="h-[40px] w-full md:w-[350px]"
                    @access_token="loginChatbox" />
            </div>
        </div>

        <div class="absolute bottom-[40px] left-8">
            <Language />
        </div>
    </div>
</template>

<script setup lang="ts">
import { flow } from '@/service/helper/async'
import { login_facebook } from '@/service/api/chatbox/n4-service'
import { getItem, setItem } from '@/service/helper/localStorage'
import { useRouter } from 'vue-router'
import { modal_input } from '@/service/helper/alert'

import Language from '@/components/Language.vue'
import Facebook from '@/components/OAuth/Facebook.vue'

import type { CbError } from '@/service/interface/function'
import { useI18n } from 'vue-i18n'
import { onMounted } from 'vue'

const $router = useRouter()
const { t: $t } = useI18n()

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

    $router.push('/main/dashboard/chat')
}
/**đăng nhập chatbox bằng token fb */
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
</script>