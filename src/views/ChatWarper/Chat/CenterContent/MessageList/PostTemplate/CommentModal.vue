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
        <CommentItem
          v-for="(comment, index) in post_comments"
          :page_id
          :client_id
          :target_id
          :message
          :message_index
          :comment
          :index
        />
        <LoadMoreBtn
          v-if="!done_load_comment"
          @click="getFbPostComments"
          class="pl-3"
        />
      </div>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { waterfall } from 'async'
import { toastError } from '@/service/helper/alert'
import { get_fb_post_comments } from '@/service/api/chatbox/n4-service'

import MainComment from '@/views/ChatWarper/Chat/CenterContent/MessageList/PostTemplate/MainComment.vue'
import Modal from '@/components/Modal.vue'

import Loading from '@/components/Loading.vue'
import PostInfo from '@/views/ChatWarper/Chat/CenterContent/MessageList/PostTemplate/PostInfo.vue'
import LoadMoreBtn from '@/views/ChatWarper/Chat/CenterContent/MessageList/PostTemplate/CommentModal/LoadMoreBtn.vue'

import CommentItem from '@/views/ChatWarper/Chat/CenterContent/MessageList/PostTemplate/CommentModal/CommentItem.vue'

import type { ComponentRef } from '@/service/interface/vue'
import type { FacebookCommentPost } from '@/service/interface/app/post'
import type { CbError } from '@/service/interface/function'
import type { MessageInfo } from '@/service/interface/app/message'

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

/**giới hạn số bản ghi */
const LIMIT_RECORD = 3

/** Ref của modal */
const modal_ref = ref<ComponentRef>()
/** Comments trong bài post */
const post_comments = ref<FacebookCommentPost[]>([])
/** gắn cờ đã load hết bình luận chính */
const done_load_comment = ref<boolean>()
/**phân trang bình luận chính */
const skip_comment = ref(0)
/**bật loading */
const is_loading = ref(false)

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

defineExpose({ toggleModal })
</script>
<style lang="scss" scoped>
@import '@/views/ChatWarper/Chat/CenterContent/MessageList/PostTemplate/style.scss';
</style>
