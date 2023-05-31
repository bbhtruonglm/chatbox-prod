<template>
    <RouterView />
</template>

<script setup lang="ts">
import { get_me_chatbot_user } from '@/service/api/chatbox/n4-service'
import { flow } from '@/service/helper/async'
import type { CbError } from '@/service/interface/function'
import { useAppStore } from '@/stores'
import { onMounted } from 'vue'

const appStore = useAppStore()

onMounted(() => getMeChatbotUser())

/**đọc các thông tin của user hiện tại đang đăng nhập */
function getMeChatbotUser() {
    flow([
        (cb: CbError) => get_me_chatbot_user((e, r) => { // * call api
            if (e) return cb(e)

            // lưu vào store
            appStore.chatbot_user = r
            cb()
        }),
    ], undefined, true)
}
</script>