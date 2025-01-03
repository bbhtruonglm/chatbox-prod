<template>
  <Modal
    @close_modal="onCloseModal"
    ref="modal_ref"
    class_header="!text-base"
    class_modal="h-3/4 gap-2"
    class_body="py-2 flex gap-3 w-[602px] bg-white rounded-lg p-2 flex flex-col relative"
  >
    <template v-slot:header>
      {{ $t('Xem bình luận bài viết') }}
    </template>
    <template v-slot:body>
      <div
        v-if="is_loading"
        class="absolute top-2 left-1/2 -translate-x-1/2"
      >
        <Loading />
      </div>
      <div class="flex gap-2 p-2 flex-col">
        <PostInfo
          :message
          :message_index
        />
        <MainComment
          :message
          :message_index
          v-model:is_loading="is_loading"
        />
      </div>
      <div class="overflow-y-auto flex flex-col gap-3">
        <template v-for="(comment, index) in post_comments">
          <div class="flex px-3 gap-3">
            <ClientAvatar
              :conversation="conversationStore.select_conversation"
              class="w-10 h-10 flex-shrink-0"
            />
            <div class="min-w-0 flex-grow flex flex-col gap-0.5">
              <div class="rounded-xl bg-slate-100 py-1 px-3 text-sm">
                <div class="flex justify-between">
                  <strong class="font-semibold">{{
                    comment.from?.name
                  }}</strong>
                  <small class="text-slate-700">
                    {{
                      $date_handle.formatCompareCurrentYear(comment?.createdAt)
                    }}
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
                <button @click="focusInput(comment.comment_id)">
                  {{ $t('v1.view.main.dashboard.chat.post.reply_comment') }}
                </button>
                <button @click="focusInput(comment.comment_id)">
                  {{ $t('v1.view.main.dashboard.chat.post.hide_comment') }}
                </button>
                <button
                  @click="
                    openPrivateInbox({
                      target_id: comment.comment_id,
                      target_name: comment.from?.name,
                    })
                  "
                >
                  {{ $t('v1.view.main.dashboard.chat.post.private_inbox') }}
                </button>
              </div>

              <div
                class="flex mt-3"
                v-for="chil_comment in comment.child_comments"
              >
                <div>
                  <PageAvatar
                    v-if="
                      chil_comment.from?.id ===
                      conversationStore.select_conversation?.fb_page_id
                    "
                    :page_info="pageStore.selected_page_list_info?.[conversationStore.select_conversation?.fb_page_id as string]?.page"
                    class="rounded-full w-10 h-10"
                  />

                  <ClientAvatar
                    v-else
                    :conversation="conversationStore.select_conversation"
                    class="w-10 h-10"
                  />
                </div>
                <div class="ml-3">
                  <div class="rounded-lg bg-slate-100 p-2 text-sm w-fit">
                    <p class="font-bold">{{ chil_comment.from?.name }}</p>
                    <p>{{ chil_comment.message }}</p>
                    <img
                      v-if="chil_comment.photo"
                      class="w-[60px] mt-3"
                      :src="
                        $cdn.fbCommentMedia(
                          conversationStore.select_conversation?.fb_page_id,
                          chil_comment.comment_id
                        )
                      "
                      alt=""
                    />
                  </div>
                  <div class="flex text-xs text-slate-400 mt-1.5">
                    <p
                      class="font-bold mr-3 cursor-pointer hover:text-orange-500"
                      @click="focusInput(comment.comment_id)"
                    >
                      {{ $t('v1.view.main.dashboard.chat.post.reply_comment') }}
                    </p>
                    <p
                      @click="
                        openPrivateInbox({
                          target_id: chil_comment.comment_id,
                          target_name: chil_comment.from?.name,
                        })
                      "
                      class="font-bold mr-3 cursor-pointer hover:text-orange-500"
                      v-if="
                        chil_comment.from?.id !==
                        conversationStore.select_conversation?.fb_page_id
                      "
                    >
                      {{ $t('v1.view.main.dashboard.chat.post.private_inbox') }}
                    </p>
                    <p>
                      {{
                        formatDistanceToNow(
                          new Date(chil_comment.createdAt as string),
                          {
                            locale: vi,
                          }
                        )
                      }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="flex relative pl-[60px]">
            <input
              v-model="comment.new_comment"
              :id="`input_${comment.comment_id}`"
              class="w-full py-3.5 px-5 border rounded-full text-sm placeholder:text-slate-500"
              :placeholder="`Bình luận với vai trò ${pageStore.selected_page_list_info?.[conversationStore.select_conversation?.fb_page_id as string]?.page?.name}`"
              v-on:keyup.enter="
                sendPostComment(
                  comment.new_comment as string,
                  comment.comment_id,
                  index
                )
              "
            />
            <div class="absolute right-2 top-1/2 -translate-y-1/2">
              <ArrowUpCircleIcon
                v-if="!comment.sending_message"
                @click="
                  sendPostComment(
                    comment.new_comment as string,
                    comment.comment_id,
                    index
                  )
                "
                class="w-10 h-10 cursor-pointer text-slate-500"
              />
              <Loading
                v-if="comment.sending_message"
                class=""
              />
            </div>
          </div>

          <button
            v-if="!comment.done_load_comment"
            @click="getFbPostChildComments(comment)"
            class="text-sm font-medium w-fit pl-[116px]"
          >
            {{ $t('v1.view.main.dashboard.chat.post.get_more_comments') }}
            (13)
          </button>
        </template>
        <button
          v-if="!done_load_comment"
          @click="getFbPostComments"
          class="text-sm font-medium w-fit pl-3"
        >
          {{ $t('v1.view.main.dashboard.chat.post.get_more_comments') }}
        </button>
      </div>
    </template>
  </Modal>
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
import formatDistanceToNow from 'date-fns/formatDistanceToNow'
import vi from 'date-fns/locale/vi'
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

import MainComment from '@/views/ChatWarper/Chat/CenterContent/MessageList/PostTemplate/MainComment.vue'
import Modal from '@/components/Modal.vue'
// import PrivateInboxModal from './PrivateInboxModal.vue'
import ClientAvatar from '@/components/Avatar/ClientAvatar.vue'
import PageAvatar from '@/components/Avatar/PageAvatar.vue'
import Loading from '@/components/Loading.vue'
import PostInfo from '@/views/ChatWarper/Chat/CenterContent/MessageList/PostTemplate/PostInfo.vue'

import SendMessageIcon from '@/assets/icons/send.svg'
import { ArrowUpCircleIcon } from '@heroicons/vue/24/solid'

import type { ComponentRef } from '@/service/interface/vue'
import type { FacebookCommentPost } from '@/service/interface/app/post'
import type { CbError } from '@/service/interface/function'
import type { MessageInfo } from '@/service/interface/app/message'
import { container } from 'tsyringe'
import { DateHandle } from '@/utils/helper/DateHandle'

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
  }>(),
  {}
)

