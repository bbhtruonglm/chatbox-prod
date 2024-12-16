<template>
  <div class="bg-white shadow-sm rounded-lg relative overflow-x-auto max-w-96">
    <Loading
      v-if="is_loading"
      type="FULL"
    />
    <div class="flex gap-2 p-2 flex-col w-96">
      <div class="flex items-center justify-between">
        <small class="flex text-xxs">
          <template v-if="creator_name">
            {{ $t('v1.view.main.dashboard.chat.post.post_by') }}
            <strong class="ml-1 font-bold">
              {{ creator_name }}
            </strong>
            <span class="px-1">-</span>
          </template>
          {{
            $date_handle.formatCompareCurrentYear(message?.post?.updated_time)
          }}
        </small>
        <a
          @click="$window_action.openNewTab(message?.post?.permalink_url)"
          href="javascript:;"
          class="text-xs"
        >
          {{ $t('v1.view.main.dashboard.chat.post.open_on_facebook') }}
        </a>
      </div>
      <div class="flex items-center gap-2">
        <img
          v-if="message?.post?.attachments?.data?.[0]?.media?.image?.src"
          :src="
            $cdn.fbPostImg(
              conversationStore.select_conversation?.fb_page_id,
              message?.fb_post_id
            )
          "
          class="w-14 h-10 rounded flex-shrink-0 object-contain"
        />
        <div>
          <p
            :class="ad_id ? 'line-clamp-1' : 'line-clamp-2'"
            class="text-sm"
          >
            {{ message?.post?.message }}
          </p>
          <small
            v-if="ad_id"
            class="flex items-center gap-1"
          >
            <SpeakerIcon class="w-3 h-3 text-orange-600" />
            <p class="text-xs text-orange-700">
              {{ $t('v1.view.main.dashboard.chat.post.from_ad') }}
            </p>
          </small>
        </div>
      </div>

      <div class="flex flex-col gap-1">
        <div class="bg-slate-100 rounded py-1 px-2 flex gap-1 justify-between">
          <p class="text-sm text-slate-900">
            {{ message?.message_text }}
          </p>
          <EyeSlashIcon
            class="w-5 h-5 text-slate-700 flex-shrink-0 cursor-pointer"
          />
        </div>

        <div class="flex flex-col text-xs">
          <div class="flex items-center">
            <div class="w-5 h-5 text-slate-700 flex-shrink-0">
              <svg
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12.5007 8.33398L16.6673 12.5007M16.6673 12.5007L12.5007 16.6673M16.6673 12.5007H6.66732C5.78326 12.5007 4.93542 12.1495 4.31029 11.5243C3.68517 10.8992 3.33398 10.0514 3.33398 9.16732V3.33398"
                  stroke="#64748B"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></path>
              </svg>
            </div>
            <div class="w-full overflow-hidden">
              <p
                class="text-sm bg-slate-100 text-slate-900 text-left rounded-md px-2 py-1"
              >
                Anh vui lòng check tin nhắn ạ
              </p>
            </div>
          </div>
          <div class="flex items-center text-xs- ml-6 gap-2 leading-4">
            <p class="font-medium">Tùng Nguyễn</p>
            <div class="w-1 h-1 flex-shrink-0 bg-slate-900 rounded-full"></div>
            <p class="">5 phút trước</p>
          </div>
        </div>

        <div class="flex flex-col text-xs">
          <div class="flex items-center">
            <div class="w-5 h-5 text-slate-700 flex-shrink-0">
              <svg
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12.5007 8.33398L16.6673 12.5007M16.6673 12.5007L12.5007 16.6673M16.6673 12.5007H6.66732C5.78326 12.5007 4.93542 12.1495 4.31029 11.5243C3.68517 10.8992 3.33398 10.0514 3.33398 9.16732V3.33398"
                  stroke="#64748B"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></path>
              </svg>
            </div>
            <div class="w-full overflow-hidden">
              <p
                class="text-sm bg-slate-100 text-slate-900 text-left rounded-md px-2 py-1"
              >
                Anh vui lòng check tin nhắn ạ
              </p>
            </div>
          </div>
          <div class="flex items-center text-xs- ml-6 gap-2 leading-4">
            <p class="font-medium">Tùng Nguyễn</p>
            <div class="w-1 h-1 bg-slate-900 rounded-full"></div>
            <p>5 phút trước</p>
          </div>
        </div>
      </div>

      <div class="flex items-center justify-between text-xs font-regular">
        <button
          class="flex items-center justify-center rounded-md bg-slate-200 px-3 py-2"
        >
          <div class="w-3 h-3 text-slate-900 mr-1">
            <svg
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M2.40182 10.8221C2.48965 10.8378 2.57866 10.8502 2.66845 10.8589C2.77758 10.8696 2.88823 10.875 3 10.875C3.65765 10.875 4.27223 10.6865 4.79158 10.3607C5.17845 10.4517 5.5834 10.5 6 10.5C8.66101 10.5 10.875 8.51533 10.875 6C10.875 3.48467 8.66101 1.5 6 1.5C3.33899 1.5 1.125 3.48467 1.125 6C1.125 7.20428 1.6373 8.29356 2.46185 9.09617C2.57786 9.20909 2.60054 9.30982 2.58911 9.36743C2.52627 9.68423 2.38344 9.97257 2.18178 10.2106C2.09508 10.3129 2.06963 10.4537 2.11504 10.5799C2.16045 10.7061 2.2698 10.7985 2.40182 10.8221ZM4.125 5.4375C3.81434 5.4375 3.5625 5.68934 3.5625 6C3.5625 6.31066 3.81434 6.5625 4.125 6.5625C4.43566 6.5625 4.6875 6.31066 4.6875 6C4.6875 5.68934 4.43566 5.4375 4.125 5.4375ZM5.4375 6C5.4375 5.68934 5.68934 5.4375 6 5.4375C6.31066 5.4375 6.5625 5.68934 6.5625 6C6.5625 6.31066 6.31066 6.5625 6 6.5625C5.68934 6.5625 5.4375 6.31066 5.4375 6ZM7.875 5.4375C7.56434 5.4375 7.3125 5.68934 7.3125 6C7.3125 6.31066 7.56434 6.5625 7.875 6.5625C8.18566 6.5625 8.4375 6.31066 8.4375 6C8.4375 5.68934 8.18566 5.4375 7.875 5.4375Z"
                fill="currentColor"
              ></path>
            </svg>
          </div>
          <p>Trả lời</p></button
        ><button class="flex items-center bg-slate-200 rounded-md px-3 py-2">
          <div class="w-3 h-3 text-slate-900 mr-1">
            <svg
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1.73939 1.2024C1.60702 1.16394 1.46422 1.20121 1.36753 1.29945C1.27083 1.39768 1.23582 1.54105 1.27636 1.67279L2.4925 5.62524H6.75037C6.95747 5.62524 7.12537 5.79314 7.12537 6.00024C7.12537 6.20735 6.95747 6.37524 6.75037 6.37524H2.4925L1.2764 10.3276C1.23587 10.4593 1.27087 10.6027 1.36757 10.7009C1.46427 10.7991 1.60707 10.8364 1.73944 10.798C5.08873 9.82497 8.19908 8.29095 10.962 6.3046C11.06 6.23415 11.1181 6.12082 11.1181 6.00012C11.1181 5.87942 11.06 5.7661 10.962 5.69564C8.19906 3.70933 5.08869 2.17535 1.73939 1.2024Z"
                fill="currentColor"
              ></path>
            </svg>
          </div>
          <p>Gửi tin trả lời</p>
        </button>
      </div>
    </div>
  </div>

  <br />

  <div
    v-if="is_get_post_success"
    class="max-w-96 bg-white rounded-lg p-2 flex flex-col gap-2 relative"
  >
    <Loading
      v-if="is_loading"
      type="FULL"
    />
    <div class="text-[10px]">
      {{ $t('v1.view.main.dashboard.chat.post.post_by') }}
      <span class="font-bold">
        {{ post_info?.admin_creator?.name || post_info?.from?.name }}
      </span>
      -
      {{ formatDate(post_info?.updated_time) }}
    </div>
    <div class="flex items-center gap-3 h-16">
      <img
        v-if="post_info?.attachments?.data?.[0]?.media?.image?.src"
        :src="
          $cdn.fbPostImg(
            conversationStore.select_conversation?.fb_page_id,
            post_info?.id
          )
        "
        class="w-20 h-full flex-shrink-0 rounded"
      />
      <div class="text-sm h-full line-clamp-3">
        {{ post_info?.message }}
      </div>
    </div>
    <div
      class="flex bg-slate-100 py-1.5 px-3 rounded justify-between items-center gap-2"
    >
      <div class="text-sm font-bold truncate">
        {{ post_info?.attachments?.data?.[0].title }}
      </div>
      <button
        @click="toggleModal"
        class="bg-blue-600 text-[8px] font-bold text-white py-1 px-5 rounded flex-shrink-0"
      >
        {{ $t('v1.view.main.dashboard.chat.post.open_message') }}
      </button>
    </div>
    <div class="flex justify-between">
      <div class="flex items-center gap-1">
        <template v-if="ad_id">
          <SpeakerIcon
            v-tooltip.bottom="$t('v1.view.main.dashboard.chat.post.from_ad')"
            class="w-3 h-3"
          />
          <span class="text-xs text-gray-500">
            {{ $t('v1.view.main.dashboard.chat.post.from_ad') }}
          </span>
        </template>
      </div>
      <a
        class="text-blue-500 text-xs underline cursor-pointer"
        @click="openPost()"
      >
        {{ $t('v1.view.main.dashboard.chat.post.open_on_facebook') }}
      </a>
    </div>
  </div>
  <FacebookCommentModal
    ref="fb_cmt_ref"
    :page_id="conversationStore.select_conversation?.fb_page_id"
    :client_id="conversationStore.select_conversation?.fb_client_id"
    :target_id="post_info?.id"
    :post_title="post_info.attachments?.data?.[0]?.title"
  />
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { format as format_date } from 'date-fns'
import { useConversationStore } from '@/stores'
import {
  get_post_from_ad_id,
  get_post_from_post_id,
} from '@/service/api/chatbox/n4-service'
import { openNewTab } from '@/service/function'
import { SingletonCdn } from '@/utils/helper/Cdn'
import { container } from 'tsyringe'
import { DateHandle } from '@/utils/helper/DateHandle'
import { WindowAction } from '@/utils/helper/Navigation'

