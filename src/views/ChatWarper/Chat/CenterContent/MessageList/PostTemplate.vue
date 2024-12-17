<template>
  <div
    id="chat__post-template"
    class="bg-white shadow-sm rounded-lg relative overflow-x-auto max-w-96"
  >
    <!-- <Loading
      v-if="is_loading"
      type="FULL"
    /> -->
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
          @click="$main.openCommentOnFb()"
          href="javascript:;"
          class="text-xs"
        >
          {{ $t('v1.view.main.dashboard.chat.post.open_on_facebook') }}
        </a>
      </div>
      <div class="flex items-center gap-2">
        <img
          v-if="
            message?.post?.content?.attachments?.data?.[0]?.media?.image?.src
          "
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
            :class="message?.ad_id ? 'line-clamp-1' : 'line-clamp-2'"
            class="text-sm"
          >
            {{ message?.post?.content?.message }}
          </p>
          <small
            v-if="message?.ad_id"
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
          v-for="comment of reply_comments"
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
        <button
          @click="$main.replyComment('REPLY')"
          class="btn"
        >
          <ChatDotIcon class="icon" />
          {{ $t('v1.view.main.dashboard.chat.post.reply_comment') }}
        </button>
        <button class="btn">
          <EyeSlashIcon class="icon" />
          {{ $t('v1.view.main.dashboard.chat.post.hide_comment') }}
        </button>
        <button
          @click="$main.replyComment('PRIVATE_REPLY')"
          class="btn"
        >
          <PaperAirplaneIcon class="icon" />
          {{ $t('v1.view.main.dashboard.chat.post.private_inbox') }}
        </button>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useConversationStore, useMessageStore } from '@/stores'
import { get_post_from_ad_id } from '@/service/api/chatbox/n4-service'
import { Cdn } from '@/utils/helper/Cdn'
import { container } from 'tsyringe'
import { DateHandle } from '@/utils/helper/DateHandle'
import { WindowAction, type IWindowAction } from '@/utils/helper/Navigation'
import { N4SerivceAppPost } from '@/utils/api/N4Service/Post'
import { error } from '@/utils/decorator/error'

import Loading from '@/components/Loading.vue'

import SpeakerIcon from '@/components/Icons/Speaker.vue'
import EyeSlashIcon from '@/components/Icons/EyeSlash.vue'
import CornerDownRightIcon from '@/components/Icons/CornerDownRight.vue'
import ChatDotIcon from '@/components/Icons/ChatDot.vue'
import PaperAirplaneIcon from '@/components/Icons/PaperAirplane.vue'

import type {
  IReplyCommentType,
  MessageInfo,
} from '@/service/interface/app/message'
import type { FacebookCommentPost } from '@/service/interface/app/post'

const conversationStore = useConversationStore()
const messageStore = useMessageStore()
const $cdn = container.resolve(Cdn)
const $date_handle = container.resolve(DateHandle)

const $props = withDefaults(
  defineProps<{
    /**dữ liệu tin nhắn */
    message?: MessageInfo
  }>(),
  {}
)

// /** trạng is_loading bài post */
// const is_loading = ref(false)

// onMounted(() => {
//   // lấy dữ liệu bài viết từ quảng cáo
//   if ($props.ad_id) getPostFromAdId()
// })

/** Lấy dữ liệu bài post từ ad_id  */
// function getPostFromAdId() {
//   get_post_from_ad_id(
//     {
//       page_id: conversationStore.select_conversation?.fb_page_id,
//       ad_id: $props.ad_id,
//     },
//     (e, r) => {
//       is_loading.value = false
//       if (!r || !r.id) {
//         is_get_post_success.value = false
//         return
//       }
//       post_info.value = r
//     }
//   )
// }

/** Dữ liệu bình luận trả lời */
const reply_comments = ref<FacebookCommentPost[]>()

class Main {
  /**
   * @param API_POST API lấy dữ liệu bài post
   * @param SERVICE_DATE_HANDLE xử lý thời gian
   * @param SERVICE_WINDOW_ACTION xử lý logic mở tab mới
   */
  constructor(
    private readonly API_POST: N4SerivceAppPost = container.resolve(
      N4SerivceAppPost
    ),
    private readonly SERVICE_DATE_HANDLE: DateHandle = container.resolve(
      DateHandle
    ),
    private readonly SERVICE_WINDOW_ACTION: IWindowAction = container.resolve(
      WindowAction
    )
  ) {}

  /**lấy một số comment mới nhất */
  @error()
  async getReplyComment(): Promise<void> {
    if (!conversationStore.select_conversation?.fb_page_id) return
    if (!conversationStore.select_conversation?.fb_client_id) return
    if (!$props.message?.comment_id) return

    // lấy vài comment mới nhất
    reply_comments.value = await this.API_POST.getMainComment(
      conversationStore.select_conversation?.fb_page_id,
      conversationStore.select_conversation?.fb_client_id,
      $props.message?.comment_id,
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
  /**mở bài viết ở vị trí comment này */
  openCommentOnFb() {
    this.SERVICE_WINDOW_ACTION.openNewTab(
      `https://fb.com/${$props.message?.comment_id}`
    )
  }
  /**kích hoạt trả lời bình luận này */
  replyComment(type: IReplyCommentType) {
    // lưu thông tin bình luận
    messageStore.reply_comment = {
      type,
      root_comment_id: $props.message?.comment_id,
      root_comment_message: $props.message?.message_text,
    }

    // focus vào input chat
    document.getElementById('chat-text-input-message')?.focus()
  }
}
const $main = new Main()

// lấy dữ liệu bình luận khi component được mount
onMounted(() => $main.getReplyComment())

/**tên người tạo bài viết này */
const creator_name = computed(
  () =>
    $props.message?.post?.creator_name ||
    $props.message?.post?.content?.admin_creator?.name ||
    $props.message?.post?.content?.from?.name
)

// khi có người rep lại bình luận, thì cập nhật
watch(
  () => $props.message?.comment?.comment_id,
  () => $main.getReplyComment()
)
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