// * Use store
const conversationStore = useConversationStore()
const chatbotUserStore = useChatbotUserStore()
const pageStore = usePageStore()
const $cdn = SingletonCdn.getInst()
const $date_handle = container.resolve(DateHandle)

/**giới hạn số bản ghi */
const LIMIT_RECORD = 3

/** Ref của modal */
const modal_ref = ref<ComponentRef>()
/** Ref của modal private inbox */
const private_inbox_ref = ref<ComponentRef>()
/** Comments trong bài post */
const post_comments = ref<FacebookCommentPost[]>([])
/** gắn cờ đã load hết bình luận chính */
const done_load_comment = ref<boolean>()
/**phân trang bình luận chính */
const skip_comment = ref(0)
/**bật loading */
const is_loading = ref(false)
/** Đối tượng private_inbox */
const target_private_inbox = ref<TargetPrivateInbox>({})

/**xoá dữ liệu khi modal tắt */
function onCloseModal() {
  post_comments.value = []

  skip_comment.value = 0

  done_load_comment.value = false

  is_loading.value = false
}
/** Dùng để bật modal */
function toggleModal() {
  getFbPostComments()

  modal_ref.value?.toggleModal()
}
/** Dùng để bật tắt modal private inbox */
function openPrivateInbox(target: TargetPrivateInbox) {
  target_private_inbox.value = target
  private_inbox_ref.value?.toggleModal()
}
/** Lấy bình luận chính từ bài post của fb */
function getFbPostComments() {
  if (is_loading.value) return

  waterfall(
    [
      // * bật loading
      (cb: CbError) => {
        is_loading.value = true

        cb()
      },
      // * gọi api lấy danh sách comment
      (cb: CbError) =>
        get_fb_post_comments(
          {
            client_id: $props.client_id,
            page_id: $props.page_id,
            target_id: $props.target_id,
            limit: LIMIT_RECORD,
            skip: skip_comment.value,
          },
          (e, r) => {
            if (e) return cb(e)

            if (!r?.length) done_load_comment.value = true

            // thêm field cho comment gốc
            if (r)
              post_comments.value.push(
                ...r.map((comment: FacebookCommentPost) => {
                  comment.child_comments = []
                  comment.done_load_comment = false
                  comment.skip_comment = 0
                  comment.new_comment = ''
                  comment.sending_message = false

                  return comment
                })
              )

            cb()
          }
        ),
      // * next
      (cb: CbError) => {
        skip_comment.value += LIMIT_RECORD

        cb()
      },
    ],
    e => {
      is_loading.value = false

      if (e) return toastError(e)
    }
  )
}
/** Lấy bình luận phụ từ bình luận chính của fb */
function getFbPostChildComments(comment: FacebookCommentPost) {
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
            target_id: comment.comment_id,
            limit: LIMIT_RECORD,
            skip: comment.skip_comment,
          },
          (e, r) => {
            if (e) return cb(e)

            if (!r?.length) comment.done_load_comment = true

            if (r) comment.child_comments?.push(...r)
            cb()
          }
        ),
      // * next
      (cb: CbError) => {
        comment.skip_comment = (comment.skip_comment || 0) + LIMIT_RECORD

        cb()
      },
    ],
    e => {
      is_loading.value = false

      if (e) return toastError(e)
    }
  )
}
/** Focus vào input của bình luận */
function focusInput(comment_id: string) {
  let input = document.getElementById(`input_${comment_id}`)
  if (input) input.focus()
}
/** Tạo bình luận phụ vào 1 bình luận trong bài post */
function sendPostComment(
  comment: string,
  target_id: string,
  comment_index: number
) {
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

defineExpose({ toggleModal })
</script>
<style lang="scss" scoped>
@import '@/views/ChatWarper/Chat/CenterContent/MessageList/PostTemplate/style.scss';
</style>
