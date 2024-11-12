/**quản lý các đường dẫn của media */
export interface ICdn {
  /**
   * đường dẫn ảnh đại diện của page facebook
   * @param page_id id của trang
   */
  fbPageAvt(page_id?: string): string
  /**
   * đường dẫn ảnh đại diện của user
   * @param user_id id của user
   */
  userAvt(user_id?: string): string
  /**
   * đường dẫn ảnh đại diện của client
   * @param page_id id của trang
   * @param client_id id của client
   */
  fbClientAvt(page_id?: string, client_id?: string): string
  /**
   * đường dẫn ảnh của post
   * @param page_id id của trang
   * @param post_id id của post
   */
  fbPostImg(page_id?: string, post_id?: string): string
  /**
   * đường dẫn media của comment
   * @param page_id id của trang
   * @param comment_id id của comment
   */
  fbCommentMedia(page_id?: string, comment_id?: string): string
  /**
   * đường dẫn media của message
   * @param page_id id của trang
   * @param message_id id của message
   * @param index index của media
   */
  fbMessageMedia(page_id?: string, message_id?: string, index?: number): string
}

/**quản lý các đường dẫn của media */
export class Cdn implements ICdn {
  /**Host media cdn */
  constructor(private readonly HOST = $env.host.media_cdn) {}

  fbPageAvt(page_id?: string) {
    return `${this.HOST}/media/fb/${page_id}/page`
  }
  userAvt(user_id?: string) {
    return `${this.HOST}/media/s/${user_id}/user`
  }
  fbClientAvt(page_id?: string, client_id?: string) {
    return `${this.HOST}/media/fb/${page_id}/client/${client_id}`
  }
  fbPostImg(page_id?: string, post_id?: string) {
    return `${this.HOST}/media/fb/${page_id}/post/${post_id}`
  }
  fbCommentMedia(page_id?: string, comment_id?: string) {
    return `${this.HOST}/media/fb/${page_id}/comment/${comment_id}`
  }
  fbMessageMedia(page_id?: string, message_id?: string, index?: number) {
    return `${this.HOST}/media/fb/${page_id}/message/${message_id}/${index}`
  }
}

/**quản lý các đường dẫn của media */
export class SingletonCdn extends Cdn {
  /**Singleton instance */
  private static inst: ICdn

  private constructor() {
    super()
  }

  /**lấy thực thể */
  static getInst() {
    // tạo instance nếu chưa có
    if (!this.inst) this.inst = new this()

    // trả về instance
    return this.inst
  }
}
