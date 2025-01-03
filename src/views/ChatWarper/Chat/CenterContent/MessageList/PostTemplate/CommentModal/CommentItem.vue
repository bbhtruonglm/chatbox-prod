<template>
  <div class="flex px-3 gap-3">
    <ClientAvatar
      :conversation="conversationStore.select_conversation"
      class="w-10 h-10 flex-shrink-0"
    />
    <div class="min-w-0 flex-grow flex flex-col gap-3">
      <div class="flex flex-col gap-0.5">
        <div class="rounded-xl bg-slate-100 py-1 px-3 text-sm">
          <div class="flex justify-between">
            <strong class="font-semibold">{{ comment?.from?.name }}</strong>
            <small class="text-slate-700">
              {{ $date_handle.formatCompareCurrentYear(comment?.createdAt) }}
            </small>
          </div>
          <p>{{ comment?.message }}</p>
        </div>
        <img
          v-if="comment?.photo"
          class="h-14 w-fit border rounded-xl"
          :src="
            $cdn.fbCommentMedia(
              conversationStore.select_conversation?.fb_page_id,
              comment.comment_id
            )
          "
        />
        <div class="font-medium text-sm flex items-center gap-5">
          <button @click="focusInput(comment?.comment_id)">
            {{ $t('v1.view.main.dashboard.chat.post.reply_comment') }}
          </button>
          <button @click="focusInput(comment?.comment_id)">
            {{ $t('v1.view.main.dashboard.chat.post.hide_comment') }}
          </button>
          <button
            @click="
              openPrivateInbox({
                target_id: comment?.comment_id,
                target_name: comment?.from?.name,
              })
            "
          >
            {{ $t('v1.view.main.dashboard.chat.post.private_inbox') }}
          </button>
        </div>
      </div>

      <CommentItem
        v-for="(chil_comment, chil_index) in comment?.child_comments"
        :page_id
        :client_id
        :target_id
        :message
        :message_index
        :comment="chil_comment"
        :index="chil_index"
      />

      <LoadMoreBtn
        v-if="!comment?.done_load_comment"
        @click="getFbPostChildComments(comment)"
        class=""
        :count="13"
      />

      <div class="flex relative">
        <input
          v-if="comment"
          v-model="comment.new_comment"
          :id="`input_${comment?.comment_id}`"
          class="w-full py-3.5 px-5 border rounded-full text-sm placeholder:text-slate-500"
          :placeholder="`Bình luận với vai trò ${pageStore.selected_page_list_info?.[conversationStore.select_conversation?.fb_page_id as string]?.page?.name}`"
          v-on:keyup.enter="
            sendPostComment(
              comment?.new_comment as string,
              comment?.comment_id,
              index
            )
          "
        />
        <div class="absolute right-2 top-1/2 -translate-y-1/2">
          <ArrowUpCircleIcon
            v-if="!comment?.sending_message"
            @click="
              sendPostComment(
                comment?.new_comment as string,
                comment?.comment_id,
                index
              )
            "
            class="w-10 h-10 cursor-pointer text-slate-500"
          />
          <Loading
            v-if="comment?.sending_message"
            class=""
          />
        </div>
      </div>
    </div>
  </div>

  <PrivateInboxModal
    ref="private_inbox_ref"
    :page_id="conversationStore?.select_conversation?.fb_page_id"
    :client_id="conversationStore?.select_conversation?.fb_client_id"
    :target_id="target_private_inbox?.target_id"
    :target_name="target_private_inbox?.target_name"
  />
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { waterfall } from 'async'
import {
  useConversationStore,
  useChatbotUserStore,
  usePageStore,
} from '@/stores'
import { toast, toastError } from '@/service/helper/alert'
import { SingletonCdn } from '@/utils/helper/Cdn'
import {
  get_fb_post_comments,
  send_post_comment,
} from '@/service/api/chatbox/n4-service'
import { container } from 'tsyringe'
import { DateHandle } from '@/utils/helper/DateHandle'

import CommentItem from '@/views/ChatWarper/Chat/CenterContent/MessageList/PostTemplate/CommentModal/CommentItem.vue'
import PrivateInboxModal from '@/views/ChatWarper/Chat/CenterContent/MessageList/PostTemplate/PrivateInboxModal.vue'
import ClientAvatar from '@/components/Avatar/ClientAvatar.vue'
import LoadMoreBtn from '@/views/ChatWarper/Chat/CenterContent/MessageList/PostTemplate/CommentModal/LoadMoreBtn.vue'

