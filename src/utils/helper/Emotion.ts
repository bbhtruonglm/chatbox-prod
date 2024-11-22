import type { MessageInfo } from '@/service/interface/app/message'

/**Lớp hỗ trợ xử lý cảm xúc */
export class Emotion {
  /**các cảm xúc */
  static #ICON: Record<string, string> = {
    like: '👍',
    happiness: '😊',
    happy: '😊',
    anger: '😡',
    angry: '😡',
    sadness: '😢',
    sad: '😢',
    fear: '😱',
    surprise: '😲',
    disgust: '🤢',
    love: '❤️',
    jealousy: '😒',
    shame: '😳',
    pride: '😌',
  }
  /**các cảm xúc tích cực */
  static #POSITIVE_EMOTION = [
    'like',
    'happiness',
    'happy',
    'love',
    'pride',
    'surprise',
  ]
  /**các cảm xúc cần nêu bật */
  static #HIGHT_LIGHT_EMOTION = ['happiness', 'happy', 'anger', 'angry', 'like']
  static #HIGHT_LIGHT_EMOTION_MESS_PAGE = ['anger', 'angry']
  static #HIGHT_LIGHT_EMOTION_MESS_CLIENT = [
    'happiness',
    'happy',
    'anger',
    'angry',
  ]

  /**cảm xúc có phải là tích cực không */
  public static isPositive(input: string): boolean {
    // kiểm tra trong danh sách cảm xúc tích cực
    return this.#POSITIVE_EMOTION.includes(input)
  }
  /**lấy icon của cảm xúc */
  public static getIcon(input?: string): string {
    // nếu không có input thì trả về chuỗi rỗng
    if (!input) return ''

    // trả về icon của cảm xúc
    return this.#ICON?.[input] || ''
  }
  /**cảm xúc này có cần nêu bật không */
  public static isHighlight(input: string): boolean {
    // kiểm tra trong danh sách cảm xúc
    return this.#HIGHT_LIGHT_EMOTION.includes(input)
  }
  /**cảm xúc này có cần nêu bật trong tin nhắn không */
  public static isHighlightInMess(
    input: string,
    type?: MessageInfo['message_type']
  ): boolean {
    // xử lý theo loại tin nhắn
    switch (type) {
      // tin của trang
      case 'page':
        return this.#HIGHT_LIGHT_EMOTION_MESS_PAGE.includes(input)
      // tin của khách
      case 'client':
        return this.#HIGHT_LIGHT_EMOTION_MESS_CLIENT.includes(input)
      // ẩn hết các tin khác
      default:
        return false
    }
  }
}
