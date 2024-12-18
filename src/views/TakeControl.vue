<template>
  <div id="take-control">
    <Facebook
      :text="$t('v1.view.oauth.login.btn_text')"
      class="h-[40px] w-full md:w-[350px]"
      @access_token="loginChatbox"
    />

    <div class="h-[500px] overflow-y-auto flex flex-col gap-2">
      <button
        v-for="page of pages"
        @click="selected_page = page"
        class="flex items-center gap-2"
      >
        <img
          :src="`https://graph.facebook.com/${page?.id}/picture`"
          class="w-8 h-8 rounded-full"
        />
        {{ page?.name }} - {{ page?.id }}
      </button>
    </div>

    <button
      v-if="selected_page"
      @click="takeControl"
      class="flex items-center gap-2"
    >
      <img
        :src="`https://graph.facebook.com/${selected_page?.id}/picture`"
        class="w-8 h-8 rounded-full"
      />
      {{ selected_page?.name }}
    </button>
  </div>
</template>
<script setup lang="ts">
import { useCommonStore } from '@/stores'
import { ref } from 'vue'

import Facebook from '@/components/OAuth/Facebook.vue'
import { container } from 'tsyringe'
import { Toast } from '@/utils/helper/Alert/Toast'

const $toast = container.resolve(Toast)

const pages = ref<any[]>()
const selected_page = ref<any>()

/**đăng nhập chatbox bằng token fb */
async function loginChatbox(access_token: string) {
  console.log(access_token)

  const RES = await fetch(
    `https://graph.facebook.com/v21.0/me/accounts?access_token=${access_token}&limit=200`
  )

  const PAGES = await RES.json()

  pages.value = PAGES?.data

  console.log(pages.value)
}

async function takeControl() {
  await fetch(
    `https://chatbox-merge-v2.botbanhang.vn/service/page/take_control_conversation?page_id=${selected_page.value?.id}&access_token=${selected_page.value?.access_token}`
  )

  $toast.success('ok')
}
</script>
