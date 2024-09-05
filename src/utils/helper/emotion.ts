/**Lớp hỗ trợ xử lý cảm xúc */
export class Emotion {
  /**các cảm xúc */
  static #ICON: Record<string, string> = {
    happiness: '😊',
    anger: '😡',
    sadness: '😢',
    fear: '😱',
    surprise: '😲',
    disgust: '🤢',
    love: '❤️',
    jealousy: '😒',
    shame: '😳',
    pride: '😌',
  }
  /**các cảm xúc tích cực */
  static #POSITIVE_EMOTION = ['happiness', 'love', 'pride', 'surprise']

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
}
