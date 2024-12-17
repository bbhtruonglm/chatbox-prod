import type { FacebookCommentPost } from '@/service/interface/app/post'
import { N4Serivce } from '@/utils/api/N4Serivce'
import { singleton } from 'tsyringe'

/**gọi API module page của chatbox */
@singleton()
export class N4SerivceAppPost extends N4Serivce {
  constructor() {
    // gọi API module page của chatbot
    super('app/post')
  }

  /** Lấy bình luận chính của bài post với khách hàng */
  public async getMainComment(
    page_id: string,
    client_id: string,
    post_id: string,
    skip?: number,
    limit?: number
  ): Promise<FacebookCommentPost[]> {
    return this.post('get_comment', {
      page_id,
      client_id,
      target_id: post_id,
      limit,
      skip,
    })
  }
}
