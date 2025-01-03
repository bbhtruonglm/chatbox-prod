import { useConversationStore } from '@/stores'
import { N4SerivceAppPost } from '@/utils/api/N4Service/Post'
import { container } from 'tsyringe'

import type { MessageInfo } from '@/service/interface/app/message'

/**dịch vụ của bài post */
export function composableService() {
  const conversationStore = useConversationStore()

  /**dịch vụ của bài post */
  class PostService {
    /**
     * @param API_POST API của bài post
     */
    constructor(
      private readonly API_POST = container.resolve(N4SerivceAppPost)
    ) {}

    /**ẩn bình luận */
    async toggleComment(type: 'HIDE' | 'SHOW', message?: MessageInfo) {
      // kiểm tra dữ liệu
      if (!conversationStore.select_conversation?.fb_page_id) return
      if (!conversationStore.select_conversation?.fb_client_id) return
      if (!message?.fb_post_id) return
      if (!message?.comment_id) return

      /**trạng thái ẩn bình luận */
      const IS_HIDDEN = type === 'HIDE' ? true : false

      // ẩn hoặc hiện bình luận
      await this.API_POST.toggleComment(
        conversationStore.select_conversation?.fb_page_id,
        conversationStore.select_conversation?.fb_client_id,
        message?.fb_post_id,
        message?.comment_id,
        IS_HIDDEN
      )

      // cập nhật lại trạng thái bình luận
      message.is_hidden_comment = IS_HIDDEN
    }
  }

  // trả về dữ liệu
  return { PostService }
}
