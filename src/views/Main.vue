<template>
    <RequirePricing />    
    <RouterView />
</template>

<script setup lang="ts">
import { read_me_chatbot_user } from '@/service/api/chatbox/n4-service'
import { flow } from '@/service/helper/async'
import type { CbError } from '@/service/interface/function'
import { useChatbotUserStore } from '@/stores'
import { onMounted } from 'vue'

import RequirePricing from '@/components/Main/RequirePricing.vue'

const chatbotUserStore = useChatbotUserStore()

// init các dữ liệu cần thiết
onMounted(() => getMeChatbotUser())

/**đọc các thông tin của user hiện tại đang đăng nhập */
function getMeChatbotUser() {
    flow([
        (cb: CbError) => read_me_chatbot_user((e, r) => { // * call api
            if (e) return cb(e)

            // lưu vào store
            chatbotUserStore.chatbot_user = r
            cb()
        }),
    ], undefined)
}

defineExpose({ getMeChatbotUser })
</script>