<template>
    <div class="relative">
        <div v-if="is_loading" class="absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] z-10">
            <Loading />
        </div>
        <template v-if="isMobile()">
            <button @click="loginIos"
                class="flex items-center justify-center hover:brightness-90 text-white bg-blue-500 w-full h-full"
                :style="{ borderRadius: border_radius }">
                <img src="https://botbanhang.vn/logo/fb-1.svg">
                {{ text }}
            </button>
        </template>
        <template v-else>
            <iframe @load="removeLoading" loading="lazy" class="relative z-[2] w-full h-full" v-if="iframe_src"
                :src="iframe_src" frameborder="0" />
        </template>
    </div>
</template>
<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { cross_login_url } from '@/service/constant/botbanhang'
import { isMobile } from '@/service/function'
import { FacebookLogin } from '@capacitor-community/facebook-login'

import Loading from '../Loading.vue'

import type { CbError } from '@/service/interface/function'
import { waterfall } from 'async'
import { toastError } from '@/service/helper/alert'

const $emit = defineEmits(['access_token'])

const $props = withDefaults(defineProps<{
    /**nội dung hiển thị trên button */
    text?: string
    /**scoped của fb được truyền vào */
    option?: string
    /**app id của fb */
    app_id?: string
    /**bo viền cho button */
    border_radius?: string
}>(), {
    border_radius: '50px'
})

/**url của iframe */
const iframe_src = ref('')
/**có hiển thị loading hay không */
const is_loading = ref(!isMobile())

/**đăng nhập bằng sdk của fb trên ios */
function loginIos() {
    waterfall([
        // * kích hoạt loading
        (cb: CbError) => {
            is_loading.value = true

            cb()
        },
        // * đăng nhập bằng sdk
        (cb: CbError) => FacebookLogin
            .login({ permissions: $env.facebook.permissions })
            .then(r => {
                $emit('access_token', r?.accessToken?.token)

                cb()
            })
            .catch(e => cb(e))
    ], e => {
        is_loading.value = false

        if (e) return toastError(e)
    })
}
/**tắt loading khi iframe load thành công */
function removeLoading() {
    is_loading.value = false
}
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

    $emit('access_token', FACEBOOK_RESPONSE.authResponse.accessToken)
}
/**khởi tạo url và các option của iframe */
function genIframeSrc() {
    const APP_ID = $env.facebook.app_id
    let login_option = {
        ...$env.facebook.login_option,
        scope: $env.facebook.permissions.join()
    }
    const FB_OPTION = JSON.stringify(login_option)

    iframe_src.value = `${cross_login_url}?app_id=${$props.app_id || APP_ID}&option=${$props.option || FB_OPTION}&text=${$props.text}&border_radius=${$props.border_radius || ''}`
}

onMounted(() => {
    // lắng nghe iframe gửi dữ liệu
    window.addEventListener("message", getFacebookToken)

    // khởi tạo url của irame
    genIframeSrc()
})
// huỷ sự kiện lắng nghe khi un mount component này
onUnmounted(() => window.removeEventListener('message', getFacebookToken))
</script>