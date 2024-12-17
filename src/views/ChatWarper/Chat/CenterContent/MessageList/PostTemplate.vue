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
        <div class="comment-item flex gap-1 justify-between">
          {{ message?.message_text }}
          <EyeSlashIcon
            class="w-5 h-5 text-slate-700 flex-shrink-0 cursor-pointer"
          />
        </div>

        <div
          v-for="comment of comments"
          class="flex flex-col"
        >
          <div class="flex items-center">
            <CornerDownRightIcon class="w-5 h-5 text-slate-700 flex-shrink-0" />
            <p class="flex-grow comment-item">
              {{ comment?.message }}
            </p>
          </div>
          <div class="flex items-center text-xxs ml-6 gap-1">
            <p class="font-medium truncate">
              {{ comment?.from?.name }}
            </p>
            <div class="w-1 h-1 flex-shrink-0 bg-black rounded-full" />
            <p class="text-slate-700 flex-shrink-0">
              {{ $main.commentDuration(comment?.createdAt) }}
            </p>
          </div>
        </div>
      </div>

      <div class="flex items-center justify-between text-xs gap-2">
        <button class="btn">
          <ChatDotIcon class="icon" />
          {{ $t('v1.view.main.dashboard.chat.post.reply_comment') }}
        </button>
        <button class="btn">
          <EyeSlashIcon class="icon" />
          {{ $t('v1.view.main.dashboard.chat.post.hide_comment') }}
        </button>
        <button class="btn">
          <PaperAirplaneIcon class="icon" />
          {{ $t('v1.view.main.dashboard.chat.post.private_inbox') }}
        </button>
      </div>
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
import CornerDownRightIcon from '@/components/Icons/CornerDownRight.vue'
import ChatDotIcon from '@/components/Icons/ChatDot.vue'
import PaperAirplaneIcon from '@/components/Icons/PaperAirplane.vue'

import type { ComponentRef } from '@/service/interface/vue'
import type { MessageInfo } from '@/service/interface/app/message'
import { N4SerivceAppPost } from '@/utils/api/N4Service/Post'
import { error } from '@/utils/decorator/error'
import type { FacebookCommentPost } from '@/service/interface/app/post'

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

/** Dữ liệu bình luận */
const comments = ref<FacebookCommentPost[]>()

class Main {
  /**
   * @param API_POST API lấy dữ liệu bài post
   * @param SERVICE_DATE_HANDLE xử lý thời gian
   */
  constructor(
    private readonly API_POST: N4SerivceAppPost = container.resolve(
      N4SerivceAppPost
    ),
    private readonly SERVICE_DATE_HANDLE: DateHandle = container.resolve(
      DateHandle
    )
  ) {}

  /**lấy một số comment mới nhất */
  @error()
  async getSomeComment(): Promise<void> {
    if (!conversationStore.select_conversation?.fb_page_id) return
    if (!conversationStore.select_conversation?.fb_client_id) return
    if (!$props.message?.fb_post_id) return

    // lấy vài comment mới nhất
    comments.value = await this.API_POST.getMainComment(
      conversationStore.select_conversation?.fb_page_id,
      conversationStore.select_conversation?.fb_client_id,
      $props.message?.fb_post_id,
      0,
      2
    )
  }
  /**
   * khoản thời gian từ lúc tạo đến bây giờ
   * @param created_at thời gian tạo bình luận
   */
  commentDuration(created_at?: string): string {
    return this.SERVICE_DATE_HANDLE.calcDuration(
      created_at,
      // so sánh với hiện tại
      Date.now(),
      // thêm ago vào cuối
      { addSuffix: true }
    )
  }
}
const $main = new Main()

// lấy dữ liệu bình luận khi component được mount
onMounted(() => $main.getSomeComment())

defineExpose({ is_get_post_success })
</script>
<style lang="scss" scoped>
.comment-item {
  @apply bg-slate-100 rounded py-1 px-2 text-sm text-slate-900;
}
.btn {
  @apply flex items-center justify-center rounded-md bg-slate-200 px-3 py-2 flex-grow gap-1;
  .icon {
    @apply w-3 h-3 text-slate-900;
  }
}
</style>
