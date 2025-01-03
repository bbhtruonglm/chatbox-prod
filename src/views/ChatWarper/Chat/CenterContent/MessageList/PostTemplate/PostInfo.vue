<template>
  <div class="flex items-center justify-between">
    <small class="flex text-xxs">
      <template v-if="creator_name">
        {{ $t('v1.view.main.dashboard.chat.post.post_by') }}
        <strong class="ml-1 font-bold">
          {{ creator_name }}
        </strong>
        <span class="px-1">-</span>
      </template>
      {{ $date_handle.formatCompareCurrentYear(post_content?.updated_time) }}
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
      v-if="post_content?.attachments?.data?.[0]?.media?.image?.src"
      :src="
        $cdn.fbPostImg(
          conversationStore.select_conversation?.fb_page_id,
          post_id
        )
      "
      class="w-14 h-10 rounded flex-shrink-0 object-contain"
    />
    <div class="flex-grow">
      <p class="text-sm line-clamp-1">
        {{ post_content?.message }}
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
      <button
        v-else-if="is_show_btn_comment"
        @click="$main.toggleModal()"
        class="text-xs text-blue-700"
      >
        {{ $t('Xem bài viết') }}
      </button>
    </div>
  </div>
  <FacebookCommentModal
    ref="fb_cmt_ref"
    :page_id="conversationStore.select_conversation?.fb_page_id"
    :client_id="conversationStore.select_conversation?.fb_client_id"
    :target_id="post_id"
    :message
    :message_index
  />
</template>
<script setup lang="ts">
import { computed, ref } from 'vue'
import { useConversationStore } from '@/stores'
import { Cdn } from '@/utils/helper/Cdn'
import { container } from 'tsyringe'
import { DateHandle } from '@/utils/helper/DateHandle'
import { WindowAction, type IWindowAction } from '@/utils/helper/Navigation'

import FacebookCommentModal from '@/views/ChatWarper/Chat/CenterContent/MessageList/PostTemplate/CommentModal.vue'

import SpeakerIcon from '@/components/Icons/Speaker.vue'

import type { MessageInfo } from '@/service/interface/app/message'

const conversationStore = useConversationStore()
const $cdn = container.resolve(Cdn)
const $date_handle = container.resolve(DateHandle)

const $props = withDefaults(
  defineProps<{
    /**dữ liệu tin nhắn */
    message?: MessageInfo
    /**vị trí của tin nhắn */
    message_index?: number
    /**có hiển thị nút xem toàn bộ comment không */
    is_show_btn_comment?: boolean
  }>(),
  {}
)

/** ref của modal */
const fb_cmt_ref = ref<InstanceType<typeof FacebookCommentModal>>()

/**tên người tạo bài viết này */
const creator_name = computed(
  () =>
    $props.message?.post?.creator_name ||
    $props.message?.post?.content?.admin_creator?.name ||
    $props.message?.post?.content?.from?.name
)
/**nội dung bài viết */
const post_content = computed(() => $props.message?.post?.content)
/**id bài viết */
const post_id = computed(
  () => $props.message?.fb_post_id || $props.message?.post?.content?.id
)

class Main {
  /**
   * @param SERVICE_WINDOW_ACTION xử lý logic mở tab mới
   */
  constructor(
    private readonly SERVICE_WINDOW_ACTION: IWindowAction = container.resolve(
      WindowAction
    )
  ) {}

  /** Dùng để bật tắt modal comment */
  toggleModal() {
    fb_cmt_ref.value?.toggleModal()
  }
  /**mở bài viết ở vị trí comment này */
  openCommentOnFb() {
    /**id mục tiêu */
    const TARGET_ID = $props.message?.comment_id || post_id.value

    // mở tab mới
    this.SERVICE_WINDOW_ACTION.openNewTab(`https://fb.com/${TARGET_ID}`)
  }
}
const $main = new Main()
</script>