import { ArrowUpCircleIcon } from '@heroicons/vue/24/solid'

import type { ComponentRef } from '@/service/interface/vue'
import type { FacebookCommentPost } from '@/service/interface/app/post'
import type { CbError } from '@/service/interface/function'
import type { MessageInfo } from '@/service/interface/app/message'

interface TargetPrivateInbox {
  target_id?: string
  target_name?: string
}

// * Props
const $props = withDefaults(
  defineProps<{
    page_id?: string
    client_id?: string
    target_id?: string

    /**dữ liệu tin nhắn */
    message?: MessageInfo
    /**vị trí của tin nhắn */
    message_index?: number

    /**dữ liệu của bình luận này */
    comment?: FacebookCommentPost
    /**vị trí của bình luận này */
    index?: number
  }>(),
  {}
)

// * Use store
const conversationStore = useConversationStore()
const pageStore = usePageStore()
const $cdn = SingletonCdn.getInst()
const $date_handle = container.resolve(DateHandle)

/**giới hạn số bản ghi */
const LIMIT_RECORD = 3

/** Ref của modal private inbox */
const private_inbox_ref = ref<ComponentRef>()
/** Comments trong bài post */
const post_comments = ref<FacebookCommentPost[]>([])
/**bật loading */
const is_loading = ref(false)
/** Đối tượng private_inbox */
const target_private_inbox = ref<TargetPrivateInbox>({})

/** Tạo bình luận phụ vào 1 bình luận trong bài post */
function sendPostComment(
  comment: string,
  target_id?: string,
  comment_index?: number
) {
  if (!comment_index) return

  if (post_comments.value[comment_index].sending_message) return
  post_comments.value[comment_index].sending_message = true

  send_post_comment(
    {
      page_id: conversationStore.select_conversation?.fb_page_id,
      text: comment,
      target_id,
    },
    (e, r) => {
      post_comments.value[comment_index].sending_message = false
      post_comments.value[comment_index].new_comment = ''
      if (e) return toast('error', 'Gửi bình luận không thành công')
      toast('success', 'Gửi bình luận thành công')

      post_comments.value[comment_index].child_comments?.push({
        comment_id: r.id,
        from: {
          id: conversationStore.select_conversation?.fb_page_id,
          name: pageStore.selected_page_list_info?.[
            conversationStore.select_conversation?.fb_page_id as string
          ]?.page?.name,
        },
        message: comment,
        createdAt: new Date().toLocaleString(),
      })
    }
  )
}
/** Lấy bình luận phụ từ bình luận chính của fb */
function getFbPostChildComments(comment?: FacebookCommentPost) {
  if (is_loading.value) return

  waterfall(
    [
      // * bật loading
      (cb: CbError) => {
        is_loading.value = true

        cb()
      },
      // * đọc danh sách comment
      (cb: CbError) =>
        get_fb_post_comments(
          {
            client_id: $props.client_id,
            page_id: $props.page_id,
            target_id: comment?.comment_id,
            limit: LIMIT_RECORD,
            skip: comment?.skip_comment,
          },
          (e, r) => {
            if (e) return cb(e)

            if (!r?.length && comment) comment.done_load_comment = true

            if (r) comment?.child_comments?.push(...r)
            cb()
          }
        ),
      // * next
      (cb: CbError) => {
        if (comment)
          comment.skip_comment = (comment?.skip_comment || 0) + LIMIT_RECORD

        cb()
      },
    ],
    e => {
      is_loading.value = false

      if (e) return toastError(e)
    }
  )
}
/** Dùng để bật tắt modal private inbox */
function openPrivateInbox(target: TargetPrivateInbox) {
  target_private_inbox.value = target
  private_inbox_ref.value?.toggleModal()
}
/** Focus vào input của bình luận */
function focusInput(comment_id?: string) {
  let input = document.getElementById(`input_${comment_id}`)
  if (input) input.focus()
}
</script>
<style lang="scss" scoped>
@import '@/views/ChatWarper/Chat/CenterContent/MessageList/PostTemplate/style.scss';
</style>
