import type { FacebookCommentPost } from '@/service/interface/app/post'
import { N4Serivce } from '@/utils/api/N4Serivce'
import { singleton } from 'tsyringe'

/**dữ liệu của bình luận sau khi tạo */
interface ISendCommentRes {
  /**id của bình luận được tạo */
  id?: string
}

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
  /**trả lời bình luận */
  public async sendComment(
    page_id: string,
    target_id: string,
    text: string
  ): Promise<ISendCommentRes> {
    return this.post('send_comment', { page_id, target_id, text })
  }
  /**trả lời tin nhắn bí mật */
  public async sendPrivateReply(
    page_id: string,
    client_id: string,
    post_id: string,
    target_id: string,
    text: string
  ): Promise<ISendCommentRes> {
    return this.post('private_reply', {
      page_id,
      client_id,
      post_id,
      target_id,
      text,
    })
  }
}
