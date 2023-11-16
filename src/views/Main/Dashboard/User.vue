<template>
    <div class="w-full h-full flex items-center flex-col pt-[65px]">
        <StaffAvatar class="rounded-full" :id="chatbotUserStore.chatbot_user?.fb_staff_id" size="150" />
        <div class="mt-2 font-bold text-2xl text-slate-500">
            {{ chatbotUserStore.chatbot_user?.full_name }}
        </div>
        <div class="mt-10">
            <button @click="signout" class="bg-red-500 text-white font-semibold p-2 w-[300px] rounded-full">
                {{ $t('v1.view.main.dashboard.user.logout') }}
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useChatbotUserStore } from '@/stores'
import { signout } from '@/service/helper/oauth'

import StaffAvatar from '@/components/Avatar/StaffAvatar.vue'

const chatbotUserStore = useChatbotUserStore()
</script>