<template>
  <button
    @click="oAuthByRedirectZalo"
    class="flex justify-between items-center py-2 px-4 gap-2 bg-slate-100 rounded-md hover:brightness-90"
  >
    <ZaloIcon class="w-4 h-4" />
    <div class="text-slate-900 text-sm font-semibold">
      {{ text }}
    </div>
  </button>
</template>
<script setup lang="ts">
import { flow } from '@/service/helper/async'
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  zalo_oa_get_url_oauth,
  sync_zalo_oa_page,
} from '@/service/api/chatbox/n4-service'
import { useChatbotUserStore } from '@/stores'

import ZaloIcon from '@/components/Icons/Zalo.vue'

import type { CbError } from '@/service/interface/function'

const $emit = defineEmits(['done'])

const $props = withDefaults(
  defineProps<{
    /**nội dung hiển thị trên button */
    text?: string
  }>(),
  {}
)

const $route = useRoute()
const $router = useRouter()
const chatbotUserStore = useChatbotUserStore()

onMounted(() => afterOauth())

/**cấp quyền bằng cách redirect của FB */
function oAuthByRedirectZalo() {
  flow(
    [
      // * lấy callback url
      (cb: CbError) =>
        zalo_oa_get_url_oauth((e, r) => {
          if (e) return cb(e)

          // mở callback url
          window.location.href = r
          cb()
        }),
    ],
    undefined,
    true
  )
}
/**xử lý sau khi OAuth xong */
function afterOauth() {
  // xoá query để không bị chạy 2 lần
  $router.replace({ path: $route.path, query: {} })

  // lấy dữ liệu từ query
  let { code, oa_id, state } = $route.query

  // nếu thiếu dữ liệu thì không làm gì cả
  if (!code || !oa_id || !state) return

  flow(
    [
      // dùng thủ thuật để đợi 1s để lấy dữ liệu user
      (cb: CbError) => setTimeout(() => cb(), 1000),
      // * khởi tạo page lên hệ thống
      (cb: CbError) =>
        sync_zalo_oa_page(
          {
            oa_id: oa_id as string,
            code: code as string,
            code_verifier: state as string,
            staff_name: chatbotUserStore.chatbot_user?.full_name as string,
          },
          (e, r) => {
            if (e) return cb(e)

            cb()
          }
        ),
      // * đợi 1s
      (cb: CbError) => setTimeout(() => cb(), 1000),
      // * thông báo thành công
      (cb: CbError) => {
        cb()

        $emit('done')
      },
    ],
    undefined,
    true
  )
}
</script>
