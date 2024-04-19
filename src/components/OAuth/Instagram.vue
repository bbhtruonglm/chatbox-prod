<template>
    <button @click="oAuthByRedirectFb" class="bg-red-600 hover:brightness-90 text-white flex items-center py-2 px-5 rounded-md">
        <img src="@/assets/icons/instagram.svg" class="w-4 h-4" />
        <div class="ml-2">
            {{ text }}
        </div>
    </button>
</template>
<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'

const $emit = defineEmits(['access_token'])

const $props = withDefaults(defineProps<{
    /**nội dung hiển thị trên button */
    text?: string
}>(), {})

const $route = useRoute()

onMounted(() => afterOauth())

/**cấp quyền bằng cách redirect của FB */
function oAuthByRedirectFb() {
    window.location.href = `https://www.facebook.com/dialog/oauth?client_id=${$env.facebook.v2.app_id}&display=page&extras={"setup":{"channel":"IG_API_ONBOARDING"}}&redirect_uri=${encodeURIComponent($env.facebook.v2.instagram.redirect_uri)}&response_type=token&scope=${$env.facebook.v2.instagram.scoped.join()}`
}
/**xử lý sau khi OAuth xong */
function afterOauth() {
    // nếu không có hash của FB thì không làm gì cả
    if (!$route.hash) return

    /**mã token 3 tháng */
    const TOKEN = /long_lived_token=([^&]*)/.exec($route.hash)?.[1]

    // nếu không có token thì không làm gì cả
    if (!TOKEN) return

    // gửi token lên component cha
    $emit('access_token', TOKEN)
}
</script>