<template>
  <div class="comment-item flex gap-1 justify-between">
    {{ message?.message_text || ad_title }}
    <EyeSlashIcon
      v-if="message?.is_hidden_comment"
      @click="$main.toggleComment('SHOW')"
      class="w-5 h-5 text-slate-700 flex-shrink-0 cursor-pointer"
    />
  </div>
</template>
<script setup lang="ts">
import { error } from '@/utils/decorator/Error'
import { loadingV2 } from '@/utils/decorator/Loading'
import { container } from 'tsyringe'
import { computed } from 'vue'
import { composableService } from '@/views/ChatWarper/Chat/CenterContent/MessageList/PostTemplate/service'

import EyeSlashIcon from '@/components/Icons/EyeSlash.vue'

import type { MessageInfo } from '@/service/interface/app/message'

/**trạng thái loading */
const is_loading = defineModel('is_loading')

const $props = withDefaults(
  defineProps<{
    /**dữ liệu tin nhắn */
    message?: MessageInfo
    /**vị trí của tin nhắn */
    message_index?: number
  }>(),
  {}
)

const { PostService } = composableService()

/**tiêu đề quảng cáo */
const ad_title = computed(
  () => post_content.value?.attachments?.data?.[0]?.title
)
/**nội dung bài viết */
const post_content = computed(() => $props.message?.post?.content)

class Main {
  /**
   * @param API_POST API lấy dữ liệu bài post
   * @param SERVICE_DATE_HANDLE xử lý thời gian
   * @param SERVICE_WINDOW_ACTION xử lý logic mở tab mới
   */
  constructor(private readonly SERVICE_POST = container.resolve(PostService)) {}

  /**ẩn bình luận */
  @loadingV2(is_loading, 'value')
  @error()
  async toggleComment(type: 'HIDE' | 'SHOW') {
    // thực thi
    await this.SERVICE_POST.toggleComment(type, $props.message)
  }
}
const $main = new Main()
</script>
<style lang="scss" scoped>
@import '@/views/ChatWarper/Chat/CenterContent/MessageList/PostTemplate/style.scss';
</style>