import Loading from '@/components/Loading.vue'
import FacebookCommentModal from '@/components/Main/Dashboard/FacebookCommentModal.vue'

import SpeakerIcon from '@/components/Icons/Speaker.vue'
import EyeSlashIcon from '@/components/Icons/EyeSlash.vue'

import type { ComponentRef } from '@/service/interface/vue'
import type { MessageInfo } from '@/service/interface/app/message'

const conversationStore = useConversationStore()
const $cdn = SingletonCdn.getInst()
const $date_handle = container.resolve(DateHandle)
const $window_action = container.resolve(WindowAction)

const $props = withDefaults(
  defineProps<{
    /**id của bài viết */
    fb_post_id?: string
    /**id của quảng cáo */
    ad_id?: string
    /**dữ liệu tin nhắn */
    message?: MessageInfo
  }>(),
  {}
)

/** ref của modal */
const fb_cmt_ref = ref<ComponentRef>()
/** trạng thái lấy bài post có thành công hay ko */
const is_get_post_success = ref(true)
/** trạng is_loading bài post */
const is_loading = ref(false)
/** Dữ liệu bài post */
const post_info = ref<{
  /**id bài viết */
  id?: string
  /**dữ liệu của admin */
  admin_creator?: {
    /**tên */
    name: string
  }
  /**dữ liệu người tạo */
  from?: {
    /**tên */
    name: string
  }
  /**file đính kèm */
  attachments?: {
    /**dữ liệu */
    data?: [
      {
        /**đa phương tiện */
        media?: {
          /**hình ảnh chính */
          image?: {
            /**đường dẫn */
            src?: string
          }
        }
        /**tiêu đề bài viết */
        title?: string
      }
    ]
  }
  /**tội dung thông điệp */
  message?: string
  /**đường dẫn của bài viết */
  permalink_url?: string
  /**thời gian cập nhật bài vieets */
  updated_time?: string
}>({})

