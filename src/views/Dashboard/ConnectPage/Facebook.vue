<template>
  <EmptyPage
    :icon="FacebookIcon"
    :guild="$t('v1.view.main.dashboard.select_platform.facebook.guild')"
    :description="
      $t('v1.view.main.dashboard.select_platform.facebook.description')
    "
  >
    <template #button>
      <Facebook
        :option="genFBSelectPageOption()"
        @access_token="syncFacebookPage"
        class="h-9"
      />
    </template>
  </EmptyPage>
</template>
<script setup lang="ts">
import { sync_facebook_page } from '@/service/api/chatbox/n4-service'
import { useCommonStore, useConnectPageStore } from '@/stores'

import EmptyPage from '@/views/Dashboard/ConnectPage/EmptyPage.vue'
import Facebook from '@/components/OAuth/Facebook.vue'

import FacebookIcon from '@/components/Icons/Facebook.vue'

const connectPageStore = useConnectPageStore()
const commonStore = useCommonStore()

/**sử dụng thiết lập này để hiển thị danh sách trang muốn cấp quyền */
function genFBSelectPageOption() {
  let login_option = {
    scope: [
      'public_profile',
      'pages_show_list',
      'pages_messaging',
      'email',
      'pages_read_user_content',
      'pages_read_engagement',
      'read_insights',
      'instagram_basic',
      'instagram_manage_comments',
      'instagram_manage_insights',
      'pages_manage_metadata',
      'pages_manage_posts',
      'pages_manage_engagement',
      'ads_management',
    ].join(),
    enable_profile_selector: true,
    auth_type: 'rerequest',
  }
  return JSON.stringify(login_option)
}
/**đồng bộ dữ liệu page mới nhất từ fb */
async function syncFacebookPage(access_token: string, from: string) {
  // hiển thị loading
  commonStore.is_loading_full_screen = true

  try {
    // đồng bộ dữ liệu page từ fb
    await new Promise((resolve, reject) =>
      sync_facebook_page(access_token, undefined, (e, r) => {
        if (e) return reject(e)

        resolve(undefined)
      })
    )
  } catch (e) {}

  // quay lại page danh sách trang
  connectPageStore.selectMenu('WATTING')

  // tắt loading
  commonStore.is_loading_full_screen = false
}
</script>