onMounted(() => {
  // lấy dữ liệu bài viết bình thường
  // if ($props.fb_post_id) getPostFromPostId()
  // lấy dữ liệu bài viết từ quảng cáo
  if ($props.ad_id) getPostFromAdId()
})

/**tên người tạo bài viết này */
const creator_name = computed(
  () =>
    $props.message?.post?.creator_name ||
    $props.message?.post?.admin_creator?.name ||
    $props.message?.post?.from?.name
)

/**chuyển đổi thời gian để hiển thị */
function formatDate(date?: string) {
  // nếu không có thời gian thì thôi
  if (!date) return ''

  return format_date(new Date(date), 'dd/MM/yy')
}
/** Dùng để bật tắt modal */
function toggleModal() {
  fb_cmt_ref.value?.toggleModal()
}
/** Lấy dữ liệu bài post từ ad_id  */
function getPostFromAdId() {
  get_post_from_ad_id(
    {
      page_id: conversationStore.select_conversation?.fb_page_id,
      ad_id: $props.ad_id,
    },
    (e, r) => {
      is_loading.value = false
      if (!r || !r.id) {
        is_get_post_success.value = false
        return
      }
      post_info.value = r
    }
  )
}
// /** Lấy dữ liệu bài post từ post_id */
// function getPostFromPostId() {
//   get_post_from_post_id(
//     {
//       page_id: conversationStore.select_conversation?.fb_page_id,
//       post_id: $props.fb_post_id,
//     },
//     (e, r) => {
//       is_loading.value = false
//       if (!r || !r.id) return (is_get_post_success.value = false)
//       post_info.value = r
//     }
//   )
// }
/** Mở bài post trên fb */
function openPost() {
  // nếu không có dữ liệu thì thôi
  if (!post_info.value?.permalink_url) return

  openNewTab(post_info.value?.permalink_url)
}

defineExpose({ is_get_post_success })
</script>
